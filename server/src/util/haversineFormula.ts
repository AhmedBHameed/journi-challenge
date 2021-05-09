interface LocationData {
  sourceLat: number;
  sourceLng: number;
  destinationLat: number;
  destinationLng: number;
}

const toRad = (value: number) => (value * Math.PI) / 180;

export function haversineFormula(data: LocationData) {
  const R = 6371; // km
  const dLat = toRad(data.destinationLat - data.sourceLat);
  const dLon = toRad(data.destinationLng - data.sourceLng);
  const lat1 = toRad(data.sourceLat);
  const lat2 = toRad(data.destinationLat);
  // const a =
  //   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //   Math.cos(toRad(data.sourceLat)) * Math.cos(toRad(data.destinationLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  // const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}
