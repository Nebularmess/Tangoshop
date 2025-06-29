// src/components/Form/FormComponent.tsx
import { COLORS } from '@/src/constants/colors';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

interface FormField {
  key: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

interface FormComponentProps {
  title: string;
  subtitle: string;
  fields: FormField[];
  primaryButtonText: string;
  secondaryButtonText: string;
  onPrimaryButtonPress: (formData: Record<string, string>) => void;
  onSecondaryButtonPress: () => void;
  onForgotPassword?: () => void;
  showForgotPassword?: boolean;
  isLoginScreen?: boolean;
}

const FormComponent: React.FC<FormComponentProps> = ({
  title,
  subtitle,
  fields,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  onForgotPassword,
  showForgotPassword = false,
  isLoginScreen = false,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log('Form data being submitted:', formData);
    onPrimaryButtonPress(formData);
  };

  // Determinar si estamos en la pantalla de login o register basado en isLoginScreen prop
  const isRegisterScreen = !isLoginScreen;
  const isLoading = primaryButtonText.includes('...');

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isLoginScreen && styles.toggleButtonActive
            ]}
            onPress={isLoginScreen ? undefined : onSecondaryButtonPress}
            disabled={isLoginScreen}
          >
            <Text style={[
              styles.toggleButtonText,
              isLoginScreen && styles.toggleButtonTextActive
            ]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isRegisterScreen && styles.toggleButtonActive
            ]}
            onPress={isRegisterScreen ? undefined : onSecondaryButtonPress}
            disabled={isRegisterScreen}
          >
            <Text style={[
              styles.toggleButtonText,
              isRegisterScreen && styles.toggleButtonTextActive
            ]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        {fields.map((field) => (
          <View key={field.key} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {field.placeholder}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={field.placeholder}
              placeholderTextColor={COLORS.textSecondary + '80'}
              value={formData[field.key] || ''}
              onChangeText={(value) => handleInputChange(field.key, value)}
              secureTextEntry={field.secureTextEntry}
              keyboardType={field.keyboardType || 'default'}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
        ))}

        {/* Forgot Password */}
        {showForgotPassword && (
          <TouchableOpacity 
            onPress={onForgotPassword} 
            style={styles.forgotPasswordContainer}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        {/* Primary Button */}
        <TouchableOpacity 
          style={[
            styles.primaryButton,
            isLoading && styles.primaryButtonLoading
          ]} 
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={isLoading ? 1 : 0.8}
        >
          <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
    marginTop: moderateScale(40),
    marginBottom: moderateScale(20),
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(25),
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: moderateScale(8),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: moderateScale(350),
    alignSelf: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(20),
    padding: moderateScale(3),
    marginBottom: moderateScale(20),
    marginHorizontal: moderateScale(10),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: moderateScale(10),
    alignItems: 'center',
    borderRadius: moderateScale(16),
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: moderateScale(14),
    color: COLORS.textSecondary + '80',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: moderateScale(16),
    marginHorizontal: moderateScale(5),
  },
  inputLabel: {
    fontSize: moderateScale(12),
    color: COLORS.text,
    marginBottom: moderateScale(6),
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    fontSize: moderateScale(14),
    color: COLORS.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: moderateScale(20),
    marginHorizontal: moderateScale(5),
  },
  forgotPasswordText: {
    fontSize: moderateScale(12),
    color: COLORS.linkText,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(20),
    paddingVertical: moderateScale(14),
    alignItems: 'center',
    marginBottom: moderateScale(16),
    marginHorizontal: moderateScale(10),
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonLoading: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: COLORS.buttonText,
  },
});

export default FormComponent;