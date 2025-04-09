// client/src/stores/webrtcStore.js
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { useSocket } from './socketStore';

const WebRTCContext = createContext();

export const WebRTCProvider = ({ children }) => {
  const [callState, setCallState] = useState('idle');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerRef = useRef(null);
  const { socket } = useSocket();

  const startCall = async (isInitiator, targetId) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    
    setLocalStream(stream);
    setCallState(isInitiator ? 'calling' : 'receiving');

    const peer = new Peer({
      initiator: isInitiator,
      stream,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    peer.on('signal', data => {
      socket.emit('webrtc-signal', { 
        target: targetId, 
        signal: JSON.stringify(data) 
      });
    });

    peer.on('stream', remote => {
      setRemoteStream(remote);
      setCallState('active');
    });

    peerRef.current = peer;
  };

  const handleSignal = (signal) => {
    if(peerRef.current) {
      peerRef.current.signal(JSON.parse(signal));
    }
  };

  useEffect(() => {
    if(socket) {
      socket.on('webrtc-signal', ({ signal }) => {
        if(!peerRef.current) {
          startCall(false, null);
        }
        handleSignal(signal);
      });
    }
  }, [socket]);

  const endCall = () => {
    if(peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
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

export const useWebRTC = () => {
  return useContext(WebRTCContext);
};
