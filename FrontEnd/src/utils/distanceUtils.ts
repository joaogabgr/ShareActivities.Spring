export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Raio da Terra em metros
  const dLat = toRadianos(lat2 - lat1);
  const dLon = toRadianos(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadianos(lat1)) * Math.cos(toRadianos(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em metros
  return distance;
}

export function formatarDistancia(distancia: number): string {
  if (distancia < 1000) {
    // Se for menos de 1 km, mostra em metros
    return `${Math.round(distancia)}m`;
  } else {
    // Se for mais de 1 km, mostra em km com uma casa decimal
    return `${(distancia / 1000).toFixed(1)}km`;
  }
}

function toRadianos(graus: number): number {
  return graus * (Math.PI / 180);
}


export function extrairCoordenadas(latLngString: string | undefined | null): [number, number] | null {
  if (!latLngString) return null;
  
  const partes = latLngString.split(',');
  if (partes.length !== 2) return null;
  
  const lat = parseFloat(partes[0]);
  const lng = parseFloat(partes[1]);
  
  if (isNaN(lat) || isNaN(lng)) return null;
  
  return [lat, lng];
} 