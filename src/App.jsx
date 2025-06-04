import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards'
import TemplatesList from '~/components/Templates/TemplatesList'


const ProtectedRoute = ({ user }) => {
  console.log('ProtectedRoute: currentUser', user)
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        <Navigate to="/boards" replace={true} />
      } />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/boards' element={<Boards />} />

        {/* User Settings */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      {/* Public Routes */}
      <Route path='/templates' element={<TemplatesList />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
