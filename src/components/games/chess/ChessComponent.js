import React, { useContext, useEffect, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { ChatContext } from "../../../Context/ChatProvider";
import Warn from "../../../utils/Warn";

const ChessComponent = ({ socket, id }) => {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [playerColor, setPlayerColor] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [timer1, setTimer1] = useState(600); // Timer for Player 1
  const [timer2, setTimer2] = useState(600); // Timer for Player 2
  const [currentTimer, setCurrentTimer] = useState(null); // Tracks whose timer is running
  const { user } = useContext(ChatContext);

  Warn(socket);

  // Handle socket events
  useEffect(() => {
    socket.emit("join", { id, userId: user._id });

    socket.on("gameStart", (color) => {
      setPlayerColor(color);
      setCurrentTimer(color === "w" ? "player1" : "player2"); // Start the timer for the first player
    });

    socket.on("move", (move) => {
      if (isGameOver) return;

      try {
        const validMove = chess.move(move);
        if (validMove) {
          setFen(chess.fen());
          checkGameStatus(); // Check if the game is over
          if (!isGameOver) switchTimers(); // Only switch timers if the game isn't over
        } else {
          socket.emit("requestSync", { roomId: id }); // Request sync if moves are invalid
        }
      } catch (error) {
        console.error("Error processing move:", error);
        socket.emit("requestSync", { roomId: id });
      }
    });

    socket.on("syncBoard", (newFen) => {
      chess.load(newFen);
      setFen(newFen);
    });

    socket.on("playerLeft", ({ message }) => {
      setGameResult(message);
      setIsGameOver(true);
      stopTimers();
    });

    return () => {
      socket.off("gameStart");
      socket.off("move");
      socket.off("syncBoard");
      socket.off("playerLeft");
    };
  }, [socket, chess, isGameOver]);

  // Timer Logic
  useEffect(() => {
    const timerRef = { current: null };

    const decrementTimer = () => {
      if (currentTimer === "player1") {
        setTimer1((prev) => Math.max(prev - 1, 0));
      } else if (currentTimer === "player2") {
        setTimer2((prev) => Math.max(prev - 1, 0));
      }
    };

    if (!isGameOver && currentTimer) {
      timerRef.current = setInterval(decrementTimer, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentTimer, isGameOver]);

  useEffect(() => {
    if (timer1 === 0 || timer2 === 0) {
      setIsGameOver(true);
      stopTimers();
      setGameResult(
        timer1 === 0 ? "Time out! Black wins!" : "Time out! White wins!"
      );
    }
  }, [timer1, timer2]);

  const handleMove = (move) => {
    if (isGameOver) return;

    // Ensure that it's the player's turn
    const isPlayerTurn =
      (playerColor === "w" && chess.turn() === "w") ||
      (playerColor === "b" && chess.turn() === "b");

    if (!isPlayerTurn) {
      return;
    }

    const moveObj = {
      from: move.sourceSquare,
      to: move.targetSquare,
    };

    const piece = chess.get(move.sourceSquare);
    if (
      piece &&
      piece.type === "p" &&
      (move.targetSquare[1] === "8" || move.targetSquare[1] === "1")
    ) {
      moveObj.promotion = "q"; // Handle pawn promotion
    }

    try {
      const validMove = chess.move(moveObj);
      if (validMove) {
        setFen(chess.fen());
        socket.emit("move", { ...moveObj, roomId: id });
        checkGameStatus(); // Check for game over
        if (!isGameOver) switchTimers(); // Switch timers if the game continues
      } else {
      }
    } catch (error) {
      console.error("Error making move:", error);
    }
  };

  const checkGameStatus = () => {
    if (chess.isCheckmate()) {
      setGameResult(
        `Checkmate! ${playerColor === "w" ? "Black" : "White"} wins!`
      );
      setIsGameOver(true);
      stopTimers();
    } else if (chess.isDraw()) {
      setGameResult("Draw!");
      setIsGameOver(true);
      stopTimers();
    }
  };

  const switchTimers = () => {
    setCurrentTimer((prev) => (prev === "player1" ? "player2" : "player1"));
  };

  const stopTimers = () => {
    setCurrentTimer(null);
  };

  const isDraggable = ({ piece }) =>
    ((playerColor === "w" && chess.turn() === "w") ||
      (playerColor === "b" && chess.turn() === "b")) &&
    ((playerColor === "w" && piece.startsWith("w")) ||
      (playerColor === "b" && piece.startsWith("b")));

  const currentTurn = chess.turn(); // 'w' or 'b'

  return (
    <div className="chess-component-container flex flex-col items-center p-4 md:p-8">
      {/* Chance Indicator at Top-Right */}
      <div className="absolute top-[2%] right-[2%] text-lg font-semibold text-blue-500 bg-gray-100 px-3 py-2 rounded-md shadow-md">
        {isGameOver
          ? "Game Over"
          : currentTurn === playerColor
          ? "Your Turn"
          : "Opponent's Turn"}
      </div>

      <div className="flex relative justify-center mt-20">
        <Chessboard
          width={400}
          position={fen}
          onDrop={handleMove}
          orientation={playerColor === "w" ? "white" : "black"}
          draggable={isDraggable}
        />
      </div>

      {isGameOver && (
        <div className="game-result mt-4 text-lg font-semibold text-red-500">
          {gameResult}
        </div>
      )}

      {/* Player Timer UI */}
      <div className="flex items-center mb-4 space-x-4 absolute top-[4%] left-[2%]">
        <div className="flex items-center bg-green-600 p-2 pr-4 rounded-md shadow-lg">
          <div
            className="w-10 h-10 bg-gray-300 rounded-full"
            style={{
              // backgroundImage: `url(${user.pic})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <h2 className="ml-2 font-pacifico text-md text-white truncate">
            Opponent
          </h2>
        </div>
        <div className="timer flex items-center bg-sky-300 p-2 rounded-md text-sm">
          {Math.floor(timer2 / 60)}:{(timer2 % 60).toString().padStart(2, "0")}
        </div>
      </div>

      <div className="flex items-center mb-4 space-x-4 absolute right-[28%] bottom-[1%]">
        <div className="timer flex items-center bg-sky-300 p-2 rounded-md text-sm">
          {Math.floor(timer1 / 60)}:{(timer1 % 60).toString().padStart(2, "0")}
        </div>
        <div className="flex items-center bg-green-600 p-2 pr-4 rounded-md shadow-lg">
          <div
            className="w-10 h-10 bg-gray-300 rounded-full"
            style={{
              backgroundImage: `url(${user.pic})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <h2 className="ml-2 font-pacifico text-md text-white truncate">
            You
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ChessComponent;
