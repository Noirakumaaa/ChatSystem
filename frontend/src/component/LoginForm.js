import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



const LoginForm = () => {
      const navigate = useNavigate(); // For navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    if (localStorage.getItem('userId')) {
      navigate('/chat/default');
    }
  }, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await fetch('http://192.168.16.107:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    console.log("res", res);

    if(res.ok){
      const data = await res.json();
      console.log("data"  , data);
      const userData = data.userData;

      if(data.status === 200){
        console.log("User logged in successfully", userData);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userId', userData.userID);
        navigate('/chat/default');
      }
    }else{
      console.log("Error logging in");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>
          {/* {error && <p style={styles.error}>{error}</p>} */}
          <button type="submit" style={styles.submitButton}>Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '400px',
    textAlign: 'center',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    marginTop: '8px',
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '20px',
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default LoginForm;
