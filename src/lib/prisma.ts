import { PrismaClient } from '@prisma/client';

type MyPoint = {
	latitude: number;
	longitude: number;
};

export type MyPointOfInterest = {
	name: string;
	location: MyPoint;
};

export const prisma = new PrismaClient().$extends({
	model: {
		pointOfInterest: {
			async create(data: { name: string; latitude: number; longitude: number }) {
				// Create an object using the custom types from above
				const poi: MyPointOfInterest = {
					name: data.name,
					location: {
						latitude: data.latitude,
						longitude: data.longitude
					}
				};

				// Insert the object into the database
				const point = `POINT(${poi.location.longitude} ${poi.location.latitude})`;
				// eslint-disable-next-line @ts-safeql/check-sql
				await prisma.$queryRaw`
          INSERT INTO "PointOfInterest" (name, location) VALUES (${poi.name}, ST_GeomFromText(${point}, 4326));
        `;

				// Return the object
				return poi;
			},
			async findClosestPoints(latitude: number, longitude: number, limit: number = 10) {
				// Query for clostest points of interests
				const result = await prisma.$queryRaw<
					{
						id: number;
						name: string;
						st_x: number | null;
						st_y: number | null;
					}[]
				>`SELECT id, name, ST_X(location::geometry), ST_Y(location::geometry) 
            FROM "PointOfInterest" 
            ORDER BY ST_DistanceSphere(location::geometry, ST_MakePoint(${latitude}, ${longitude})) ASC
						LIMIT ${limit}`;

				// Transform to our custom type
				const pois: MyPointOfInterest[] = result.map((data) => {
					return {
						name: data.name,
						location: {
							latitude: data.st_x || 0,
							longitude: data.st_y || 0
						}
					};
				});

				// Return data
				return pois;
			}
		}
	}
});
