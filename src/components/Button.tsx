import Colors from '@/constants/Colors';
import { forwardRef } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

type ButtonProps = {
  text: string;
} & PressableProps;

const Button = forwardRef<any, ButtonProps>(({ text, style, ...props }, ref) => {
  return (
    <Pressable ref={ref} style={[styles.container, style as StyleProp<ViewStyle>]} {...props}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default Button;
