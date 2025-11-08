import { useState, useEffect } from 'react';
import { findNearbyMatchaStores, Place } from '@/services/placesService';

interface UseMatchaStoresOptions {
  latitude?: number;
  longitude?: number;
  radius?: number;
  autoFetch?: boolean;
}

export function useMatchaStores({
  latitude,
  longitude,
  radius = 5000,
  autoFetch = true,
}: UseMatchaStoresOptions = {}) {
  const [stores, setStores] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStores = async (lat?: number, lng?: number) => {
    const searchLat = lat ?? latitude;
    const searchLng = lng ?? longitude;

    if (!searchLat || !searchLng) {
      setError(new Error('Location coordinates are required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await findNearbyMatchaStores(searchLat, searchLng, radius);
      setStores(results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch matcha stores'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && latitude && longitude) {
      fetchStores();
    }
  }, [latitude, longitude, radius, autoFetch]);

  return {
    stores,
    loading,
    error,
    refetch: fetchStores,
  };
}
