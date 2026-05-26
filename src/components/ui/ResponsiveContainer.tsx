import { useResponsiveGrid } from '@/hooks/useResponsiveGrid';
import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type ResponsiveContainerProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

/** Centers content and caps width on tablet/web. */
export default function ResponsiveContainer({
  children,
  style,
}: ResponsiveContainerProps) {
  const { containerWidth, padding } = useResponsiveGrid();

  return (
    <View style={[styles.outer, style]}>
      <View
        style={[
          styles.inner,
          { maxWidth: containerWidth, paddingHorizontal: padding },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
});
