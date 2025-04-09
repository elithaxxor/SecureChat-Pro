// --> WebRTC Component || client/src/components/VideoCall.jsx
import { useEffect, useRef } from 'react';
import { useWebRTC } from '../stores/webrtcStore';

export const VideoCall = ({ callId }) => {
  const { localStream, remoteStream, startCall, endCall } = useWebRTC();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="video-call">
      <div className="video-feeds">
        <video ref={localVideoRef} autoPlay muted className="local-feed" />
        <video ref={remoteVideoRef} autoPlay className="remote-feed" />
      </div>
      <div className="call-controls">
        <button onClick={() => startCall(true, callId)}>Start Call</button>
        <button onClick={endCall}>End Call</button>
      </div>
    </div>
  );
};
