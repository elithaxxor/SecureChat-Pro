
```markdown
# Enhanced File Transfer Server

## Overview

This repository contains the source code for the Enhanced File Transfer Server, built with Node.js and Express. The server handles file operations, real-time updates via WebSocket, and various file-related commands.

## Features
- File upload and versioning
- Real-time file updates with WebSocket
- Metadata retrieval for files and directories
- Directory size calculation
- Command handling for file operations

## Technologies Used
- Node.js
- Express.js
- WebSocket
- Chokidar
- Archiver
- Winston
- NodeCache

## Installation & Setup

### Prerequisites
Ensure the following tools are installed on your system:
- Node.js & npm
- Git (optional, recommended)

### Clone the Repository
```bash
git clone https://github.com/elithaxxor/chat.git
cd chat/enhanced-file_transfer/server
```

### Install Dependencies
```bash
npm install
```

### Create Necessary Directories
The server will automatically create necessary directories (`FILES_DIR`, `.versions`, `.cache`) if they do not exist.

### Start the Server
```bash
node server.js
```
The server will run on `http://localhost:12345`.

## Usage Instructions

### File Upload
Upload files to the server via the `/upload` endpoint. Ensure the target path is specified in the query parameters.

### File Download
Download files or directories using the `GET` command via the `/command` endpoint.

### Real-time Updates
The server broadcasts file updates to connected WebSocket clients. Clients can listen for updates to stay synchronized with the server.

### Commands
The server handles various commands sent to the `/command` endpoint:
- `LIST`: Lists all files with metadata.
- `LIST <path>`: Lists files in a specific directory.
- `GETALL`: Downloads all files as a compressed archive.
- `GET <path>`: Downloads a specific file or directory.
- `SEARCH <term>`: Searches for files by name.
- `METADATA`: Gets metadata for all files.
- `METADATA <path>`: Gets metadata for a specific file.
- `HEALTH`: Checks server health.
- `QUIT`: Disconnects from the server.

## Deployment Instructions
To deploy the application on a server, follow these steps:

### Install Node.js and npm
```bash
# Debian
sudo apt update && sudo apt install nodejs npm -y

# macOS (Homebrew)
brew install node
```

### Install and Start MongoDB
```bash
# Debian
sudo apt install mongodb -y
sudo systemctl start mongodb
sudo systemctl enable mongodb

# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Run the Application with PM2
```bash
npm install pm2 -g

# Backend
cd server
pm2 start server.js --name file-transfer-backend
```
Your application will now be accessible on your server’s IP address on port 12345.

## Contributing
Contributions, issues, and feature requests are welcome!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments
- Node.js
- Express.js
- WebSocket
- Chokidar
- Archiver
- Winston
- NodeCache

If you found this project helpful, please give it a star ⭐ and share it with others!
```

You can use this formatted content for your `README.md` file in the GitHub repository. If you have any more details or modifications, feel free to ask!
