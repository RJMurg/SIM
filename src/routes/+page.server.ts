import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load = (async () => {
    await prisma.product

    return {};
}) satisfies PageServerLoad;