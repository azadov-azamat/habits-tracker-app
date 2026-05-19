import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

type PaperButtonProps = React.ComponentProps<typeof Button>;

type Tone = 'neutral' | 'danger';

type Props = Omit<PaperButtonProps, 'children' | 'mode' | 'style' | 'contentStyle' | 'buttonColor'> & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  tone?: Tone;
  size?: 'regular' | 'small';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: PaperButtonProps['contentStyle'];
};

export function AppButton({
  children,
  variant = 'primary',
  tone = 'neutral',
  size = 'regular',
  fullWidth,
  style,
  contentStyle,
  labelStyle,
  ...props
}: Props) {
  const theme = useTheme();
  const mode: PaperButtonProps['mode'] =
    variant === 'primary' ? 'contained' : variant === 'ghost' ? 'text' : 'outlined';

  const dangerColor = theme.colors.error;
  let textColor: string | undefined;
  let buttonColor: string | undefined;

  if (tone === 'danger') {
    if (variant === 'primary') {
      buttonColor = dangerColor;
      textColor = theme.colors.onPrimary;
    } else {
      textColor = dangerColor;
    }
  } else if (variant === 'primary') {
    textColor = theme.colors.onPrimary;
  } else {
    textColor = theme.colors.primary;
  }

  return (
    <Button
      {...props}
      mode={mode}
      textColor={textColor}
      buttonColor={buttonColor}
      style={[
        styles.button,
        size === 'small' && styles.smallButton,
        fullWidth && styles.fullWidth,
        style,
      ]}
      contentStyle={[
        styles.content,
        size === 'small' && styles.smallContent,
        contentStyle,
      ]}
      labelStyle={[styles.label, size === 'small' && styles.smallLabel, labelStyle]}
    >
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: 999 },
  smallButton: { borderRadius: 999 },
  fullWidth: { alignSelf: 'stretch' },
  content: { minHeight: 48, paddingHorizontal: 8 },
  smallContent: { minHeight: 38, paddingHorizontal: 4 },
  label: { fontWeight: '700', letterSpacing: 0 },
  smallLabel: { fontSize: 13 },
});
