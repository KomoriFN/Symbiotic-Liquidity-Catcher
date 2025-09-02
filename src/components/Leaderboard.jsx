import { useState, useEffect } from 'react'

function Leaderboard({ currentScore }) {
  const [scores, setScores] = useState([])

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('liquidityCatcherScores')) || []
    setScores(savedScores)
  }, [])

  useEffect(() => {
    if (currentScore > 0) {
      const newScores = [...scores, currentScore]
        .sort((a, b) => b - a)
        .slice(0, 5)
      
      setScores(newScores)
      localStorage.setItem('liquidityCatcherScores', JSON.stringify(newScores))
    }
  }, [currentScore])

  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      <ol>
        {scores.map((score, index) => (
          <li key={index}>{score}</li>
        ))}
      </ol>
    </div>
  )
}

export default Leaderboard