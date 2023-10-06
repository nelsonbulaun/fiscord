import { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios";

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  user: null,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    {
      if (!user) {
        const isAuth = async () => {
          try {
            Axios({
              method: "GET",
              withCredentials: true,
              url: "https://fiscord.uw.r.appspot.com/user",
            }).then((res) => {
              setUser(res.data);
            });
          } catch (error) {
            setUser(null);
          }
        };
        isAuth();
      }
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
