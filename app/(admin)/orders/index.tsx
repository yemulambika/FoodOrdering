import { Redirect } from 'expo-router';

export default function AdminOrdersIndex() {
  return <Redirect href="/(admin)/orders/list" />;
}
