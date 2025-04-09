/* This is the main chat container component combining input and messages. */

import React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const Chat = ({ messages, message, setMessage, sendMessage, socketId }) => {
  return (
    <div className="chat-container">
      <ChatMessages messages={messages} socketId={socketId} />
      <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
