/* Manages video call functionality. */ 

import React, { useRef, useEffect } from 'react';

const VideoCall = ({ myStream, userStream }) => {
  const myVideo = useRef();
  const userVideo = useRef();

  useEffect(() => {
    if (myStream && myVideo.current) myVideo.current.srcObject = myStream;
    if (userStream && userVideo.current) userVideo.current.srcObject = userStream;
  }, [myStream, userStream]);

  return (
    <div className="video-container">
      <video ref={myVideo} autoPlay muted style={{ width: '200px' }} />
      <video ref={userVideo} autoPlay style={{ width: '200px' }} />
    </div>
  );
};

export default VideoCall;
