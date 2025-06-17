import React from "react";

const GameOverPage = () => {
  const handleRestart = () => {
    // Logic for restarting the game or navigating to a different page
    ("Restarting the game...");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Game Over</h1>
      <p style={styles.message}>Your opponent left the game.</p>
      <button style={styles.button} onClick={handleRestart}>
        Play Again
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#1a1a2e",
    color: "#e94560",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.5rem",
    marginBottom: "2rem",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#0f3460",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#16213e",
  },
};

export default GameOverPage;
