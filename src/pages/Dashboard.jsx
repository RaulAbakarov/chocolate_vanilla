import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/dashboard.css'

// October 11, 2025 - the day we first texted
const START_DATE = new Date('2025-10-11T00:00:00')

function calculateTimeSince(startDate) {
  const now = new Date()
  const diff = now - startDate
  
  const seconds = Math.floor(diff / 1000) % 60
  const minutes = Math.floor(diff / (1000 * 60)) % 60
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  // Calculate months and remaining days
  const months = Math.floor(totalDays / 30.44) // Average days per month
  const days = Math.floor(totalDays % 30.44)
  
  return { months, days, hours, minutes, seconds }
}

function Dashboard() {
  const navigate = useNavigate()
  const { identity, clearIdentity, getQuestionsForMe, getMyQuestions, loading, refreshData, isOnline } = useApp()
  const [timeSince, setTimeSince] = useState(calculateTimeSince(START_DATE))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSince(calculateTimeSince(START_DATE))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
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
        <div className="relationship-timer">
          <p className="timer-label">Together for</p>
          <div className="timer-display">
            <div className="timer-unit">
              <span className="timer-value">{timeSince.months}</span>
              <span className="timer-name">months</span>
            </div>
            <div className="timer-unit">
              <span className="timer-value">{timeSince.days}</span>
              <span className="timer-name">days</span>
            </div>
            <div className="timer-unit">
              <span className="timer-value">{String(timeSince.hours).padStart(2, '0')}</span>
              <span className="timer-name">hours</span>
            </div>
            <div className="timer-unit">
              <span className="timer-value">{String(timeSince.minutes).padStart(2, '0')}</span>
              <span className="timer-name">min</span>
            </div>
            <div className="timer-unit">
              <span className="timer-value">{String(timeSince.seconds).padStart(2, '0')}</span>
              <span className="timer-name">sec</span>
            </div>
          </div>
        </div>

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
