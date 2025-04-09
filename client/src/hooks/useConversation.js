// --> [Encrypted Message Handling] client/src/hooks/useConversation.js
import { useState, useEffect } from 'react';
import { useEncryption } from './useEncryption';
import api from '../api';

export const useConversation = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const { encryptData, decryptData, generateIV } = useEncryption();

  const loadMessages = async () => {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      
      const decryptedMessages = response.data.map(msg => ({
        ...msg,
        content: decryptData(msg.encryptedContent, msg.iv)
      }));
      
      setMessages(decryptedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (content) => {
    try {
      const iv = generateIV();
      const encrypted = encryptData(content, iv);
      
      await api.post(`/conversations/${conversationId}/messages`, {
        encryptedContent: encrypted,
        iv
      });
      
      loadMessages(); // Refresh message list
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useEffect(() => {
    if(conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  return { messages, sendMessage };
};
