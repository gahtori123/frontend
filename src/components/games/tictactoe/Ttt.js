import React, { useContext, useEffect, useState } from "react";
import showSquare from "./showSquare";
import Warn from "../../../utils/Warn";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gif from "../../../images/typing.gif";
import { ChatContext } from "../../../Context/ChatProvider";

const Ttt = ({ socket, id}) => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState("X");
  const [xisNext, setxisNext] = useState(false);
  const [chance, setChance] = useState(1);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);
  const { user } = useContext(ChatContext);

  Warn( socket);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem(id));
    if (savedState) {
      setSquares(savedState.squares);
      setCurrent(savedState.current);
      setxisNext(savedState.xisNext);
      setChance(savedState.chance);
      setWinner(savedState.winner);
      setDraw(savedState.draw);
    }
    return () => {
      socket.off("gameState");
    };
  }, [socket, id]);

  useEffect(() => {
    localStorage.setItem(
      id,
      JSON.stringify({
        squares,
        current,
        xisNext,
        chance,
        winner,
        draw,
      })
    );
  }, [squares, current, xisNext, chance, winner, draw]);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[b] &&
        squares[c] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const gameOver = (squares) => {
    return squares.every((val) => val !== null);
  };

  const restartTheGame = () => {
    setSquares(Array(9).fill(null));
    setCurrent("X");
    setxisNext(false);
    setWinner(null);
    setDraw(false);
    setChance(1);
    setRestartVisible(false);
    socket.emit("restartGame", { roomId: id });
    localStorage.removeItem(id);
  };

  const handleClick = (n) => {
    if (winner || draw || squares[n] !== null || chance !== 1) {
      alert("Wait for your opponent's move or game is over.");
      return;
    }
    const newSquares = squares.slice();
    newSquares[n] = current;
    setSquares(newSquares);
    const click = { n: n, value: current, roomId: id };
    socket.emit("squareClicked", click);
    setxisNext(!xisNext);
    setChance(-1);
  };

  const renderSquare = (n, val) => {
    return showSquare(n, handleClick, val);
  };

  useEffect(() => {
    socket.on("squareClickedRecieved", ({ n, w }) => {
      const newSquares = squares.slice();
      newSquares[n] = w;
      setSquares(newSquares);
      setCurrent(w === "X" ? "O" : "X");
      if (chance === -1) setChance(1);
    });
    return () => {
      socket.off("squareClickedRecieved");
    };
  }, [squares, socket]);

  useEffect(() => {
    socket.on("restartGameRecieved", () => {
      setSquares(Array(9).fill(null));
      setCurrent("X");
      setxisNext(false);
      setWinner(null);
      setDraw(false);
      setChance(1);
      setRestartVisible(false);
      localStorage.removeItem(id);
    });
  });

  useEffect(() => {
    const win = checkWinner(squares);
    if (win) {
      toast.success(`${win} Wins!`);
        setWinner(win);
      setRestartVisible(true);
    } else if (gameOver(squares)) {
      setDraw(true);
      toast.info("Game is a Draw!");
      setRestartVisible(true);
    }
  }, [squares, socket]);

  return (
    <div className="flex flex-col h-full w-full items-center p-4">
      <div className="absolute top-2 left-4 flex items-center bg-blue-200 p-2 pr-4 rounded-md shadow-lg space-x-2 md:space-x-4">
        <div
          className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"
          style={{
            backgroundImage: `url(${user.pic})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <h2 className="font-pacifico text-lg md:text-xl truncate ">
          {user.name}
        </h2>
      </div>
      <span className="absolute top-8 right-10 text-xl text-blue-500 md:right-40 mt-2">
        {`${chance === 1 ? "Your" : "Opponent's"} turn`}
      </span>
      <div className="mt-10">
        {/* <h1 className="text-4xl mb-4 font-pacifico">Tic Tac Toe</h1> */}
        <div className="mt-5 grid grid-cols-3 bg-sky-400 gap-2 p-4 rounded-lg shadow-lg ">
          {squares.map((val, idx) => (
            <div
              key={idx}
              className="w-20 h-20 flex justify-center items-center border-2 border-blue-300 hover:bg-sky-300 transition duration-200"
            >
              {renderSquare(idx, val)}
            </div>
          ))}
        </div>
        {winner && (
          <h2 className="mt-4 text-green-500 font-pacifico">
            Winner: {winner}
          </h2>
        )}
        {draw && !winner && (
          <h2 className="mt-4 text-yellow-500 font-pacifico">
            Game is a draw!
          </h2>
        )}
        {restartVisible && (
          <button
            onClick={restartTheGame}
            className="mt-5 px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Restart Game
          </button>
        )}
      </div>
      
      
      <div className="absolute bottom-4 right-4 flex items-center bg-red-200 p-2 rounded-md shadow-lg md:right-60">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 flex justify-center items-center mr-2">
            <span className="text-xl font-bold text-white">O</span>
          </div>
          <h2 className="font-pacifico text-lg md:text-xl">
            Opponent (Player 2)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Ttt;
