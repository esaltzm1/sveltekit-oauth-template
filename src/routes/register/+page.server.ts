import { displayStrings } from '$lib/i18n';
import { lucia } from '$lib/server/auth';
import { db, getNewUsernameIfInvalid } from '$lib/server/database';
import { generateAndSendEmailVerificationCode } from '$lib/utils/emailUtils';
import { registerSchema } from '$lib/validationSchemas';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { redirect, type Actions } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const pageStrings = displayStrings.pages.register;
const USER_TABLE_UNIQUE_CONSTRAINT_ERROR = 'Unique constraint failed on the';

export const load = async () => {
	const registerForm = await superValidate(zod(registerSchema));
	return { registerForm };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(registerSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const hashedPassword = await new Argon2id().hash(form.data.password);
		const userId = generateId(15);

		try {
			const username = await getNewUsernameIfInvalid(form.data.email.split('@')[0].toLowerCase());

			await db.user.create({
				data: {
					id: userId,
					email: form.data.email,
					username,
					hashedPassword,
					isEmailVerified: false
				}
			});

			await generateAndSendEmailVerificationCode(userId, form.data.email);

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.message.startsWith(USER_TABLE_UNIQUE_CONSTRAINT_ERROR)
			) {
				return setError(form, 'email', pageStrings.errors.accountExistsWithEmail);
			}
			console.error({ error });
			return message(form, displayStrings.errors.catchAll);
		}
		return redirect(302, '/');
	}
};
