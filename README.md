📱💬 React Chat & Video Call Application
A robust, elegant, and fully-featured real-time chat and video calling application built using React.js, Node.js, Express, Socket.io, MongoDB, and WebRTC. This application provides seamless communication via text and video, with persistent chat history, user management, and responsive design optimized for both desktop and mobile devices.

🛠️ Technologies Used
Frontend
React.js (Frontend Library)
Socket.io-client (Real-time communication)
Simple-peer (WebRTC Signaling)
HTML5 & CSS3 (Responsive UI)
LocalStorage (Message cache persistence)
Backend
Node.js (Runtime Environment)
Express.js (Backend Framework)
Socket.io (Real-time Communication)
MongoDB & Mongoose (Database Management)
Infrastructure & Compatibility
Compatible Server OS: macOS (Macintosh) or Debian Linux
Responsive Web Application (Mobile and Desktop)

🚀 Features
Real-time chat messaging powered by WebSockets.
Peer-to-peer video calling using WebRTC.
Persistent chat logs saved in MongoDB and browser's local storage.
Responsive and elegant UI for seamless experience across devices.
User-friendly interface with clear, intuitive interactions.
Easy deployment on macOS or Debian Linux servers.
📂 Project Structure
reasonml

Copy
chat-app/
│
├── client/ (React Frontend)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.js
│   │   │   ├── ChatInput.js
│   │   │   ├── ChatMessages.js
│   │   │   ├── Login.js
│   │   │   └── VideoCall.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
│
└── server/ (Node Backend)
    ├── models/
    │   ├── User.js
    │   └── Message.js
    ├── index.js (Server Entry Point)
    ├── package.json
    └── package-lock.json
⚙️ Installation & Setup
Prerequisites
Ensure the following tools are installed on your system:

Node.js & npm
MongoDB
Git (optional, recommended)
Clone the Repository
bash

Copy
git clone https://github.com/your-username/react-chat-video-app.git
cd react-chat-video-app
Backend Setup
Navigate to the server directory and install dependencies:

bash

Copy
cd server
npm install
Create a .env file inside server/, add:


Copy
MONGODB_URI=mongodb://localhost:27017/chatapp
PORT=5000
Start the backend server:

bash

Copy
node index.js
Your backend will now run on http://localhost:5000.

Frontend Setup
Navigate to the client directory and install dependencies:

bash

Copy
cd ../client
npm install
Start the React frontend:

bash

Copy
npm start
Your frontend will now run on http://localhost:3000.

📡 Usage Instructions
Chatting: Open the app in two or more browser tabs or devices to test sending and receiving messages in real-time.
Video Calling: Ensure camera/microphone permissions are allowed. Initiate video calls by exchanging IDs (Socket IDs) shown in the interface. Calls are direct, secure, and peer-to-peer.
Persistent Chat Logs: Your chat history is automatically stored persistently in your browser's local storage and server-side in MongoDB, ensuring messages aren't lost upon refresh.
🌐 Deployment Instructions (macOS / Debian)
Follow these steps for deploying on macOS or Debian servers:

Install Node.js and npm:
bash

Copy
# Debian
sudo apt update && sudo apt install nodejs npm -y

# macOS (Homebrew)
brew install node
Install and start MongoDB:
bash

Copy
# Debian
sudo apt install mongodb -y
sudo systemctl start mongodb
sudo systemctl enable mongodb

# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
Clone and set up your application (as above), then run it with a process manager like PM2:
bash

Copy
npm install pm2 -g

# Backend
cd server
pm2 start index.js --name chat-backend

# Frontend (Production build)
cd ../client
npm run build
npm install -g serve
pm2 serve -s build 3000 --name chat-frontend
Your application will now be accessible on your server’s IP address on port 3000.

🎯 Future Enhancements & Roadmap
Implement secure user authentication (JWT).
Add rich features such as group chats and file sharing.
Enhanced UI/UX using frameworks such as Tailwind CSS.
Advanced video call features like screen sharing and multi-user conferencing.
Robust error handling, logging, and security measures for production readiness.
📝 Contributing
Contributions, issues, and feature requests are welcome!

Fork the repository.
Create your feature branch (git checkout -b feature/AmazingFeature).
Commit your changes (git commit -m 'Add some AmazingFeature').
Push to the branch (git push origin feature/AmazingFeature).
Open a Pull Request.
🪪 License
Distributed under the MIT License. See LICENSE for more information.

🙌 Acknowledgments
React.js Docs: https://reactjs.org
Socket.io Docs: https://socket.io
SimplePeer: https://github.com/feross/simple-peer
MongoDB Docs: https://docs.mongodb.com
⭐ If you found this project helpful, please give it a star ⭐ and share it with others!

Feel free to contact me or open issues if you have questions or suggestions. Enjoy your new chat and video calling experience!

2:47 AM
