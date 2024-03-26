import { HOST_URL } from '$env/static/private';
import ResetPassword from '$lib/emailTemplates/ResetPassword.svelte';
import { ProjectError } from '$lib/errors';
import { displayStrings } from '$lib/i18n';
import { db } from '$lib/server/database';
import { passwordResetRequestSchema } from '$lib/validationSchemas';
import { fail, type Actions } from '@sveltejs/kit';
import { render } from 'svelte-email';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { generatePasswordResetToken } from './token';

const pageStrings = displayStrings.pages.login;

export const load = async () => {
	const passwordResetRequestForm = await superValidate(zod(passwordResetRequestSchema));
	return { passwordResetRequestForm };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(passwordResetRequestSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const userEmail = form.data.email.toLowerCase();

		try {
			const storedUser = await db.user.findUnique({
				where: {
					email: userEmail
				}
			});
			if (!storedUser) {
				return setError(form, 'email', pageStrings.errors.emailDoesNotExist);
			}
			const token = await generatePasswordResetToken(storedUser.id);
			const resetLink = `${HOST_URL}/password-reset/${token}`;
			console.log({ resetLink });
			const html = render({
				template: ResetPassword,
				props: {
					resetPasswordLink: resetLink
				}
			});

			// TODO: Uncomment when we are for real!

			// await sendEmail({
			// 	to: ['teddysaltzman@gmail.com', userEmail],
			// 	subject: 'Reset your password',
			// 	html: html
			// });
			return message(form, 'SUCCESS');
		} catch (error) {
			console.error('An error occured in reset password:', error);
			if (error instanceof ProjectError) {
				return message(form, error.message);
			}

			return message(form, displayStrings.errors.catchAll);
		}
	}
};
