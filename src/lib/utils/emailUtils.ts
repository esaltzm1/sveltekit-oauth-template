import { env } from '$env/dynamic/private';
import VerifyEmail from '$lib/emailTemplates/VerifyEmail.svelte';
import { ProjectError } from '$lib/errors';
import { displayStrings } from '$lib/i18n';
import { db } from '$lib/server/database';
import { EMAIL_VERIFICATION_CODE_LENGTH } from '$lib/validationSchemas';
import { TimeSpan } from 'lucia';
import { createDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { Resend } from 'resend';
import { render } from 'svelte-email';

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

export async function generateAndSendEmailVerificationCode(userId: string, email: string) {
	const verificationCode = await generateEmailVerificationCode(userId, email);
	console.log({ verificationCode });
	// TODO: Uncomment when we are for real!
	// await sendVerificationCode(form.data.email, verificationCode);
}

async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
	await db.emailVerificationCode.deleteMany({
		where: {
			userId
		}
	});
	const code = generateRandomString(EMAIL_VERIFICATION_CODE_LENGTH, alphabet('0-9'));

	await db.emailVerificationCode.create({
		data: {
			userId,
			email,
			code,
			expiresAt: createDate(new TimeSpan(15, 'm')) // 15 minutes
		}
	});

	return code;
}

async function sendVerificationCode(email: string, verificationCode: string) {
	const html = render({
		template: VerifyEmail,
		props: {
			verificationCode
		}
	});

	await sendEmail({
		to: ['teddysaltzman@gmail.com', email],
		subject: 'Verify your email',
		html: html
	});
}
