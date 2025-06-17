import React, { useContext, useEffect } from "react";
import tttImage from "../images/ttt.png";
import chessImage from "../images/chessImage.jpg";
import teenPattiImage from "../images/teenpatti.png"; 
import back from "../images/back1.jpg";
import { ChatContext } from "../Context/ChatProvider";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

const Games = () => {
  const { user } = useContext(ChatContext);
  const navigate = useNavigate();

  const gameList = [
    {
      Name: "Chess",
      sName: "chess",
      image: chessImage,
      description:
        "Play the classic strategy game of Chess against your friends or others online.",
    },
    {
      Name: "Tic-Tac-Toe",
      sName: "ttt",
      image: tttImage,
      description:
        "A quick and easy game of Tic-Tac-Toe. Can you beat your opponent in three moves?",
    },
    // {
    //   Name: "Card Game",
    //   sName: "teenpatti",
    //   image: teenPattiImage,
    //   description:
    //     "The exciting Indian card game. Get ready for a game full of fun and strategy!",
    // },
  ];

  useEffect(() => {
    const loggedIn = localStorage.getItem("userInfo");
    if (!loggedIn) navigate("/");
  }, []);

  return (
    <div className="relative min-h-screen">
      <Nav />

      <div
        className="min-h-screen bg-cover bg-center relative pt-16"
        style={{ backgroundImage: `url(${back})` }}
      >
        <div className="absolute top-10 left-0 right-0 px-6 md:px-12 text-center text-white z-10">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
            Welcome to the Multiplayer Game Platform
          </h1>
          <p className="text-lg md:text-xl font-light mb-8">
            Choose a game to play with friends or challenge others online! Dive
            into endless fun.
          </p>
        </div>

        <div className="mt-32 flex flex-wrap justify-center gap-6 md:gap-8 px-4 md:px-8 z-0">
          {gameList.map((game, i) =>
            i == 2 ? (
              <Link
                key={i}
                to={"http://localhost:3002"}
                className="w-full sm:w-[45%] lg:w-[30%] xl:w-[22%] bg-black bg-opacity-60 hover:bg-opacity-80 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    className="w-full h-[200px] object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                    src={game.image}
                    alt={game.Name}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-white text-2xl font-semibold">
                      {game.Name}
                    </h2>
                    <p className="text-white text-sm mt-2">
                      {game.description}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                key={i}
                to={`/home/${game.sName.toLowerCase()}`}
                className="w-full sm:w-[45%] lg:w-[30%] xl:w-[22%] bg-black bg-opacity-60 hover:bg-opacity-80 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    className="w-full h-[200px] object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                    src={game.image}
                    alt={game.Name}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-white text-2xl font-semibold">
                      {game.Name}
                    </h2>
                    <p className="text-white text-sm mt-2">
                      {game.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>

        {/* Footer */}
        <footer className="bg-black bg-opacity-70 py-6 mt-20 text-center text-white z-0">
          <p className="text-sm md:text-base">
            © {new Date().getFullYear()} Multiplayer Game Platform. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Games;
