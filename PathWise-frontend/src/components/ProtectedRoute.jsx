import { Navigate } from 'react-router-dom';


export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/auth" replace />
}

export const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/select-path" replace /> : children
}


