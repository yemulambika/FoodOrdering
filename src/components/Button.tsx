import theme from '@/constants/theme';
import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

type ButtonProps = {
  text: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
} & PressableProps;

const Button = forwardRef<any, ButtonProps>(
  ({ text, style, loading, variant = 'primary', disabled, ...props }, ref) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    return (
      <Pressable
        ref={ref}
        disabled={disabled || loading}
        style={[
          styles.base,
          isPrimary && styles.primary,
          variant === 'secondary' && styles.secondary,
          isOutline && styles.outline,
          (disabled || loading) && styles.disabled,
          style as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={isOutline ? theme.colors.primary : theme.colors.white} />
        ) : (
          <Text
            style={[
              styles.text,
              isOutline && styles.textOutline,
              variant === 'secondary' && styles.textSecondary,
            ]}
          >
            {text}
          </Text>
        )}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: theme.radius.full,
    marginVertical: 8,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    ...theme.shadow.button,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  disabled: { opacity: 0.55 },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  textOutline: { color: theme.colors.primary },
  textSecondary: { color: theme.colors.white },
});

export default Button;
