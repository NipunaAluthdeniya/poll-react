import { Route, Routes } from 'react-router-dom'
import Header from './pages/header/Header'
import Login from './pages/auth/login/Login'
import Signup from './pages/auth/signup/Signup'
import Dashboard from './user/dashboard/Dashboard'

function App() {

  return (
    <>
     <Header />
     <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Signup />} />
      <Route path='/dashboard' element={<Dashboard />} />
     </Routes>
    </>
  )
}

export default App
