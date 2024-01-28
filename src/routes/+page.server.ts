import { prisma, type MyPointOfInterest } from '$lib/prisma';
import type { LatLngTuple } from 'leaflet';
import type { Actions } from './$types';
import type { Load } from '@sveltejs/kit';

export const load = async function () {
	const pois = await findClosestPointsToEiffelTower();
	return {
		points: normalizePoints(pois)
	};
} satisfies Load;

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		await prisma.pointOfInterest.create({
			name: formData.get('name')?.toString() ?? 'No name',
			latitude: Number(formData.get('lat')),
			longitude: Number(formData.get('lng'))
		});
		const points = await findClosestPointsToEiffelTower();
		return { success: true, points: normalizePoints(points) };
	}
} satisfies Actions;

function normalizePoints(pois: MyPointOfInterest[]) {
	return pois.map((poi) => {
		return {
			name: poi.name,
			lnglat: [poi.location.longitude, poi.location.latitude] as LatLngTuple
		};
	});
}

async function findClosestPointsToEiffelTower() {
	const pois = await prisma.pointOfInterest.findClosestPoints(
		48.8584104782701,
		2.2944907544423487,
		100
	);
	return pois;
}
