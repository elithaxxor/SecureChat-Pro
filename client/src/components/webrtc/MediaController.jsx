import { useState, useEffect } from 'react';
import { useWebRTC } from '../../contexts/WebRTCContext';
import { Security } from '../../lib/security';

export const MediaController = () => {
  const { localStream, startCall, endCall } = useWebRTC();
  const [mediaState, setMediaState] = useState({
    video: true,
    audio: true,
    screen: false
  });

  const toggleMedia = async (type) => {
    const newState = !mediaState[type];
    setMediaState(prev => ({ ...prev, [type]: newState }));
    
    if(localStream) {
      localStream.getTracks()
        .filter(track => track.kind === type)
        .forEach(track => track.enabled = newState);
    }
  };

  const initiateSecureCall = async () => {
    try {
      const constraints = Security.getMediaConstraints();
      const encryptedStream = await Security.encryptMediaStream(
        await navigator.mediaDevices.getUserMedia(constraints)
      );
      
      startCall(encryptedStream);
    } catch (error) {
      Security.handleMediaError(error);
    }
  };

  return (
    <div className="media-controls">
      <button onClick={() => toggleMedia('video')} className="media-toggle">
        {mediaState.video ? '📹' : '📷❌'}
      </button>
      <button onClick={() => toggleMedia('audio')} className="media-toggle">
        {mediaState.audio ? '🎙️' : '🎤❌'}
      </button>
      
      <div className="call-controls">
        <button onClick={initiateSecureCall} className="secure-call">
          📞 Start Encrypted Call
        </button>
        <button onClick={endCall} className="end-call">
          🔴 End Call
        </button>
      </div>
    </div>
  );
};
