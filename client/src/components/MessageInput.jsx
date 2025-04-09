//-->  (Secure Input Handling) client/src/components/MessageInput.jsx
import { useState } from 'react';

export const MessageInput = ({ value, onChange, onSend }) => {
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="message-input">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder="Type a secure message..."
      />
      <button onClick={onSend}>Send</button>
    </div>
  );
};
