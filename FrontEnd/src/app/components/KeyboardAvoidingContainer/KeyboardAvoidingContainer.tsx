import React from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  ViewStyle,
  KeyboardAvoidingViewProps,
  ScrollView
} from 'react-native';

interface KeyboardAvoidingContainerProps extends KeyboardAvoidingViewProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  formType?: 'auth' | 'form';
}

const KeyboardAvoidingContainer: React.FC<KeyboardAvoidingContainerProps> = ({
  children,
  containerStyle,
  formType = 'form',
  ...props
}) => {
  // Para formulários de autenticação, usamos um comportamento diferente
  const getBehavior = () => {
    if (Platform.OS === 'ios') {
      return 'padding';
    }
    return formType === 'auth' ? undefined : 'height';
  };

  // Ajusta o offset baseado no tipo de formulário
  const getOffset = () => {
    if (Platform.OS === 'ios') {
      return formType === 'auth' ? 0 : 0;
    }
    return formType === 'auth' ? 20 : 90;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, containerStyle]}
      behavior={getBehavior()}
      keyboardVerticalOffset={getOffset()}
      enabled
      {...props}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          formType === 'auth' && styles.authContent
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  authContent: {
    justifyContent: 'center',
  },
});

export default KeyboardAvoidingContainer; 