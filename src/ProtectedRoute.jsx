import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom"


const ProtectedRoute=({children, redirectPath="/fiscord/login", }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user){
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoute;