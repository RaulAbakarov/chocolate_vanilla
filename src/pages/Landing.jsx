import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/landing.css'

function Landing() {
  const navigate = useNavigate()
  const { selectIdentity, identity } = useApp()

  const handleSelect = (id) => {
    selectIdentity(id)
    navigate('/dashboard')
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
        
        <div className="identity-buttons">
          <button 
            className="identity-button chocolate"
            onClick={() => handleSelect('Chocolate')}
          >
            Chocolate
          </button>
          
          <button 
            className="identity-button vanilla"
            onClick={() => handleSelect('Vanilla')}
          >
            Vanilla
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing
