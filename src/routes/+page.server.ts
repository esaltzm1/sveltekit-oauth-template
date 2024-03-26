import { lucia } from '$lib/server/auth';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	logout: async ({ cookies, locals }) => {
		if (!locals.session) {
			redirect(302, '/');
		}
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/');
	}
};
