import React from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginForm from './components/auth/LoginForm'
import Layout from './components/layout/Layout'
import './App.css'

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated()) {
    return <LoginForm />
  }

  return <Layout />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
