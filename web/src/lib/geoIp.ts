import { UserLocation } from '@/types/job';

// California LA Koreatown Default Location (Location permission denied fallback)
export const LA_KOREATOWN_LOCATION: UserLocation = {
  address: '미국 캘리포니아 로스앤젤레스 한인타운 (LA Koreatown, CA 90010)',
  latitude: 34.0618,
  longitude: -118.3000,
  countryCode: 'US',
  countryName: '미국 (USA - California)',
  isGranted: false,
};

/**
 * Detects user's current location via Browser Geolocation API or GeoIP fallback.
 * If permission is denied or fails, defaults to California LA Koreatown.
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
            countryCode: 'KR',
            countryName: '대한민국 (Korea)',
            isGranted: true,
          });
        },
        async () => {
          // Fallback to GeoIP API if user denies GPS permission
          const fallback = await fetchGeoIp();
          resolve(fallback);
        },
        { timeout: 3000 }
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
          address: `${data.city || '접속 지역'}, ${data.region || ''} ${data.country_name || ''}`,
          latitude: data.latitude,
          longitude: data.longitude,
          countryCode: data.country_code || 'US',
          countryName: `${data.country_name || '미국'} (${data.country_code || 'US'})`,
          isGranted: true,
        };
      }
    }
  } catch (e) {
    console.warn('GeoIP fetch failed, fallback to LA Koreatown:', e);
  }
  // Default to California LA Koreatown if permission is not granted / failed
  return LA_KOREATOWN_LOCATION;
}
