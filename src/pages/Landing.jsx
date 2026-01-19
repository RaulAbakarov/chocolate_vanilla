import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/landing.css'

function Landing() {
  const navigate = useNavigate()
  const { selectIdentity, identity } = useApp()
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const input = nickname.trim().toLowerCase()
    
    if (input === 'vanilla') {
      selectIdentity('Vanilla')
      navigate('/dashboard')
    } else if (input === 'chocolate') {
      selectIdentity('Chocolate')
      navigate('/dashboard')
    } else {
      setError('Invalid nickname')
    }
  }

  const handleInputChange = (e) => {
    setNickname(e.target.value)
    if (error) setError('')
  }

  // If already has identity, go to dashboard
  if (identity) {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="landing">
      <div className="landing-content">
        <p className="landing-message">This website is designed for us.</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="nickname-input"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={handleInputChange}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

export default Landing
