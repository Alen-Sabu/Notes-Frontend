import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    // If the auth throws an error the catch block sets the isAuthorized to false
    auth().catch(() => setIsAuthorized(false)); 
  }, []);

  const refreshToken = async () => {
    /* - asynchronous function that handles refreshing the access token
         stored in localStorage
       - The refresh token is retrieved from 'localStorage'
       - A POST request is made to the 'api/token/refresh/' endpoint with 
         the refresh token
       - If the response status is 200, the new access token is stored in 'localStorage'
         and 'isAuthorized' is set to 'true'
       - If the response status is not 200, 'isAuthorized' is set to 'false'
       - Any errors during the process are caught, logged to the console and 'isAuthorized' is 
         to 'false'. 
    */
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    /*
        - asynchrounous function that checks the autorization status of the user
        - It retrieves the access token from the 'localStorage'
        - If there is no token, 'isAuthorized' is set to false'
        - If there is token, it is decoded to extract the expiration time.
        - If the token is expired(current time is greater thatn the expiration time), 'refreshToken' 
          is called to get a new token
        - If the token is still valid, 'isAuthorized' is set to true 
    */

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized == null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
