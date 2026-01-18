import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AnswerQuestions from './pages/AnswerQuestions'
import AskQuestion from './pages/AskQuestion'
import ManageQuestions from './pages/ManageQuestions'

function App() {
  const { identity } = useApp()

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/dashboard" 
          element={identity ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/answer" 
          element={identity ? <AnswerQuestions /> : <Navigate to="/" />} 
        />
        <Route 
          path="/ask" 
          element={identity ? <AskQuestion /> : <Navigate to="/" />} 
        />
        <Route 
          path="/manage" 
          element={identity ? <ManageQuestions /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
