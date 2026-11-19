import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import LoadingScreen from "../common/LoadingScreen"

/**
 * ProtectedRoute Guard
 * - Displays a branded loader while initial authentication/session verification runs.
 * - Redirects unauthenticated visitors to /login, saving current location in route state.
 * - Renders protected children or nested routes when authenticated.
 */
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
