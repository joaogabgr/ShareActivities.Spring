import React, { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import TimeDivider from './TimeDivider';
import EmptyState from './EmptyState';
import { colors, spacing } from '@/src/globalCSS';

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  formatDate: (date: Date) => string;
  messagesListRef: React.RefObject<FlatList<Message>>;
  scrollToBottom: (animated?: boolean) => void;
}

const ChatMessages = ({ 
  messages, 
  currentUserId, 
  formatDate, 
  messagesListRef, 
  scrollToBottom 
}: ChatMessagesProps) => {
  
  // Memoize a função de renderização para melhorar o desempenho
  const renderMessage = useMemo(() => {
    return ({ item, index }: { item: Message, index: number }) => {
      const isCurrentUser = item.sender.id === currentUserId;
      
      // Verificar se é parte de uma sequência de mensagens do mesmo remetente
      const previousMessage = index > 0 ? messages[index - 1] : null;
      const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
      
      // Verificar se é a mesma pessoa que enviou a mensagem anterior
      const isPreviousSameSender = previousMessage ? 
                                  previousMessage.sender.id === item.sender.id : false;
      
      // Verificar se é a mesma pessoa que enviou a próxima mensagem
      const isNextSameSender = nextMessage ? 
                              nextMessage.sender.id === item.sender.id : false;
      
      // Verificar o tempo entre mensagens (máximo 5 minutos para considerar sequência)
      const isCloseTimeToPrevious = previousMessage ? 
                                    Math.abs(item.timestamp.getTime() - previousMessage.timestamp.getTime()) < 5 * 60 * 1000 : false;
      
      // Determinar se exibe o nome do remetente (apenas na primeira mensagem da sequência)
      const shouldShowSender = !isCurrentUser && !isPreviousSameSender;
      
      // Determinar se exibe o timestamp (apenas na última mensagem da sequência)
      const shouldShowTimestamp = !isNextSameSender || 
                                (nextMessage ? 
                                Math.abs(nextMessage.timestamp.getTime() - item.timestamp.getTime()) > 5 * 60 * 1000 : true);
      
      return (
        <MessageBubble
          message={item}
          isCurrentUser={isCurrentUser}
          isPreviousSameSender={isPreviousSameSender}
          isNextSameSender={isNextSameSender}
          isCloseTimeToPrevious={isCloseTimeToPrevious}
          shouldShowSender={shouldShowSender}
          shouldShowTimestamp={shouldShowTimestamp}
          formatDate={formatDate}
        />
      );
    };
  }, [messages, currentUserId, formatDate]);
  
  // Função para renderizar item da lista com verificação de tempo
  const renderListItem = ({ item, index }: { item: Message, index: number }) => {
    const previousMessage = index > 0 ? messages[index - 1] : null;
    
    // Verificar se deve mostrar o divisor de tempo (mensagens de dias diferentes)
    const shouldShowTimeDivider = previousMessage && 
      new Date(item.timestamp).toDateString() !== new Date(previousMessage.timestamp).toDateString();
    
    return (
      <>
        {shouldShowTimeDivider && <TimeDivider date={item.timestamp} />}
        {renderMessage({ item, index })}
      </>
    );
  };

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={messages}
      renderItem={renderListItem}
      keyExtractor={item => item.id}
      style={styles.messagesList}
      contentContainerStyle={styles.messagesContent}
      inverted={false}
      ref={messagesListRef}
      onContentSizeChange={() => scrollToBottom(false)}
      onLayout={() => scrollToBottom(false)}
      removeClippedSubviews={false}
      initialNumToRender={25}
      maxToRenderPerBatch={15}
      windowSize={21}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10
      }}
    />
  );
};

const styles = StyleSheet.create({
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: spacing.medium,
    paddingBottom: spacing.large,
  },
});

export default ChatMessages; 