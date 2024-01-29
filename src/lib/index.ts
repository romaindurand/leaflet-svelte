// place files you want to import through the `$lib` alias in this folder.
import { json } from '@sveltejs/kit';
import type { LatLngBounds, LatLngTuple } from 'leaflet';
import type { MyPointOfInterest } from './prisma';

interface TypedResponse<T = unknown> extends Response {
	json(): Promise<T>;
}

export function typedJson<T>(x: T) {
	return json(x) as TypedResponse<T>;
}

export function normalizePoints(pois: MyPointOfInterest[]) {
	return pois.map((poi) => {
		return {
			name: poi.name,
			lnglat: [poi.location.longitude, poi.location.latitude] as LatLngTuple
		};
	});
}

export async function fetchPointsInBounds(bounds: LatLngBounds) {
	const northEast = bounds.getNorthEast();
	const southWest = bounds.getSouthWest();
	const urlParams = new URLSearchParams({
		lat1: southWest.lat.toString(),
		lng1: southWest.lng.toString(),
		lat2: northEast.lat.toString(),
		lng2: northEast.lng.toString()
	});
	const response = await (fetch(`/api/pointsInBounds?${urlParams.toString()}`) as ReturnType<
		typeof import('$api/pointsInBounds/+server').GET
	>);
	const data = await response.json();
	return data.points;
}
