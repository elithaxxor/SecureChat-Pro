/* client/src/hooks/useWebRTC.js */

import { useRef, useEffect } from 'react';
import Peer from 'simple-peer';

const useWebRTC = (socket, sessionKey) => {
  const peers = useRef({});

  const createPeer = (targetId, initiator = true) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      config: {
        iceServers: [
          { 
            urls: process.env.VITE_ICE_SERVERS.split(',') 
          }
        ]
      }
    });

    peer.on('signal', (data) => {
      socket.emit('signal', {
        target: targetId,
        signal: JSON.stringify(data)
      });
    });

    peers.current[targetId] = peer;
    return peer;
  };

  useEffect(() => {
    const handleSignal = ({ from, signal }) => {
      const signalData = JSON.parse(signal);
      const peer = peers.current[from] || createPeer(from, false);
      
      if(!peer.destroyed) {
        peer.signal(signalData);
      }
    };

    socket.on('signal', handleSignal);
    return () => {
      socket.off('signal', handleSignal);
      Object.values(peers.current).forEach(peer => peer.destroy());
    };
  }, [sessionKey]);

  return { createPeer };
};

export default useWebRTC;
