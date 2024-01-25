import { prisma } from '$lib/prisma';
import type { LatLngTuple } from 'leaflet';

export async function load() {
	const pois = await prisma.pointOfInterest.findClosestPoints(
		44.41117247990487,
		1.188196086038296,
		100
	);
	return {
		points: pois.map((poi) => {
			return {
				name: poi.name,
				lnglat: [poi.location.longitude, poi.location.latitude] as LatLngTuple
			};
		})
	};
}
