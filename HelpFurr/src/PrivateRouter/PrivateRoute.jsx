import React, {  useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore';

function PrivateRoute({children}) {
    const {isAuthenticated, user, loading } = useAuthStore();
    const location = useLocation();
    if(loading) {
        return(
            <loadingSpinner/>
        )
    }
    if(isAuthenticated && user.emailVerified) {
        return children;
    }
  return (
    <Navigate to="/login" state={{from: location}} replace></Navigate>
  )
}

export default PrivateRoute