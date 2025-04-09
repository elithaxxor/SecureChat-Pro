/* client/src/hooks/useWebRTC.js
  Media Negotiation Hook
*/

import { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { useSocket } from '../stores/socketStore';

export const useWebRTC = (callId) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [callState, setCallState] = useState('idle');
  const { socket } = useSocket();
  const localStreamRef = useRef();

  const initializeMedia = async () => {
    return navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: { noiseSuppression: true, echoCancellation: true }
    });
  };

  const createPeer = (initiator = false) => {
    return new Peer({
      initiator,
      trickle: false,
      stream: localStreamRef.current,
      config: { iceServers: getIceServers() }
    });
  };

  const startCall = async (targetUserId) => {
    try {
      const stream = await initializeMedia();
      localStreamRef.current = stream;
      
      const peer = createPeer(true);
      setPeerConnection(peer);
      setCallState('connecting');

      peer.on('signal', data => {
        socket.emit('rtc-signal', {
          target: targetUserId,
          callId,
          signal: JSON.stringify(data)
        });
      });

      peer.on('connect', () => setCallState('active'));
      peer.on('error', () => setCallState('failed'));
      
    } catch (error) {
      setCallState('error');
    }
  };

  const handleSignal = (signalData) => {
    if(peerConnection) {
      peerConnection.signal(JSON.parse(signalData));
    } else {
      const peer = createPeer(false);
      setPeerConnection(peer);
      
      peer.signal(signalData);
      peer.on('stream', handleRemoteStream);
    }
  };

  useEffect(() => {
    if(socket) {
      socket.on('rtc-signal', ({ signal }) => handleSignal(signal));
    }

    return () => {
      peerConnection?.destroy();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [socket]);

  return { startCall, endCall, callState, localStream: localStreamRef.current };
};
