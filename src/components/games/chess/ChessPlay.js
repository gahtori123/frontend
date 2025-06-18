import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Loading from "../../../utils/Loading";
import Chat from "../../../utils/Chat";
import VoiceChat from "../../../utils/VoiceChat";
import ChessComponent from "./ChessComponent";
import playchess from "../../../images/playchess.jpg";
import "./ChessPlay.css"; // Add CSS for layout
import GameOverPage from "../../../utils/GameOverPage";

const Chessplay = () => {
  const ENDPOINT = "https://game-diei.onrender.com/chess";
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [youCanPlayNow, setYouCanPlayNow] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [socket, setSocket] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState(null);
  const [istyping, setisTyping] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);

  useEffect(() => {
    if (user) {
      const socketInstance = io(ENDPOINT);
      setSocket(socketInstance);
      setSocketInitialized(true);
      socketInstance.emit("join", { id, userId: user._id});

      return () => {  
        socketInstance.disconnect();
      };
    }
  }, [ENDPOINT, id, user]);

  useEffect(() => {
    if (socket) {
      const handleCanPlay = () => {
        setYouCanPlayNow(true);
      };

      const handlePlayerLeft = ({ message }) => {
        alert(message);
        setGameOver(true);
      };

      socket.on("canPlay", handleCanPlay);
      socket.on("playerLeft", handlePlayerLeft);

      return () => {
        socket.off("canPlay", handleCanPlay);
        socket.off("playerLeft", handlePlayerLeft);
      };
    }
  }, [socket]);

  return gameOver ? (
   <GameOverPage/>
  ) : socketInitialized && youCanPlayNow ? (
    <div
      className="tttplay-container flex h-full "
      style={{
        backgroundImage: `url(${playchess})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-[70%]">
        <ChessComponent
          socket={socket}
          id={id}
        />
      </div>
      <div className="chat-container flex items-center">
        <Chat
          socket={socket}
          id={id}
          chessg={true}
        />
        {/* <VoiceChat socket={socket} roomId={id} /> */}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Chessplay;
