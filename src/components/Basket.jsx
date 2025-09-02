function Basket({ position }) {
  return (
    <div 
      className="basket"
      style={{ 
        left: `${position}%`
      }}
    >
      <img 
        src="/images/wallet.png" 
        alt="Wallet" 
        className="wallet-image"
      />
    </div>
  )
}

export default Basket