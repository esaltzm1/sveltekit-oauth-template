import { dev } from '$app/environment';
import { googleAuth } from '$lib/server/auth';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

export const GET = (async ({ cookies, locals, url }) => {
	const user = locals.user;
	const redirectTo = url.searchParams.get('redirectTo') ?? '';
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	if (user) {
		return redirect(302, '/');
	}
	const googleUrl = await googleAuth.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email']
	});

	// store state
	cookies.set('state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});

	cookies.set('code_verifier', codeVerifier, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 10
	});

	return redirect(302, googleUrl.toString());
}) satisfies RequestHandler;
