function GameOver({ score, timeLeft, onRestart }) {
  const handleStakingClick = () => {
    window.open('https://symbiotic.fi/', '_blank'); // Открываем в новой вкладке
  }

  return (
    <div className="game-over">
      <h2>Time's Up!</h2>
      <p>Final Score: {score}</p>
      <p>Time Left: {timeLeft}s</p>
      <div className="game-over-buttons">
        <button onClick={onRestart}>Play Again</button>
        <button onClick={handleStakingClick} className="staking-button">
          Universal Staking
        </button>
      </div>
    </div>
  )
}

export default GameOver