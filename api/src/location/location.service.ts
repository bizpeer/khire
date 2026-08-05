import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationService {
  /**
   * PostGIS ST_DistanceSphere & ST_DWithin query generator
   * @param userLat Latitude of user
   * @param userLng Longitude of user
   * @param radiusKm Radius filter in km
   */
  getNearbyJobsQuery(userLat: number, userLng: number, radiusKm: number) {
    const radiusMeters = radiusKm * 1000;
    
    // Raw PostGIS SQL representation
    return {
      sql: `
        SELECT 
          j.*,
          c.name AS company_name,
          ST_DistanceSphere(
            ST_MakePoint(j.longitude, j.latitude),
            ST_MakePoint($1, $2)
          ) / 1000.0 AS distance_km
        FROM "Job" j
        JOIN "Company" c ON j."companyId" = c.id
        WHERE 
          j.status = 'ACTIVE'
          ${
            radiusKm > 0
              ? `AND ST_DWithin(
                  ST_MakePoint(j.longitude, j.latitude)::geography,
                  ST_MakePoint($1, $2)::geography,
                  $3
                )`
              : ''
          }
        ORDER BY distance_km ASC;
      `,
      params: radiusKm > 0 ? [userLng, userLat, radiusMeters] : [userLng, userLat],
    };
  }
}
