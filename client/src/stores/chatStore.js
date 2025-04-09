// client/src/stores/chatStore.js
import { createContext, useContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import api from '../api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const { sessionKey } = useAuth();

  const decryptMessage = (encrypted, iv) => {
    if(!sessionKey) throw new Error('No session key');
    
    return CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(encrypted) },
      CryptoJS.enc.Utf8.parse(sessionKey),
      { iv: CryptoJS.enc.Hex.parse(iv) }
    ).toString(CryptoJS.enc.Utf8);
  };

  const loadConversations = async () => {
    const { data } = await api.get('/conversations');
    setConversations(data);
  };

  const loadMessages = async (chatId) => {
    const { data } = await api.get(`/messages?chatId=${chatId}`);
    
    const decrypted = data.map(msg => ({
      ...msg,
      content: decryptMessage(msg.encryptedContent, msg.iv)
    }));
    
    setMessages(decrypted);
  };

  const sendMessage = async (content, recipients) => {
    const iv = CryptoJS.lib.WordArray.random(128/8).toString();
    const encrypted = CryptoJS.AES.encrypt(
      content, 
      CryptoJS.enc.Utf8.parse(sessionKey), 
      { iv: CryptoJS.enc.Hex.parse(iv) }
    ).toString();

    await api.post('/messages', {
      encryptedContent: encrypted,
      iv,
      recipients
    });

    loadMessages(activeChat);
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      messages,
      activeChat,
      loadConversations,
      loadMessages,
      sendMessage,
      setActiveChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
