import { dev } from '$app/environment';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_REDIRECT_URL,
	GOOGLE_CLIENT_SECRET
} from '$env/static/private';
import { db } from '$lib/server/database';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { Google } from 'arctic';
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

export const googleAuth = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CLIENT_REDIRECT_URL
);

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
