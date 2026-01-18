import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AppContext = createContext(null)

const STORAGE_KEYS = {
  IDENTITY: 'cv_identity',
  QUESTIONS: 'cv_questions',
  ANSWERED: 'cv_answered'
}

export function AppProvider({ children }) {
  const [identity, setIdentity] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IDENTITY)
    return saved || null
  })

  const [questions, setQuestions] = useState([])
  const [answeredQuestions, setAnsweredQuestions] = useState({})
  const [loading, setLoading] = useState(true)

  // Persist identity to localStorage
  useEffect(() => {
    if (identity) {
      localStorage.setItem(STORAGE_KEYS.IDENTITY, identity)
    } else {
      localStorage.removeItem(STORAGE_KEYS.IDENTITY)
    }
  }, [identity])

  // Load data on mount
  useEffect(() => {
    if (isSupabaseConfigured()) {
      loadFromSupabase()
    } else {
      loadFromLocalStorage()
    }
  }, [])

  // Load from localStorage (fallback)
  const loadFromLocalStorage = () => {
    const savedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS)
    const savedAnswered = localStorage.getItem(STORAGE_KEYS.ANSWERED)
    setQuestions(savedQuestions ? JSON.parse(savedQuestions) : [])
    setAnsweredQuestions(savedAnswered ? JSON.parse(savedAnswered) : {})
    setLoading(false)
  }

  // Save to localStorage (fallback)
  const saveToLocalStorage = (newQuestions, newAnswered) => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(newQuestions))
    localStorage.setItem(STORAGE_KEYS.ANSWERED, JSON.stringify(newAnswered))
  }

  // Load from Supabase
  const loadFromSupabase = async () => {
    try {
      // Load questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true })

      if (questionsError) throw questionsError

      // Transform to match our format
      const formattedQuestions = questionsData.map(q => ({
        id: q.id,
        text: q.text,
        choices: q.choices,
        correctIndex: q.correct_index,
        explanation: q.explanation,
        author: q.author,
        target: q.target,
        active: q.active,
        createdAt: q.created_at
      }))
      setQuestions(formattedQuestions)

      // Load answers
      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('*')

      if (answersError) throw answersError

      // Transform to our format (keyed by identity, then question_id)
      const formattedAnswers = {}
      answersData.forEach(a => {
        if (!formattedAnswers[a.answered_by]) {
          formattedAnswers[a.answered_by] = {}
        }
        formattedAnswers[a.answered_by][a.question_id] = {
          selectedIndex: a.selected_index,
          answeredAt: a.answered_at
        }
      })
      setAnsweredQuestions(formattedAnswers)

    } catch (error) {
      console.error('Error loading from Supabase:', error)
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  // Refresh data from Supabase
  const refreshData = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await loadFromSupabase()
    }
  }, [])

  const selectIdentity = (id) => {
    setIdentity(id)
  }

  const clearIdentity = () => {
    setIdentity(null)
  }

  const getOppositeIdentity = () => {
    return identity === 'Chocolate' ? 'Vanilla' : 'Chocolate'
  }

  // Get questions for the current user to answer
  const getQuestionsForMe = () => {
    const myAnswers = answeredQuestions[identity] || {}
    return questions.filter(q => 
      q.target === identity && 
      q.active && 
      !myAnswers[q.id]
    )
  }

  // Get questions authored by current user
  const getMyQuestions = () => {
    return questions.filter(q => q.author === identity)
  }

  // Add a new question
  const addQuestion = async (questionData) => {
    const newQuestion = {
      text: questionData.text,
      choices: questionData.choices,
      correctIndex: questionData.correctIndex,
      explanation: questionData.explanation || null,
      author: identity,
      target: getOppositeIdentity(),
      active: true,
      createdAt: new Date().toISOString()
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('questions')
          .insert({
            text: newQuestion.text,
            choices: newQuestion.choices,
            correct_index: newQuestion.correctIndex,
            explanation: newQuestion.explanation,
            author: newQuestion.author,
            target: newQuestion.target,
            active: newQuestion.active
          })
          .select()
          .single()

        if (error) throw error

        const formattedQuestion = {
          id: data.id,
          text: data.text,
          choices: data.choices,
          correctIndex: data.correct_index,
          explanation: data.explanation,
          author: data.author,
          target: data.target,
          active: data.active,
          createdAt: data.created_at
        }
        setQuestions(prev => [...prev, formattedQuestion])
        return formattedQuestion
      } catch (error) {
        console.error('Error adding question:', error)
        throw error
      }
    } else {
      // localStorage fallback
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2)
      const questionWithId = { ...newQuestion, id }
      const newQuestions = [...questions, questionWithId]
      setQuestions(newQuestions)
      saveToLocalStorage(newQuestions, answeredQuestions)
      return questionWithId
    }
  }

  // Update an existing question
  const updateQuestion = async (id, updates) => {
    if (isSupabaseConfigured()) {
      try {
        const dbUpdates = {}
        if (updates.text !== undefined) dbUpdates.text = updates.text
        if (updates.choices !== undefined) dbUpdates.choices = updates.choices
        if (updates.correctIndex !== undefined) dbUpdates.correct_index = updates.correctIndex
        if (updates.explanation !== undefined) dbUpdates.explanation = updates.explanation
        if (updates.active !== undefined) dbUpdates.active = updates.active

        const { error } = await supabase
          .from('questions')
          .update(dbUpdates)
          .eq('id', id)

        if (error) throw error

        setQuestions(prev => 
          prev.map(q => q.id === id ? { ...q, ...updates } : q)
        )
      } catch (error) {
        console.error('Error updating question:', error)
        throw error
      }
    } else {
      const newQuestions = questions.map(q => q.id === id ? { ...q, ...updates } : q)
      setQuestions(newQuestions)
      saveToLocalStorage(newQuestions, answeredQuestions)
    }
  }

  // Delete a question
  const deleteQuestion = async (id) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', id)

        if (error) throw error

        setQuestions(prev => prev.filter(q => q.id !== id))
      } catch (error) {
        console.error('Error deleting question:', error)
        throw error
      }
    } else {
      const newQuestions = questions.filter(q => q.id !== id)
      setQuestions(newQuestions)
      saveToLocalStorage(newQuestions, answeredQuestions)
    }
  }

  // Toggle question active status
  const toggleQuestionActive = async (id) => {
    const question = questions.find(q => q.id === id)
    if (question) {
      await updateQuestion(id, { active: !question.active })
    }
  }

  // Mark a question as answered
  const markAnswered = async (questionId, selectedIndex) => {
    const answerData = {
      selectedIndex,
      answeredAt: new Date().toISOString()
    }

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('answers')
          .insert({
            question_id: questionId,
            answered_by: identity,
            selected_index: selectedIndex
          })

        if (error) throw error

        setAnsweredQuestions(prev => ({
          ...prev,
          [identity]: {
            ...(prev[identity] || {}),
            [questionId]: answerData
          }
        }))
      } catch (error) {
        console.error('Error marking answered:', error)
        throw error
      }
    } else {
      const newAnswered = {
        ...answeredQuestions,
        [identity]: {
          ...(answeredQuestions[identity] || {}),
          [questionId]: answerData
        }
      }
      setAnsweredQuestions(newAnswered)
      saveToLocalStorage(questions, newAnswered)
    }
  }

  // Get answer for a question
  const getAnswer = (questionId) => {
    const myAnswers = answeredQuestions[identity] || {}
    return myAnswers[questionId] || null
  }

  // Get partner's answer for a question (to see if they got it right)
  const getPartnerAnswer = (questionId) => {
    const partnerIdentity = getOppositeIdentity()
    const partnerAnswers = answeredQuestions[partnerIdentity] || {}
    return partnerAnswers[questionId] || null
  }

  const value = {
    identity,
    selectIdentity,
    clearIdentity,
    getOppositeIdentity,
    questions,
    getQuestionsForMe,
    getMyQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    toggleQuestionActive,
    markAnswered,
    getAnswer,
    getPartnerAnswer,
    loading,
    refreshData,
    isOnline: isSupabaseConfigured()
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
