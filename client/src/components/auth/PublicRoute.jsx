import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import LoadingScreen from "../common/LoadingScreen"

/**
 * PublicRoute / GuestRoute Guard
 * - Displays a branded loader while session is being verified.
 * - Redirects already authenticated users to /app or their previous attempted destination.
 * - Renders login/register children only when unauthenticated.
 */
export default function PublicRoute({ children }) {
  const isAuthenticated = useSelector((s) => s.ui.isAuthenticated)
  const isAuthChecking = useSelector((s) => s.ui.isAuthChecking)
  const location = useLocation()

  if (isAuthChecking) {
    return <LoadingScreen message="Checking session..." />
  }

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || "/app"
    return <Navigate to={destination} replace />
  }

  return children
}
