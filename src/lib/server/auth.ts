import { dev } from '$app/environment';
import { db } from '$lib/server/database';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { Lucia } from 'lucia';

interface DatabaseUserAttributes {
	email: string;
	isEmailVerified: boolean;
}

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			isEmailVerified: attributes.isEmailVerified
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
