/**
 * Haversine formula to compute great-circle distance between two points in km
 * @param {number} lat1 Latitude of point 1
 * @param {number} lon1 Longitude of point 1
 * @param {number} lat2 Latitude of point 2
 * @param {number} lon2 Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

/**
 * Compute Estimated Time of Arrival (ETA) in minutes
 * Assumes average city transit speed of ~25 km/h + 3 min buffer for preparation/traffic
 * @param {number} distanceKm Distance in kilometers
 * @returns {{ etaMinutes: number, isUnder30Min: boolean, etaFormatted: string }}
 */
export function computeEta(distanceKm) {
  const avgSpeedKmh = 25; // 25 km/h requirement
  const transitMinutes = (distanceKm / avgSpeedKmh) * 60;
  const bufferMinutes = 3;
  const totalMinutes = Math.max(5, Math.ceil(transitMinutes + bufferMinutes));

  return {
    etaMinutes: totalMinutes,
    isUnder30Min: totalMinutes <= 30,
    etaFormatted: totalMinutes <= 60 ? `${totalMinutes} min` : `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
  };
}
