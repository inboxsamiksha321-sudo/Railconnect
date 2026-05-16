import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load check if user is already logged in via token
  useEffect(() => {
    const token = localStorage.getItem("railconnect_token");
    const savedUser = localStorage.getItem("railconnect_user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("email", email);
      formData.append("password", password);

      const res = await axios.post(`${API_BASE_URL}/login`, formData);

      if (!res.data.success) {
        return {
          success: false,
          message: res.data.message,
        };
      }

      const { token, user } = res.data;

      // save login
      localStorage.setItem("railconnect_token", token);
      localStorage.setItem("railconnect_user", JSON.stringify(user));

      // set auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // set user state
      setUser(user);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formDataInput) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", formDataInput.name);
      formData.append("email", formDataInput.email);
      formData.append("phone", formDataInput.phone);
      formData.append("password", formDataInput.password);

      const res = await axios.post(`${API_BASE_URL}/register`, formData);

      if (!res.data.success) {
        return {
          success: false,
          message: res.data.message,
        };
      }

      const { token, user } = res.data;

      // save login
      localStorage.setItem("railconnect_token", token);
      localStorage.setItem("railconnect_user", JSON.stringify(user));

      // set auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // set user
      setUser(user);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message || err.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("railconnect_token");
    localStorage.removeItem("railconnect_user");
    delete axios.defaults.headers.common["Authorization"];
    // TODO: optionally call logout API
    // axios.post(`${API_BASE_URL}/auth/logout`)
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;
