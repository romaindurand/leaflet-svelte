import { normalizePoints, typedJson } from '$lib';
import { prisma } from '$lib/prisma';

export async function GET(event) {
	const queryParameters = event.url.searchParams;
	const pois = await prisma.pointOfInterest.findPointsInBounds(
		Number(queryParameters.get('lat1')),
		Number(queryParameters.get('lng1')),
		Number(queryParameters.get('lat2')),
		Number(queryParameters.get('lng2')),
		2.2944907544423487,
		48.8584104782701,
		100
	);
	return typedJson({
		points: normalizePoints(pois)
	});
}
