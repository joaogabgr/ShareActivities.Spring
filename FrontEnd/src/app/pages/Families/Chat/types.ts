// Interface para as mensagens
export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    isAdmin: boolean;
  };
  timestamp: Date;
}

// Interface para as mensagens websocket
export interface WSMessage {
  id?: string;
  content: string;
  senderId?: string;
  senderName?: string;
  roomId: string | { id: string, name: string };
  timestamp?: string;
  messageId?: string;
  createdAt?: string;
  type?: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Interfaces para props dos componentes
export interface ChatHeaderProps {
  title: string;
  groupName: string;
  onBack: () => void;
}

export interface TimeDividerProps {
  date: Date;
}

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  isPreviousSameSender: boolean;
  isNextSameSender: boolean;
  isCloseTimeToPrevious: boolean;
  shouldShowSender: boolean;
  shouldShowTimestamp: boolean;
  formatDate: (date: Date) => string;
}

export interface MessageInputProps {
  newMessage: string;
  setNewMessage: (text: string) => void;
  handleSendMessage: () => void;
  sendingMessage: boolean;
  isConnected: boolean;
} 