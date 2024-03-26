import { displayStrings } from '$lib/i18n';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { passwordResetSchema } from '$lib/validationSchemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { isWithinExpirationDate } from 'oslo';
import { Argon2id } from 'oslo/password';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const pageStrings = displayStrings.pages['password-reset'].token;

export const load = async () => {
	const passwordResetForm = await superValidate(zod(passwordResetSchema));
	return { passwordResetForm };
};

export const actions = {
	default: async ({ request, params, fetch, cookies }) => {
		const token = params.token;
		const form = await superValidate(request, zod(passwordResetSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!token) {
			console.error('No password reset token provided.');
			return message(form, displayStrings.errors.unauthorized);
		}

		try {
			const verifiedToken = await getTokenAndDeleteToken(token);

			if (!verifiedToken || !isWithinExpirationDate(verifiedToken.expiresAt)) {
				return message(form, pageStrings.errors.expiredToken);
			}

			await lucia.invalidateUserSessions(verifiedToken.userId);
			const hashedPassword = await new Argon2id().hash(form.data.password);
			await db.user.update({
				where: {
					id: verifiedToken.userId
				},
				data: {
					hashedPassword
				}
			});

			const session = await lucia.createSession(verifiedToken.userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error) {
			console.error(`An error ocurred in reset password for token: ${token}:`, error);
			return message(form, displayStrings.errors.catchAll);
		}
		redirect(302, '/');
	}
} satisfies Actions;

async function getTokenAndDeleteToken(token: string) {
	const verifiedToken = await db.$transaction(async (prisma) => {
		const tokenData = await prisma.passwordResetToken.findFirst({
			where: {
				id: token
			}
		});

		if (tokenData) {
			await prisma.passwordResetToken.deleteMany({
				where: {
					id: token
				}
			});
		}

		return tokenData;
	});

	return verifiedToken;
}
