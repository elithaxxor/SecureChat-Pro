/* Input and button for sending messages. */

import React from 'react';

const ChatInput = ({ message, setMessage, sendMessage }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-input">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        onKeyPress={handleKeyPress}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatInput;
