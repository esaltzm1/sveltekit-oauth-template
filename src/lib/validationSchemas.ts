import { z } from 'zod';
import { displayStrings } from './i18n';

export const MIN_PASSWORD_STRING_LENGTH = 8;
export const EMAIL_VERIFICATION_CODE_LENGTH = 6;

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(MIN_PASSWORD_STRING_LENGTH)
});

export type LoginSchema = typeof loginSchema;

export const registerSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(MIN_PASSWORD_STRING_LENGTH),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: displayStrings.pages.register.errors.passwordsDontMatch,
		path: ['confirmPassword']
	});

export type RegisterSchema = typeof registerSchema;

export const passwordResetRequestSchema = z.object({
	email: z.string().email()
});

export type PasswordResetRequestSchema = typeof passwordResetRequestSchema;

export const passwordResetSchema = z
	.object({
		password: z.string().min(MIN_PASSWORD_STRING_LENGTH),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: displayStrings.pages.register.errors.passwordsDontMatch,
		path: ['confirmPassword']
	});

export type PasswordResetSchema = typeof passwordResetSchema;

export const verifyEmailSchema = z.object({
	verificationCode: z
		.string()
		.min(EMAIL_VERIFICATION_CODE_LENGTH)
		.max(EMAIL_VERIFICATION_CODE_LENGTH)
});

export type VerifyEmailSchema = typeof verifyEmailSchema;
