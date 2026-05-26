import { Redirect } from 'expo-router';

/** Legacy route — menu tab replaced by home + restaurant flows. */
export default function LegacyMenuIndex() {
  return <Redirect href="/(user)/home" />;
}
