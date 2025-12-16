import { Navigate, Outlet } from 'react-router-dom'
// import { useAuthStore } from '../store/authStore'
import Loading from '../components/common/Loading/Loading'

const PublicRoute = () => {
  // const { user, isLoading } = useAuthStore()

  // if (isLoading) {
  //   return <Loading fullScreen />
  // }

  // if (user) {
  //   return <Navigate to="/chat" replace />
  // }

  return <Outlet />
}

export default PublicRoute