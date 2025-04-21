import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { colors, fonts, shadows, spacing } from '@/src/globalCSS';
import { MessageInputProps } from '../types';

// Componente para o campo de entrada de mensagem
const MessageInput = ({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage, 
  sendingMessage, 
  isConnected 
}: MessageInputProps) => (
  <View style={styles.inputWrapper}>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua mensagem..."
        value={newMessage}
        onChangeText={setNewMessage}
        multiline
        editable={!sendingMessage}
        onSubmitEditing={handleSendMessage}
      />
      {sendingMessage ? (
        <View style={styles.sendButton}>
          <ActivityIndicator size="small" color={colors.textLight} />
        </View>
      ) : (
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (!newMessage.trim() || !isConnected) && styles.disabledButton
          ]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || !isConnected}
        >
          <FontAwesomeIcon 
            icon={faPaperPlane} 
            size={18} 
            color={colors.textLight}
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  inputWrapper: {
    paddingHorizontal: spacing.medium,
    paddingBottom: Platform.OS === 'ios' ? spacing.medium : spacing.small,
    paddingTop: spacing.small,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.small,
    ...shadows.small,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: spacing.medium,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.small,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default MessageInput; 