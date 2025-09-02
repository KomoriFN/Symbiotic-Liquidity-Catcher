import { useState, useEffect, useRef } from 'react'
import Basket from './components/Basket'
import Token from './components/Token'
import GameOver from './components/GameOver'
import './App.css'

// Импортируем PNG изображения
import wstETH from './assets/wstETH.png'
import mETH from './assets/mETH.png'
import LBTC from './assets/LBTC.png'
import backgroundImage from './assets/background.png'

function App() {
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [tokens, setTokens] = useState([])
  const [basketPosition, setBasketPosition] = useState(50)
  const [timeLeft, setTimeLeft] = useState(30)
  const gameAreaRef = useRef(null)
  const keysPressed = useRef({ a: false, d: false })
  const moveIntervalRef = useRef(null)
  const gameTimerRef = useRef(null)

  // Таймер игры
  useEffect(() => {
    if (gameOver) return

    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current)
      }
    }
  }, [gameOver])

  // Плавное движение корзины
  useEffect(() => {
    const moveBasket = () => {
      if (gameOver) return
      
      let movement = 0
      if (keysPressed.current.a) movement -= 1
      if (keysPressed.current.d) movement += 1
      
      if (movement !== 0) {
        setBasketPosition(prev => {
          const newPosition = prev + (movement * 0.8)
          return Math.max(5, Math.min(95, newPosition))
        })
      }
    }

    moveIntervalRef.current = setInterval(moveBasket, 20)
    
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current)
      }
    }
  }, [gameOver])

  // Обработка нажатий клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
        keysPressed.current.a = true
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
        keysPressed.current.d = true
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
        keysPressed.current.a = false
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
        keysPressed.current.d = false
      }
    }

    const handleBlur = () => {
      keysPressed.current.a = false
      keysPressed.current.d = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Генерация токенов
  useEffect(() => {
    const tokenInterval = setInterval(() => {
      if (gameOver) return
      
      const tokenTypes = ['wstETH', 'mETH', 'LBTC']
      const randomTokenType = tokenTypes[Math.floor(Math.random() * tokenTypes.length)]
      
      const newToken = {
        id: Date.now(),
        tokenType: randomTokenType,
        position: Math.random() * 80 + 10,
        caught: false,
        top: 0,
        visible: true
      }
      
      setTokens(prev => [...prev, newToken])
    }, 800)
    
    return () => clearInterval(tokenInterval)
  }, [gameOver])

  // Обновление позиции токенов
  useEffect(() => {
    const moveTokens = () => {
      if (gameOver) return
      
      setTokens(prev => 
        prev
          .map(token => ({
            ...token,
            top: (token.top || 0) + 2
          }))
          .filter(token => (token.top || 0) < 100)
      )
    }

    const gameLoop = setInterval(moveTokens, 50)
    return () => clearInterval(gameLoop)
  }, [gameOver])

  // Проверка столкновений
  useEffect(() => {
    const checkCollisions = () => {
      if (gameOver) return
      
      const basketRect = {
        left: basketPosition - 12,
        right: basketPosition + 12,
        top: 75,
        bottom: 95
      }

      setTokens(prev => prev.map(token => {
        if (!token.visible) {
          return token
        }

        const isHorizontalCollision = token.position >= basketRect.left && token.position <= basketRect.right
        const isVerticalCollision = token.top >= basketRect.top && token.top <= basketRect.bottom

        if (isHorizontalCollision && isVerticalCollision) {
          setScore(prev => prev + 10)
          return { ...token, visible: false }
        }
        return token
      }))
    }

    const collisionInterval = setInterval(checkCollisions, 50)
    return () => clearInterval(collisionInterval)
  }, [basketPosition, gameOver])

  const restartGame = () => {
    setScore(0)
    setGameOver(false)
    setTokens([])
    setBasketPosition(50)
    setTimeLeft(30)
    keysPressed.current = { a: false, d: false }
  }

  return (
    <div 
      className="game-container" 
      ref={gameAreaRef}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="game-header">
        <div>Score: {score}</div>
        <div className="game-title">Symbiotic Liquidity Catcher</div>
        <div>Time: {timeLeft}s</div>
      </div>

      <div className="controls-info">
        Hold A and D keys to move | Catch: wstETH, mETH, LBTC
      </div>

      <div className="game-area">
        {tokens.map(token => (
          token.visible && (
            <Token 
              key={token.id} 
              tokenType={token.tokenType}
              position={token.position}
              top={token.top}
              visible={token.visible}
            />
          )
        ))}
        <Basket position={basketPosition} />
      </div>

      {gameOver && (
        <GameOver score={score} timeLeft={timeLeft} onRestart={restartGame} />
      )}
    </div>
  )
}

export default App