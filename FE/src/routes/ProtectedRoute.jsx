import { Navigate, Outlet } from 'react-router-dom'
// import { useAuthStore } from '../store/authStore'
import Loading from '../components/common/Loading/Loading'

const ProtectedRoute = () => {
  // const { user, isLoading } = useAuthStore()

  // if (isLoading) {
  //   return <Loading fullScreen />
  // }

  // if (!user) {
  //   return <Navigate to="/login" replace />
  // }

  return <Outlet />
}

export default ProtectedRoute
