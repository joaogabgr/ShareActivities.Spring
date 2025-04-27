import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert
} from 'react-native';
import { colors, spacing } from '@/src/globalCSS';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthContext } from '@/src/contexts/AuthContext';
import Header from '@/src/app/components/header/Header';

// Componentes
import ChatHeader from './components/ChatHeader';
import LoadingIndicator from './components/LoadingIndicator';
import MessageInput from './components/MessageInput';
import ChatMessages from './components/ChatMessages';

// Hooks e utils
import { useWebSocket } from './hooks/useWebSocket';
import { useKeyboardEvents } from './hooks/useKeyboardEvents';
import { formatMessageDate } from './utils/dateUtils';
import { Message } from './types';

export default function Chat() {
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const { id, name } = useLocalSearchParams();
  const roomId = id as string;
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const messagesListRef = useRef<FlatList<Message> | null>(null);
  
  // Se não tem usuário autenticado, redireciona para o login
  useEffect(() => {
    if (!authContext.user?.name) {
      router.replace('/pages/auth/Login');
    }
  }, [authContext.user, router]);

  // Função para rolar para o final da lista
  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      if (messagesListRef.current && messages.length > 0) {
        messagesListRef.current.scrollToEnd({ animated });
        
        // Solução adicional para garantir que o scroll chegue ao final
        setTimeout(() => {
          messagesListRef.current?.scrollToEnd({ animated: false });
        }, 200);
      }
    }, 150);
  };

  // Usar o hook de eventos do teclado
  const { keyboardVisible } = useKeyboardEvents(scrollToBottom);

  // Usar o hook do WebSocket
  const { messages, sendMessage, socketConnected, loading } = useWebSocket({
    roomId,
    userId: authContext.user?.name || '',
    userName: authContext.user?.user || ''
  });

  // Effect para rolar para o fim da lista quando mensagens mudam
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socketConnected) return;
    
    try {
      // Ativar indicador de envio
      setSendingMessage(true);
      
      // Armazenar a mensagem que está sendo enviada para referência
      const messageContent = newMessage.trim();
      
      // Limpar o campo de entrada antes de enviar a mensagem
      setNewMessage('');
      
      // No iOS, fechar o teclado após enviar para evitar problemas de layout
      if (Platform.OS === 'ios') {
        Keyboard.dismiss();
      }
      
      // Enviar a mensagem
      const sent = sendMessage(messageContent);
      
      // Se não foi possível enviar a mensagem imediatamente
      if (!sent) {
        setTimeout(() => {
          const retry = sendMessage(messageContent);
          if (!retry) {
            setSendingMessage(false);
            Alert.alert('Erro', 'Não foi possível enviar a mensagem. Por favor, tente novamente.');
          } else {
            setSendingMessage(false);
          }
        }, 1000);
      } else {
        setSendingMessage(false);
      }
      
    } catch (error) {
      setSendingMessage(false);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem. Por favor, tente novamente.');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.safeArea}>
        <Header />
        <View style={styles.contentContainer}>
          <ChatHeader title="Chat do Grupo" groupName={name as string} onBack={handleBack} />
          <LoadingIndicator />
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.safeArea}>
      <Header />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 0}
      >
        <View style={styles.contentContainer}>
          <ChatHeader title="Chat do Grupo" groupName={name as string} onBack={handleBack} />
          
          <ChatMessages 
            messages={messages}
            currentUserId={authContext.user?.name || ''}
            formatDate={formatMessageDate}
            messagesListRef={messagesListRef}
            scrollToBottom={scrollToBottom}
          />
          
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
            isConnected={socketConnected}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.medium,
    paddingBottom: spacing.medium,
  },
}); 