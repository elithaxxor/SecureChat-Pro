/* Displays the list of chat messages. */ 


import React from 'react';

const ChatMessages = ({ messages, socketId }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.sender === socketId ? 'You' : msg.sender}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
