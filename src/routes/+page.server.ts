import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load = (async () => {
	const date = new Date();
	date.setHours(0, 0, 0, 0);

	const products = await prisma.product.findMany({
		where: {
			removalDate: {
				lte: date
			}
		}
	});

	const locations = await prisma.locations.findMany({
		orderBy: {
			name: 'asc'
		}
	});

	const employees = await prisma.employees.findMany({
		orderBy: {
			name: 'asc'
		}
	});

	return {
		products,
		locations,
		employees
	};
}) satisfies PageServerLoad;
