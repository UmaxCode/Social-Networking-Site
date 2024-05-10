import { createContext, useContext, useState } from "react";

type AuthType = {
  token: string | null;
  isAuthenticated: boolean;
};

type ContextValue = {
  login: (token: string) => void;
  logout: () => void;
  authenticate: AuthType;
};

const initialContextValue: ContextValue = {
  login: function (token: string): void {},
  logout: function (): void {},
  authenticate: {
    token: null,
    isAuthenticated: false,
  },
};

export const AuthContext = createContext(initialContextValue);

export const AuthData = () => useContext(AuthContext);

const AuthWrapper = (props: { children: React.ReactNode }) => {
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

  const contextValue: ContextValue = {
    login,
    logout,
    authenticate,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthWrapper;
