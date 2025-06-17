import React, { useEffect, useRef, useState } from "react";
import "./VoiceChat.css";

const VoiceChat = ({ roomId, socket }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [peerConnection, setPeerConnection] = useState(null);
  const [iceCandidateQueue, setIceCandidateQueue] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  const setupWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      const connection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // Add local audio track to connection
      stream.getTracks().forEach((track) => connection.addTrack(track, stream));

      // Set up remote stream handling
      connection.ontrack = (event) => {
        try {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        } catch (error) {
          console.error("Error handling remote track:", error);
        }
      };

      // Handle ICE candidates
      connection.onicecandidate = (event) => {
        try {
          if (event.candidate) {
            socket.emit("iceCandidate", {
              target: roomId,
              candidate: event.candidate,
            });
          }
        } catch (error) {
          console.error("Error handling ICE candidate:", error);
        }
      };

      // Set up connection state listener
      connection.onconnectionstatechange = () => {
      };

      setPeerConnection(connection);
      return connection;
    } catch (error) {
      console.error("Error setting up WebRTC:", error);
    }
  };

  const initializeConnection = async () => {
    try {
      const connection = await setupWebRTC();
      if (!connection) return;

      // Create and send offer
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      socket.emit("offer", { target: roomId, sender: socket.id, offer });

      // Listen for socket events
      socket.on("offer", async (data) => {
        try {
          if (connection) {
            await connection.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );
            const answer = await connection.createAnswer();
            await connection.setLocalDescription(answer);
            socket.emit("answer", { target: data.sender, answer });

            // Process queued candidates
            iceCandidateQueue.forEach(async (candidate) => {
              try {
                await connection.addIceCandidate(
                  new RTCIceCandidate(candidate)
                );
              } catch (error) {
                console.error("Error adding queued ICE candidate:", error);
              }
            });
            setIceCandidateQueue([]);
          }
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      });

      socket.on("answer", async (data) => {
        try {
          if (connection) {
            await connection.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          }
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      });

      socket.on("iceCandidate", async (data) => {
        try {
          if (connection) {
            if (connection.remoteDescription) {
              await connection.addIceCandidate(
                new RTCIceCandidate(data.candidate)
              );
            } else {
              console.warn(
                "Remote description is not set. Queuing ICE candidate."
              );
              setIceCandidateQueue((prev) => [...prev, data.candidate]);
            }
          }
        } catch (error) {
          console.error("Error handling received ICE candidate:", error);
        }
      });

      // Start muted
      removeAudioTrack();
    } catch (error) {
      console.error("Error initializing connection:", error);
    }
  };

  const removeAudioTrack = () => {
    try {
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = false;
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Error removing audio track:", error);
    }
  };

  const reAddAudioTrack = () => {
    try {
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = true;
        setIsMuted(false);
      }
    } catch (error) {
      console.error("Error re-adding audio track:", error);
    }
  };

  useEffect(() => {
    try {
      initializeConnection();
    } catch (error) {
      console.error("Error in useEffect (initializeConnection):", error);
    }

    return () => {
      try {
        if (localStream)
          localStream.getTracks().forEach((track) => track.stop());
        if (peerConnection) {
          peerConnection.close();
          setPeerConnection(null);
        }
        socket.off("offer");
        socket.off("answer");
        socket.off("iceCandidate");
      } catch (error) {
        console.error("Error cleaning up in useEffect:", error);
      }
    };
  }, [roomId, socket]);

  useEffect(() => {
    try {
      if (audioRef.current && remoteStream) {
        audioRef.current.srcObject = remoteStream;
        audioRef.current
          .play()
          .catch((error) => console.error("Error playing audio:", error));
      }
    } catch (error) {
      console.error("Error in useEffect (audioRef/remoteStream):", error);
    }
  }, [remoteStream]);

  return (
    <div className="voice-chat-container">
      {peerConnection ? (
        <>
          {isMuted ? (
            <button onClick={reAddAudioTrack}>
              <i className="ri-mic-off-fill text-xl"></i>
            </button>
          ) : (
            <button onClick={removeAudioTrack}>
              <i className="ri-mic-2-line text-xl"></i>
            </button>
          )}
        </>
      ) : (
        <div>Connecting...</div>
      )}
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

export default VoiceChat;
