import { displayStrings } from '$lib/i18n';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { generateAndSendEmailVerificationCode } from '$lib/utils/emailUtils';
import { verifyEmailSchema } from '$lib/validationSchemas';
import { redirect, type Actions } from '@sveltejs/kit';
import type { User } from 'lucia';
import { isWithinExpirationDate } from 'oslo';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const pageStrings = displayStrings.pages['verify-email'];

export const load = async () => {
	const verifyEmailForm = await superValidate(zod(verifyEmailSchema));
	return { verifyEmailForm };
};

export const actions: Actions = {
	confirmCode: async ({ request, locals, cookies }) => {
		if (!locals.user) redirect(302, '/');
		const form = await superValidate(request, zod(verifyEmailSchema));

		const code = form.data.verificationCode;
		if (typeof code !== 'string') {
			return message(form, pageStrings.errors.invalidVerificationCode);
		}

		const validCode = await verifyVerificationCode(locals.user, code);
		if (!validCode) {
			return message(form, pageStrings.errors.invalidVerificationCode);
		}

		await lucia.invalidateUserSessions(locals.user.id);

		await db.user.update({
			where: {
				id: locals.user.id
			},
			data: {
				isEmailVerified: true
			}
		});

		const session = await lucia.createSession(locals.user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/');
	},
	newCode: async ({ locals }) => {
		if (locals.user) generateAndSendEmailVerificationCode(locals.user.id, locals.user.email);
	}
};

async function verifyVerificationCode(user: User, code: string): Promise<boolean> {
	const isVerified = await db.$transaction(async (prisma) => {
		const databaseCode = await prisma.emailVerificationCode.findUnique({
			where: {
				userId: user.id
			}
		});

		if (!databaseCode || databaseCode.code !== code) {
			return false;
		}
		await db.emailVerificationCode.delete({
			where: {
				id: databaseCode.id
			}
		});

		if (!isWithinExpirationDate(databaseCode.expiresAt)) {
			return false;
		}

		if (databaseCode.email !== user.email) {
			return false;
		}

		return true;
	});

	return isVerified;
}
