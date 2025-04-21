import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

type ScrollFunction = (animated?: boolean) => void;

export const useKeyboardEvents = (scrollToBottom: ScrollFunction) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        () => {
          setKeyboardVisible(true);
          scrollToBottom();
        }
      );
      
      const keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          setKeyboardVisible(false);
          scrollToBottom(false);
        }
      );
      
      // Adicionar listener para quando o teclado terminar de ser exibido
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          scrollToBottom();
        }
      );
      
      return () => {
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
        keyboardDidShowListener.remove();
      };
    } else {
      // Para Android
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setKeyboardVisible(true);
          scrollToBottom();
        }
      );
      
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardVisible(false);
          scrollToBottom(false);
        }
      );
      
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, [scrollToBottom]);

  return { keyboardVisible };
}; 