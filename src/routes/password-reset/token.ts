import { db } from '$lib/server/database';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

import { generateId } from 'lucia';
import { TimeSpan, createDate } from 'oslo';

export async function generatePasswordResetToken(userId: string): Promise<string> {
	// invalidate all existing tokens
	await db.passwordResetToken.deleteMany({
		where: {
			userId
		}
	});
	const tokenId = generateId(40);

	await db.passwordResetToken.create({
		data: {
			id: tokenId,
			userId,
			expiresAt: createDate(new TimeSpan(2, 'h'))
		}
	});
	return tokenId;
}
