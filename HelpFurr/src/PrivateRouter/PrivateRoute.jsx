import React, {  useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Navigate, useLocation } from 'react-router-dom'

function PrivateRoute() {
    const { user, loading } = useContext(AuthContext)
    const location = useLocation();

    if(loading) {
        return(
            <loadingSpinner/>
        )
    }
    if(user) {
        return children;
    }
  return (
    <Navigate to="/login" state={{from: location}} replace></Navigate>
  )
}

export default PrivateRoute