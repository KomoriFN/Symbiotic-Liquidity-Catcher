import wstETH from '../assets/wstETH.png'
import mETH from '../assets/mETH.png'
import LBTC from '../assets/LBTC.png'

function Token({ tokenType, position, top = 0, visible = true }) {
  const getTokenImage = () => {
    switch (tokenType) {
      case 'wstETH': return wstETH
      case 'mETH': return mETH
      case 'LBTC': return LBTC
      default: return wstETH
    }
  }

  return (
    <div 
      className={`token ${visible ? '' : 'caught'}`}
      style={{ 
        left: `${position}%`,
        top: `${top}%`
      }}
    >
      <img 
        src={getTokenImage()} 
        alt={tokenType}
        className="token-image"
      />
    </div>
  )
}

export default Token