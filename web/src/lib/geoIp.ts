import { UserLocation } from '@/types/job';
import { INITIAL_USER_LOCATION } from '@/lib/mockJobs';

/**
 * Detects user's current location via Browser Geolocation API or GeoIP fallback
 */
export async function detectUserLocation(): Promise<UserLocation> {
  return new Promise((resolve) => {
    // 1. Try Browser Geolocation API
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({
            address: `GPS 접속 위치 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            latitude,
            longitude,
          });
        },
        async () => {
          // Fallback to GeoIP API if user denies GPS permission
          const fallback = await fetchGeoIp();
          resolve(fallback);
        },
        { timeout: 4000 }
      );
    } else {
      fetchGeoIp().then(resolve);
    }
  });
}

async function fetchGeoIp(): Promise<UserLocation> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          address: `${data.city || '접속 위치'} (${data.ip || 'IP Location'})`,
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
    }
  } catch (e) {
    console.warn('GeoIP fetch failed, fallback to default location:', e);
  }
  return INITIAL_USER_LOCATION;
}
