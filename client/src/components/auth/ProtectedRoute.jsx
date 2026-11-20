import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import LoadingScreen from "../common/LoadingScreen"

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((s) => s.ui.isAuthenticated)
  const isAuthChecking = useSelector((s) => s.ui.isAuthChecking)
  const location = useLocation()

  if (isAuthChecking) {
    return <LoadingScreen message="Checking session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
