import { env } from '$env/dynamic/private';
import { ProjectError } from '$lib/errors';
import { displayStrings } from '$lib/i18n';
import { Resend } from 'resend';

export type CreateEmail = {
	to: string[];
	subject: string;
	html: string;
};
export async function sendEmail(email: CreateEmail) {
	const resend = new Resend(env.RESEND_API_KEY);

	const fromEmailAddress = env.FROM_EMAIL_ADDRESS ? env.FROM_EMAIL_ADDRESS : '';
	const emailToSend = {
		from: fromEmailAddress,
		to: [...email.to],
		subject: email.subject,
		html: email.html
	};
	const { data, error } = await resend.emails.send(emailToSend);

	if (error) {
		console.error('Error in sendEmail', error);
		throw new ProjectError(
			'RESEND_API_ERROR',
			displayStrings.pages['password-reset'].errors.resendApiError,
			''
		);
	}

	return data;
}
