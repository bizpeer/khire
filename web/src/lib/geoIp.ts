import { UserLocation } from '@/types/job';

// Australia Sydney Default Location (Fallback)
export const SYDNEY_DEFAULT_LOCATION: UserLocation = {
  address: '호주 시드니 스트라스필드 한인타운 (Sydney NSW 2135, Australia)',
  latitude: -33.8688,
  longitude: 151.2093,
  countryCode: 'AU',
  countryName: '호주 (Australia - Sydney)',
  isGranted: false,
};

/**
 * Detects user's current location via Browser Geolocation API or GeoIP fallback.
 * Defaults to Australia Sydney.
 */
export async function detectUserLocation(): Promise<UserLocation> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({
            address: `GPS 접속 위치 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            latitude,
            longitude,
            countryCode: 'AU',
            countryName: '호주 (Australia)',
            isGranted: true,
          });
        },
        async () => {
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
          countryCode: data.country_code || 'AU',
          countryName: `${data.country_name || '호주'} (${data.country_code || 'AU'})`,
          isGranted: true,
        };
      }
    }
  } catch (e) {
    console.warn('GeoIP fetch failed, fallback to Sydney Australia:', e);
  }
  return SYDNEY_DEFAULT_LOCATION;
}
