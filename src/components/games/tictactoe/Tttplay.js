import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Ttt from "./Ttt";
import io from "socket.io-client";
import Loading from "../../../utils/Loading";
import Chat from "../../../utils/Chat";
import bhome from "../../../images/bhome.webp";
import VoiceChat from "../../../utils/VoiceChat";
import GameOverPage from "../../../utils/GameOverPage";

const Tttplay = () => {
  const ENDPOINT = "http://localhost:5000/ttt";
  const { id } = useParams();

  const [user, setUser] = useState(null); // Initialize user state
  const [youCanPlayNow, setYouCanPlayNow] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [socket, setSocket] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo); // Set user information to state
  }, []);

  useEffect(() => {
    if (user) {
      const socketInstance = io(ENDPOINT);
      setSocket(socketInstance);
      setSocketInitialized(true);
      socketInstance.emit("join", { id, userId: user._id });

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
      className="flex"
      style={{
        backgroundImage: `url(${bhome})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ttt socket={socket} id={id}  />

      <Chat
        socket={socket}
        id={id}
      />
    </div>
  ) : (
    <Loading />
  );
};

export default Tttplay;
