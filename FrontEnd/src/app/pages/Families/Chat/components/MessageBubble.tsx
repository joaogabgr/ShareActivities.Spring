import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, shadows, spacing } from '@/src/globalCSS';
import { MessageBubbleProps } from '../types';

// Componente para uma mensagem individual
const MessageBubble = ({ 
  message, 
  isCurrentUser, 
  isPreviousSameSender, 
  isNextSameSender, 
  isCloseTimeToPrevious, 
  shouldShowSender, 
  shouldShowTimestamp, 
  formatDate 
}: MessageBubbleProps) => (
  <View 
    style={[
      styles.messageContainer,
      isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
      isPreviousSameSender && isCloseTimeToPrevious && { marginTop: -spacing.small }
    ]}
  >
    {shouldShowSender && (
      <Text style={styles.senderName}>
        {message.sender.name}
        {message.sender.isAdmin && ' (Admin)'}
      </Text>
    )}
    
    <View style={[
      styles.messageBubble,
      isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
      isPreviousSameSender && isCloseTimeToPrevious && { 
        borderTopRightRadius: isCurrentUser ? 8 : 16,
        borderTopLeftRadius: !isCurrentUser ? 8 : 16
      },
      isNextSameSender && { 
        borderBottomRightRadius: isCurrentUser ? 8 : 16,
        borderBottomLeftRadius: !isCurrentUser ? 8 : 16
      }
    ]}>
      <Text style={[
        styles.messageText,
        isCurrentUser ? styles.currentUserText : styles.otherUserText
      ]}>
        {message.text}
      </Text>
    </View>
    
    {shouldShowTimestamp && (
      <Text style={styles.timestamp}>
        {formatDate(message.timestamp)}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: spacing.small,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.small,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    ...shadows.small,
  },
  currentUserBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: fonts.size.medium,
  },
  currentUserText: {
    color: colors.textLight,
  },
  otherUserText: {
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: fonts.size.xs,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    marginRight: spacing.xs,
  },
});

export default MessageBubble; 