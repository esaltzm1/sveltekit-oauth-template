import prisma from '@prisma/client';
import { adjectives, nouns } from './wordLists';

export const db = new prisma.PrismaClient();

export const getNewUsernameIfInvalid = async (username: string): Promise<string> => {
	const isUsernameTaken = await db.user.findUnique({
		where: {
			username: username
		}
	});

	if (isUsernameTaken) {
		const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
		const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

		const generatedUsername = `${randomAdjective}-${randomNoun}`;
		return getNewUsernameIfInvalid(generatedUsername);
	} else {
		return username;
	}
};
