// src/contexts/CanvasContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { getUnauthorizedAxiosInstance } from '../utils/AxiosUtils';

interface MyJwtPayload extends JwtPayload{
  isAdmin: Boolean;
}

interface AuthState {
  user: String | null;
  isAdmin: Boolean;
  tokenBase64: String | null;
  payload: MyJwtPayload | null;
}

interface AuthContextType {
  authState: AuthState;
  loginAction: (data : {username: String, password: String}) => void;
  registerAction: (data : {username: String, password: String}) => void;
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
      isAdmin: false,
      tokenBase64: null,
      payload: null,
    };
    if (tokenBase64) {
      const payload = jwtDecode<MyJwtPayload>(tokenBase64);
      if (payload && payload.sub) {
        authState.tokenBase64 = tokenBase64;
        authState.payload = payload;
        authState.user = payload.sub;
        authState.isAdmin = payload.isAdmin;
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
      const axiosInstance = getUnauthorizedAxiosInstance();
      axiosInstance.post('/api/login', data).then(resp => {
        const token : string = resp.data.token;
        if (token) {
          console.log(`got login data: ${token}`)
          const newState = parseJWT(token);
          setAuthState(newState);
          localStorage.setItem("jwt", token);
          navigate("/app");
          return;
        }
      }).catch(err => {
        alert("Unable to authenticate - check login creadentials");
        console.log(err);
      });
    } catch (err) {
      alert("Unable to authenticate - check login creadentials");
      console.error(err);
    }
  }

  const registerAction = async (data : {username: String, password: String}) => {
    try {
      const axiosInstance = getUnauthorizedAxiosInstance();
      axiosInstance.post('/api/register', data).then(resp => {
        const token : string = resp.data.token;
        if (token) {
          console.log(`got login data: ${token}`)
          const newState = parseJWT(token);
          setAuthState(newState);
          localStorage.setItem("jwt", token);
          navigate("/app");
          return;
        }
      }).catch(err => {
        alert(err);
        console.log(err);
      });
    } catch (err) {
      alert(err);
      console.error(err);
    }
  }

  const logOut = () => {
    localStorage.removeItem("jwt");
    const authState: AuthState = {
      user: null,
      isAdmin: false,
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
      authState, loginAction, logOut, registerAction
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
