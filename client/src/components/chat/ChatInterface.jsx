import { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useEncryption } from '../../hooks/useEncryption';


export const ChatInterface = ({ chatId }) => {
  const { messages, sendMessage } = useChat();
  const { decrypt } = useEncryption();
  const inputRef = useRef();

  const handleSend = async () => {
    const plaintext = Security.sanitizeMessage(inputRef.current.value);
    const encrypted = await Security.encryptMessage(plaintext);
    
    await sendMessage(encrypted, chatId);
    inputRef.current.value = '';
  };

  return (
    <div className="secure-chat-container">
      <div className="message-list">
        {messages.map(msg => (
          <div key={msg.id} className="encrypted-message">
            <div className="message-meta">
              <span className="sender">{Security.obfuscateId(msg.sender)}</span>
              <span className="security-badge">🔒</span>
            </div>
            <div className="message-content">
              {decrypt(msg.content)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="secure-composer">
        <textarea
          ref={inputRef}
          className="encrypted-input"
          placeholder="Type a secure message..."
          onKeyDown={e => e.ctrlKey && e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="encrypted-send">
          🔏 Send Encrypted
        </button>
      </div>
    </div>
  );
};
