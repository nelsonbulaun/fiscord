import { Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export const OriginalLayout = () => {
    return(
        <div id="gradient-background" className="h-screen w-screen">
        <Outlet />
        </div>
    )}

export default OriginalLayout;