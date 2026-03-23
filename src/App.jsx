import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './pages/header/Header'
import Login from './pages/auth/login/Login'
import Signup from './pages/auth/signup/Signup'
import Dashboard from './user/dashboard/Dashboard'
import CreatePoll from './user/create-poll/CreatePoll'
import ViewMyPolls from './user/view-my-polls/ViewMyPolls'
import ViewPollDetails from './user/view-poll-details/ViewPollDetails'

function App() {

  return (
    <>
     <Header />
     <Routes>
      <Route path='/' element={<Navigate to='/register' replace />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Signup />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/poll/create' element={<CreatePoll />} />
      <Route path='/my-polls' element={<ViewMyPolls />} />
      <Route path='/poll/:id/:view' element={<ViewPollDetails />} />
      <Route path='*' element={<Navigate to='/register' replace />} />
     </Routes>
    </>
  )
}

export default App
