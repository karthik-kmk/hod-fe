import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
const Login = () => {
  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        usn,
        password,
      });
      const { name, role } = response.data;

      if (role === "hod") {
        navigate("/hoddashboard");
      } else if (role === "teacher") {
        navigate("/teachersdashboard", { state: { name } });
      } else if (role === "student") {
        navigate("/studentdashboard");
      } else {
        setError("Invalid role");
      }
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>USN:</label>
          <input
            type="text"
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
