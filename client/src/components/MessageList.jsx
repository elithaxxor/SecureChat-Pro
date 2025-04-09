// -->  [Encrypted Message Display]  client/src/components/MessageList.jsx
import { useChat } from '../stores/chatStore';

export const MessageList = ({ messages }) => {
  const { decryptMessage } = useChat();

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.sender === 'self' ? 'sent' : 'received'}`}>
          <div className="message-content">
            {decryptMessage(msg.encryptedContent, msg.iv)}
          </div>
          <div className="message-meta">
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            {msg.status === 'read' && <span className="read-status">✓✓</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
