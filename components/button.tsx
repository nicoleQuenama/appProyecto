import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native'
import { Colors } from '../constants/colors'

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export default function Button({ 
  title, 
  variant = 'primary', 
  isLoading = false, 
  style, 
  ...props 
}: ButtonProps) {
  
  const getBackgroundColor = () => {
    if (props.disabled) return Colors.textHint;
    if (variant === 'secondary') return Colors.secondary;
    if (variant === 'danger') return Colors.danger;
    return Colors.textPrimary; // El primary oscuro que definimos en el home
  }

  const getTextColor = () => {
    return Colors.cardBg; // Blanco
  }

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: getBackgroundColor() }, 
        style
      ]} 
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontWeight: '600',
    fontSize: 15,
  }
})