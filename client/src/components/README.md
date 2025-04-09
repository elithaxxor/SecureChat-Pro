
```markdown
# Chat Application Components

This directory contains the primary React components for the chat functionality in the chat application.

## Components Overview

### Chat Component

`Chat.js` is the main chat container component that combines the chat input and chat messages.

```javascript
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
```

- **Props**:
  - `messages`: Array of message objects to display.
  - `message`: Current message input value.
  - `setMessage`: Function to update the message input value.
  - `sendMessage`: Function to send the current message.
  - `socketId`: ID of the current WebSocket connection.

### ChatInput Component

`ChatInput.js` provides an input field and a button for sending messages.

```javascript
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
```

- **Props**:
  - `message`: Current message input value.
  - `setMessage`: Function to update the message input value.
  - `sendMessage`: Function to send the current message.

### ChatMessages Component

`ChatMessages.js` displays the list of chat messages.

```javascript
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
```

- **Props**:
  - `messages`: Array of message objects to display.
  - `socketId`: ID of the current WebSocket connection.

## Usage

These components can be used together to create a complete chat interface. The `Chat` component integrates both `ChatMessages` and `ChatInput` to provide a seamless chat experience.

### Example Usage

```javascript
import React, { useState } from 'react';
import Chat from './components/Chat';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketId = 'your-socket-id'; // Replace with actual socket ID

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { sender: socketId, message };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <Chat
      messages={messages}
      message={message}
      setMessage={setMessage}
      sendMessage={sendMessage}
      socketId={socketId}
    />
  );
};

export default App;
```

This example demonstrates how to integrate the chat components into an application. Replace `'your-socket-id'` with the actual ID from your WebSocket connection.

## Styling

To ensure a good user experience, customize the styles for these components in your CSS file.

```css
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- React.js
- Socket.io
- Simple Peer
```

You can use this content to create a `README.md` file for the `client/src/components` directory in your GitHub repository.
