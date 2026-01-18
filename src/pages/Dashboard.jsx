import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { identity, clearIdentity, getQuestionsForMe, getMyQuestions, loading, refreshData, isOnline } = useApp()
  
  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-content">
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    )
  }

  const questionsForMe = getQuestionsForMe()
  const myQuestions = getMyQuestions()

  const handleSwitchIdentity = () => {
    clearIdentity()
    navigate('/')
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="current-identity">
          You are <strong>{identity}</strong>
          {isOnline && <span className="online-badge">●</span>}
        </span>
        <div className="header-actions">
          {isOnline && (
            <button 
              className="refresh-button"
              onClick={refreshData}
              title="Refresh"
            >
              ↻
            </button>
          )}
          <button 
            className="switch-button"
            onClick={handleSwitchIdentity}
          >
            Switch
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-options">
          <button 
            className="dashboard-option"
            onClick={() => navigate('/answer')}
          >
            <span className="option-title">Answer Questions</span>
            {questionsForMe.length > 0 && (
              <span className="option-hint">
                {questionsForMe.length} waiting for you
              </span>
            )}
            {questionsForMe.length === 0 && (
              <span className="option-hint muted">
                No new questions right now
              </span>
            )}
          </button>

          <button 
            className="dashboard-option"
            onClick={() => navigate('/ask')}
          >
            <span className="option-title">Ask a Question</span>
            <span className="option-hint">
              Write something for {identity === 'Chocolate' ? 'Vanilla' : 'Chocolate'}
            </span>
          </button>

          {myQuestions.length > 0 && (
            <button 
              className="dashboard-option secondary"
              onClick={() => navigate('/manage')}
            >
              <span className="option-title">Manage My Questions</span>
              <span className="option-hint">
                {myQuestions.length} question{myQuestions.length !== 1 ? 's' : ''} created
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
