// [Secure Video Calling] client/src/contexts/WebRTCContext.js

import { createContext, useContext, useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import { useSocket } from './SocketContext';
import { WebRTCConfig } from '../lib/webrtc';

const WebRTCContext = createContext();

export const WebRTCProvider = ({ children }) => {
  const { socket } = useSocket();
  const [callState, setCallState] = useState('idle');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerRef = useRef();

  const startCall = async (targetUserId, isInitiator = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      setCallState(isInitiator ? 'calling' : 'receiving');

      const peer = WebRTCConfig.createSecurePeer({
        initiator: isInitiator,
        stream: stream
      });

      peer.on('signal', data => {
        socket.emit('webrtc-signal', {
          target: targetUserId,
          signal: WebRTCConfig.encryptSignal(data)
        });
      });

      peer.on('stream', remoteStream => {
        setRemoteStream(remoteStream);
        setCallState('active');
      });

      peerRef.current = peer;
    } catch (error) {
      setCallState('error');
    }
  };

  const handleSignal = (encryptedSignal) => {
    const signal = WebRTCConfig.decryptSignal(encryptedSignal);
    peerRef.current?.signal(signal);
  };

  useEffect(() => {
    if(socket) {
      socket.on('webrtc-signal', ({ signal }) => handleSignal(signal));
    }
  }, [socket]);

  const endCall = () => {
    peerRef.current?.destroy();
    setCallState('idle');
    setLocalStream(null);
    setRemoteStream(null);
  };

  return (
    <WebRTCContext.Provider value={{
      callState,
      localStream,
      remoteStream,
      startCall,
      endCall
    }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => useContext(WebRTCContext);
