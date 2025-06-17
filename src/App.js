import { Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import Home from "./pages/Home";
import Games from "./pages/Games";
import "remixicon/fonts/remixicon.css";
// import Ttt from './components/games/tictactoe/Ttt';
import TttHome from "./components/games/tictactoe/TttHome";
import Tttplay from "./components/games/tictactoe/Tttplay";
import Chessplay from "./components/games/chess/ChessPlay";
import ChessHome from "./components/games/chess/chessHome";

function App() {
  return (
    <div className="App w-full h-screen  ">
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/home/ttt" element={<TttHome />} />
        <Route path="/home/chess" element={<ChessHome />} />
        <Route path="/games/ttt/:id" element={<Tttplay />} />
        <Route path="/games/chess/:id" element={<Chessplay />} />
      </Routes>
    </div>
  );
}

export default App;
