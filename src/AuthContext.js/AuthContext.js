import React, { createContext, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchApiLogin, resetAuthState } from "../redux/AuthSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (userName, password) => {
    // Reset the auth state before making a new login attempt
    dispatch(resetAuthState());

    try {
      const data = { userName, password };
      const loggedInUser = await dispatch(fetchApiLogin(data));
      if (!loggedInUser.error) {
        setIsLoggedIn(true);
        console.log("hi", loggedInUser.payload);
        setUser(loggedInUser.payload);
        localStorage.setItem("user", JSON.stringify(loggedInUser.payload));
      } else {
        console.log("Login failed");
      }

      // Implement your logic based on the login result
    } catch (error) {
      // Handle error (if needed)
      console.log("Login failed");
    }
  };

  const logout = () => {
    // Implement your logout logic here
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
