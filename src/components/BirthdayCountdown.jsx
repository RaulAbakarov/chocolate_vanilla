import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './BirthdayCountdown.css'

const BIRTHDAYS = {
  Chocolate: { month: 8, day: 7 }, // August 7
  Vanilla: { month: 9, day: 7 }    // September 7
}

function BirthdayCountdown() {
  const { t } = useLanguage()
  const [countdowns, setCountdowns] = useState({
    Chocolate: null,
    Vanilla: null
  })
  const [isBirthday, setIsBirthday] = useState({
    Chocolate: false,
    Vanilla: false
  })

  useEffect(() => {
    const calculateCountdown = (targetMonth, targetDay) => {
      const now = new Date()
      const currentYear = now.getFullYear()
      
      // Create target date for this year
      let targetDate = new Date(currentYear, targetMonth - 1, targetDay)
      
      // If the birthday has passed this year, use next year
      if (now > targetDate) {
        targetDate = new Date(currentYear + 1, targetMonth - 1, targetDay)
      }
      
      // Check if today is the birthday
      const isToday = now.getMonth() === targetMonth - 1 && now.getDate() === targetDay
      
      const diff = targetDate - now
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      return { days, hours, minutes, seconds, isToday }
    }

    const updateCountdowns = () => {
      const chocolateData = calculateCountdown(BIRTHDAYS.Chocolate.month, BIRTHDAYS.Chocolate.day)
      const vanillaData = calculateCountdown(BIRTHDAYS.Vanilla.month, BIRTHDAYS.Vanilla.day)
      
      setCountdowns({
        Chocolate: chocolateData,
        Vanilla: vanillaData
      })
      
      setIsBirthday({
        Chocolate: chocolateData.isToday,
        Vanilla: vanillaData.isToday
      })
    }

    updateCountdowns()
    const interval = setInterval(updateCountdowns, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const renderCountdown = (name, countdown, birthday) => {
    if (!countdown) return null
    
    const birthdayDate = name === 'Chocolate' ? t('augustSeven') : t('septemberSeven')
    
    if (birthday) {
      return (
        <div className={`birthday-card birthday-card-${name.toLowerCase()} is-birthday`}>
          <div className="birthday-celebration">
            <div className="confetti-container">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="confetti" style={{ 
                  '--delay': `${Math.random() * 3}s`,
                  '--x': `${Math.random() * 100}%`,
                  '--rotation': `${Math.random() * 360}deg`
                }} />
              ))}
            </div>
            <span className="birthday-emoji">🎂</span>
            <h3 className="birthday-name">{name}</h3>
            <p className="birthday-message">{t('happyBirthday')}</p>
            <span className="birthday-emoji">🎉</span>
          </div>
        </div>
      )
    }
    
    return (
      <div className={`birthday-card birthday-card-${name.toLowerCase()}`}>
        <div className="birthday-header">
          <span className="birthday-icon">{name === 'Chocolate' ? '🍫' : '🍦'}</span>
          <h3 className="birthday-name">{name}</h3>
        </div>
        <p className="birthday-date">{birthdayDate}</p>
        <div className="countdown-grid">
          <div className="countdown-item">
            <span className="countdown-value">{countdown.days}</span>
            <span className="countdown-label">{t('days')}</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{countdown.hours}</span>
            <span className="countdown-label">{t('hours')}</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{countdown.minutes}</span>
            <span className="countdown-label">{t('min')}</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{countdown.seconds}</span>
            <span className="countdown-label">{t('sec')}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="birthday-countdown-container">
      <h2 className="birthday-title">{t('birthdayCountdown')}</h2>
      <div className="birthday-cards">
        {renderCountdown('Chocolate', countdowns.Chocolate, isBirthday.Chocolate)}
        {renderCountdown('Vanilla', countdowns.Vanilla, isBirthday.Vanilla)}
      </div>
    </div>
  )
}

export default BirthdayCountdown
