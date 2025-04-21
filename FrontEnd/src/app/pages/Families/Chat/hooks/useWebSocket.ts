import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { api } from '@/src/api/api';
import { Message, WSMessage } from '../types';

interface UseWebSocketProps {
  roomId: string;
  userId: string;
  userName: string;
}

export const useWebSocket = ({ roomId, userId, userName }: UseWebSocketProps) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    try {
      // Usar o baseURL da API para construir a URL do WebSocket
      let wsUrl = api.defaults.baseURL;
      if (typeof wsUrl === 'string') {
        wsUrl = wsUrl.replace('http://', 'ws://');
        wsUrl = `${wsUrl}/ws/chat?userId=${userId}&roomId=${roomId}`;
        
        socketRef.current = new WebSocket(wsUrl);
        
        socketRef.current.onopen = () => {
          setSocketConnected(true);
          setLoading(false);
        };
        
        socketRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data) as WSMessage;
          
          if (data.type === "NEW_MESSAGE" || !data.type) {
            // Criar data a partir do timestamp recebido ou usar data atual
            let messageDate: Date;
            
            if (data.createdAt) {
              messageDate = new Date(data.createdAt);
            } else {
              messageDate = new Date();
            }
            
            const newMsg: Message = {
              id: data.id || data.messageId || Date.now().toString(),
              text: data.content,
              sender: {
                id: data.sender?.email || data.senderId || '',
                name: data.sender?.name || data.senderName || (data.sender?.email || data.senderId || '').split('@')[0] || 'Usuário',
                isAdmin: data.sender?.role === 'ADMIN'
              },
              timestamp: messageDate
            };
            
            setMessages(prev => [...prev, newMsg]);
          }
        };
        
        socketRef.current.onerror = (error) => {
          setLoading(false);
          Alert.alert(
            'Erro de Conexão',
            'Não foi possível conectar ao chat. Por favor, tente novamente mais tarde.'
          );
        };
        
        socketRef.current.onclose = () => {
          setSocketConnected(false);
        };
        
      } else {
        throw new Error('URL da API inválida');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar ao chat. Por favor, tente novamente mais tarde.'
      );
    }
  };

  const sendMessage = (content: string) => {
    // Criar o objeto de mensagem para enviar pelo WebSocket
    const messageToSend: WSMessage = {
      content,
      senderId: userId || '',
      senderName: userName || '',
      roomId: roomId
    };
    
    // Enviar a mensagem através do WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageToSend));
      return true;
    } else {
      connectWebSocket();
      return false;
    }
  };

  const fetchPreviousMessages = async () => {
    try {
      const response = await api.get(`/chat/${roomId}`);
      
      // Converter as mensagens da API para o formato usado na aplicação
      const previousMessages: Message[] = response.data.model.map((apiMessage: any) => ({
        id: apiMessage.id,
        text: apiMessage.content,
        sender: {
          id: apiMessage.sender.email, 
          name: apiMessage.sender.name,
          isAdmin: apiMessage.sender.role === 'ADMIN'
        },
        timestamp: new Date(apiMessage.createdAt)
      }));
      
      // Ordenar as mensagens por data (da mais antiga para a mais recente)
      previousMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      setMessages(previousMessages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWebSocket();
    fetchPreviousMessages();

    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [roomId, userId]);

  return {
    messages,
    sendMessage,
    socketConnected,
    loading,
    setMessages
  };
}; 