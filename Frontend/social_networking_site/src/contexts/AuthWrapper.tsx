import { createContext, useContext, useState } from "react";

type AuthType = {
  token: string | null;
  isAuthenticated: boolean;
};

export const AuthContext = createContext({});

export const AuthData = () => useContext(AuthContext);

const AuthWrapper = (props) => {
  const [authenticate, setAuthenticate] = useState<AuthType>({
    token: sessionStorage.getItem("token") || null,
    isAuthenticated: sessionStorage.getItem("token") ? true : false,
  });

  const logout = () => {
    sessionStorage.removeItem("token");
    setAuthenticate({ token: null, isAuthenticated: false });
  };

  const login = (token: string) => {
    sessionStorage.setItem("token", token);
    setAuthenticate({ token: token, isAuthenticated: true });
    console.log(authenticate);
  };
  return (
    <AuthContext.Provider value={{ login, logout, authenticate }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthWrapper;
