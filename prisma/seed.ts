import { prisma } from '../src/lib/prisma.js';

async function main() {
	await prisma.pointOfInterest.create({
		name: 'Radio France',
		latitude: 48.85252974671835,
		longitude: 2.278322741840701
	});
	await prisma.pointOfInterest.create({
		name: 'Macron',
		latitude: 44.33954553583093,
		longitude: 1.2083876257526915
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
