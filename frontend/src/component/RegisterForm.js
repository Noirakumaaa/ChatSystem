import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      navigate("/chat/default");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("http://13.213.46.53:5555/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Error connecting to server");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {["email", "username", "password", "confirmPassword"].map((field) => (
            <div key={field} style={styles.inputGroup}>
              <label htmlFor={field} style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field.includes("password") ? "password" : "text"}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                style={styles.input}
                placeholder={`Enter your ${field}`}
              />
            </div>
          ))}
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitButton}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
    textAlign: "center",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    marginTop: "8px",
    backgroundColor: "#f9f9f9",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "20px",
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default RegisterForm;
