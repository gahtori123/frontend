import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import indi from "../images/200.webp";
import VoiceChat from "./VoiceChat";

const Chat = ({ socket, id, setMessage, chessg }) => {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]); // store chat messages
  const { user } = useContext(ChatContext);
  const [typing, setTyping] = useState(false);
  const [istyping, setisTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    setTyping(false);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: value, sender: user._id },
    ]); // add message to messages array
    socket.emit("sendMessage", { value, id, sender: user._id }); // include sender id
    setValue("");
  };

  const typingHandler = () => {
    if (!typing) {

      setTyping(true);
      socket.emit("typing", { id });
    }

    var lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var currentTime = new Date().getTime();
      let timediff = currentTime - lastTypingTime;
      if (timediff > timerLength && typing) {
        socket.emit("stopTyping", id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket.on("sendMessageReceived", ({ value, sender }) => {
      setisTyping(false);

      setMessages((prevMessages) => [...prevMessages, { text: value, sender }]); // add message to messages array
      return () => {
        socket.off("sendMessageReceived");
      };
    });
  }, [socket]);

  useEffect(() => {
    socket.on("typingReceived", () => {
      setisTyping(true);
    });

    socket.on("stopTypingReceived", () => {
      setisTyping(false);
    });

    return () => {
      socket.off("sendMessageReceived");
      socket.off("typingReceived");
      socket.off("stopTypingReceived");
    };
  }, [socket]);

  return (
    <div className="bg-gray-100 p-4 w-[90%] rounded-lg">
      <div className="chat-box mb-4 p-2 border overflow-y-auto h-64 break-words whitespace-normal  bg-white rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-lg ${
              msg.sender === user._id
                ? "bg-green-500 text-white text-right self-end" // styling for user's message
                : "bg-sky-300 text-black text-left self-start" // styling for opponent's message
            }`}
          >
            {msg.text}
          </div>
        ))}
        {istyping && (
          <div className="typing-animation w-12 h-12   ">
            <img className="rounded-md" src={indi}></img>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            typingHandler();
          }}
          placeholder="Type a message..."
          className="w-[85%] p-2 border rounded-lg"
        />
        <div className="flex items-center  ">
          <button
            className="bg-blue-600 text-white ml-2 px-1 rounded-lg  "
            type="submit"
          >
            <i className="ri-send-plane-fill"></i>
          </button>
          {!chessg && (
            <button className="bg-black text-white ml-2 px-1 rounded-lg">
              <VoiceChat socket={socket} roomId={id} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Chat;
