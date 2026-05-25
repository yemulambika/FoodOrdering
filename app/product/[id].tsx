import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyProductRoute() {
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;

  return <Redirect href={`/(user)/menu/${productId}` as any} />;
}
