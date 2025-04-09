// [Encrypted Message Handling] || client/src/contexts/ChatContext.js

import { createContext, useContext, useState, useEffect } from 'react';
import { Security } from '../lib/security';
import { useAuth } from './AuthContext';
import api from '../api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { sessionKey } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const decryptMessage = (encryptedMessage) => {
    if(!sessionKey) throw new Error('Missing session key');
    return Security.decryptData(
      encryptedMessage.ciphertext,
      sessionKey,
      encryptedMessage.iv
    );
  };

  const encryptMessage = (content) => {
    if(!sessionKey) throw new Error('Missing session key');
    return Security.encryptData(content, sessionKey);
  };

  const loadConversations = async () => {
    const { data } = await api.get('/conversations');
    setConversations(data.map(conv => ({
      ...conv,
      name: Security.decryptData(conv.encryptedName, sessionKey)
    })));
  };

  const sendMessage = async (content, recipients) => {
    const encrypted = encryptMessage(content);
    await api.post('/messages', {
      encryptedContent: encrypted.ciphertext,
      iv: encrypted.iv,
      recipients
    });
    loadMessages(activeChat);
  };

  const loadMessages = async (chatId) => {
    const { data } = await api.get(`/messages/${chatId}`);
    setMessages(data.map(msg => ({
      ...msg,
      content: decryptMessage(msg)
    })));
  };

  useEffect(() => {
    if(activeChat) {
      loadMessages(activeChat);
    }
  }, [activeChat]);

  return (
    <ChatContext.Provider value={{
      conversations,
      messages,
      activeChat,
      loadConversations,
      sendMessage,
      setActiveChat,
      decryptMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
