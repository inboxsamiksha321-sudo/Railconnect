import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // restore login on refresh
  useEffect(() => {

    const token = localStorage.getItem("railconnect_officer_token");

    const savedOfficer = localStorage.getItem("officer_user");

    if (token && savedOfficer) {

      setUser(JSON.parse(savedOfficer));

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    setLoading(false);

  }, []);

  // officer login
  const login = async (email, password) => {

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("email", email);

      formData.append("password", password);

      const res = await axios.post(
        `${API_BASE_URL}/officer-login`,
        formData
      );

      if (!res.data.success) {

        return {
          success: false,
          message: res.data.message,
        };
      }

      const token = res.data.token;

      const officer = res.data.officer;

      // save login
      localStorage.setItem(
        "railconnect_officer_token",
        token
      );

      localStorage.setItem(
        "officer_user",
        JSON.stringify(officer)
      );

      // set axios auth header
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // set user state
      setUser(officer);

      return { success: true };

    } catch (err) {

      return {
        success: false,
        message:
          err.response?.data?.detail ||
          err.message ||
          "Login failed",
      };

    } finally {

      setLoading(false);
    }
  };

  // logout
  const logout = () => {

    setUser(null);

    localStorage.removeItem("railconnect_officer_token");

    localStorage.removeItem("officer_user");

    delete axios.defaults.headers.common[
      "Authorization"
    ];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};

export default AuthContext;