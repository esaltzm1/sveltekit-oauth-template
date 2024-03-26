import { displayStrings } from '$lib/i18n';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { loginSchema } from '$lib/validationSchemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const pageStrings = displayStrings.pages.login;

export const load = async () => {
	const loginForm = await superValidate(zod(loginSchema));

	return { loginForm };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const existingUser = await db.user.findUnique({
			where: {
				email: form.data.email
			}
		});

		if (!existingUser || !existingUser.hashedPassword) {
			return message(form, pageStrings.errors.emailDoesNotExist);
		}

		const validPassword = await new Argon2id().verify(
			existingUser.hashedPassword,
			form.data.password
		);
		if (!validPassword) {
			return message(form, pageStrings.errors.invalidPassword);
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return redirect(302, '/');
	}
};
