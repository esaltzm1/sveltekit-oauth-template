import { googleAuth, lucia } from '$lib/server/auth';
import { db, getNewUsernameIfInvalid } from '$lib/server/database';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';

export const GET = (async ({ url, cookies, locals }) => {
	const user = locals.user;
	const redirectTo = cookies.get('redirectTo');
	if (user) {
		return json(redirect(302, `/${redirectTo}`));
	}

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const storedState = cookies.get('state');
	const storedCodeVerifier = cookies.get('code_verifier');

	if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await googleAuth.validateAuthorizationCode(code, storedCodeVerifier);
		const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const googleUser = await googleUserResponse.json();

		const existingUserByGoogleId = await db.oauthAccount.findUnique({
			where: {
				providerId_providerUserId: {
					providerId: 'google',
					providerUserId: googleUser.sub
				}
			}
		});

		const existingUserByEmail = await db.user.findUnique({
			where: {
				email: googleUser.email
			}
		});

		if (existingUserByGoogleId) {
			const session = await lucia.createSession(existingUserByGoogleId.userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else if (existingUserByEmail) {
			await db.user.update({
				where: {
					email: existingUserByEmail.email
				},
				data: {
					isEmailVerified: true,
					oauthAccounts: {
						create: {
							providerId: 'google',
							providerUserId: googleUser.sub
						}
					}
				}
			});
			const session = await lucia.createSession(existingUserByEmail.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(15);
			let username = await getNewUsernameIfInvalid(googleUser.given_name.toLowerCase() ?? '');
			await db.user.create({
				data: {
					id: userId,
					username,
					email: googleUser.email,
					isEmailVerified: true,
					oauthAccounts: {
						create: {
							providerId: 'google',
							providerUserId: googleUser.sub
						}
					}
				}
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
	} catch (err) {
		console.error('error in google callback', err);
		if (err instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
	return redirect(302, '/');
}) satisfies RequestHandler;
