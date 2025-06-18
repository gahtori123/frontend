  import React, { createContext, useContext, useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Cookies from "js-cookie";
  import axios from "axios";
  import io from "socket.io-client"; // Make sure this is imported

  export const ChatContext = createContext();

  const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [Notification, setNotification] = useState([]);
    const [friends, setFriends] = useState([]);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    const getFriends = async () => {
      try {
        const { data } = await axios.get(
          "https://game-1-91ox.onrender.com/api/req/getfriends",
          { withCredentials: true }
        );
        
        setFriends(data);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      // Retrieve user info from local storage and handle redirection
      const data = JSON.parse(localStorage.getItem("userInfo"));
      if (!data) navigate("/");
      setUser(data);
      getFriends();

      // Initialize and manage the socket connection
      const newSocket = io("https://game-1-91ox.onrender.com"); // Update URL if needed
      setSocket(newSocket);

      // Event listeners
      newSocket.on("connect", () => {
        if (data && data._id) {
          newSocket.emit("join", { id: data._id });
        }
      });

      newSocket.on("disconnect", () => {
         ("Socket disconnected");
      });

      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }, [navigate]);

    return (
      <ChatContext.Provider
        value={{
          user,
          setUser,
          Notification,
          setNotification,
          friends,
          setFriends,
          socket,
        }}
      >
        {children}
      </ChatContext.Provider>
    );
  };

  export default ChatProvider;
