import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/common/Loading/Loading";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.user);

  if (user === undefined) {
    return <Loading fullScreen />;
  }

  const user_id = user?.user_id; 
  return user_id ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;