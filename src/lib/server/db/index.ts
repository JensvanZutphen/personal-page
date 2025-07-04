import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

// By declaring globalThis, we can ensure that there is only one instance of Prisma Client in development.
// This prevents memory leaks and other issues that can occur when you have multiple instances of Prisma Client running at the same time.
declare const globalThis: {
	prisma: PrismaClient | undefined;
};

const prisma = globalThis.prisma ?? new PrismaClient();

if (dev) {
	globalThis.prisma = prisma;
}

export { prisma };
