// src/contexts/CanvasContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import { useNavigate } from "react-router-dom";

interface AuthState {
  user: String | null;
  tokenBase64: String | null;
  payload: JwtPayload | null;
}

interface AuthContextType {
  authState: AuthState;
  loginAction: (data : {username: String, password: String}) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const parseJWT = (tokenBase64: string | null): AuthState => {
    const authState: AuthState = {
      user: null,
      tokenBase64: null,
      payload: null,
    };
    if (tokenBase64) {
      const payload = jwtDecode<JwtPayload>(tokenBase64);
      if (payload && payload.sub) {
        authState.tokenBase64 = tokenBase64;
        authState.payload = payload;
        authState.user = payload.sub;

        console.log(`Auth Context: ${JSON.stringify(authState)}`);
      }
    }
    return authState;
  }

  const tokenBase64 = localStorage.getItem('jwt');
  const defaultState = parseJWT(tokenBase64);

  const [authState, setAuthState] = useState<AuthState>(defaultState);
  const navigate = useNavigate();
  const loginAction = async (data : {username: String, password: String}) => {
    try {
      const address = process.env.REACT_APP_SERVER_ADDRESS || '';
      const endpoint = address +'/api/login';
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(`login response: ${res}`)
      const token = res.token;
      if (token) {
        console.log(`got login data: ${token}`)
        const newState = parseJWT(token);
        setAuthState(newState);
        localStorage.setItem("jwt", token);
        navigate("/app");
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  }

  const logOut = () => {
    localStorage.removeItem("jwt");
    const authState: AuthState = {
      user: null,
      tokenBase64: null,
      payload: null,
    };
    setAuthState(authState);
    navigate("/login");
  };


  // const updateState = (newPartialState: Partial<AuthState>) => {
  //   setState({ ...state, ...newPartialState });
  // }

  return (
    <AuthContext.Provider value={{
      authState, loginAction, logOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
