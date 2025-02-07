import  React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {


  const navigate = useNavigate(); 

    useEffect(() => {
      if (localStorage.getItem('userId')) {
        navigate('/chat/default');
      }
    }, [navigate]);

  const handleRegister = () => {
    navigate('/register'); // Navigate to the Register page
  };

  const handleLogin = () => {
    navigate('/login'); // Navigate to the Login page
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.navbar}>
          <h1 style={styles.logo}>MyApp</h1>
          <nav>
            <ul style={styles.navLinks}>
              <li style={styles.navLink}>Home</li>
              <li style={styles.navLink}>About</li>
              <li style={styles.navLink}>Contact</li>
            </ul>
          </nav>
        </div>
      </header>

      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h2 style={styles.heroTitle}>Your Productivity Hub</h2>
          <p style={styles.heroSubtitle}>Manage tasks, stay organized, and boost your productivity.</p>
          <div style={styles.ctaContainer}>
            <button onClick={handleRegister} style={styles.ctaButton}>Get Started</button>
            <button onClick={handleLogin} style={styles.ctaButton}>Login</button>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 MyApp, All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    backgroundColor: '#f0f4f8',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    backgroundColor: '#2d4a71',
    padding: '15px 40px',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  logo: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  navLinks: {
    listStyleType: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
    gap: '20px',
  },
  navLink: {
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  heroSection: {
    backgroundColor: '#007bff',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '0 20px',
    textAlign: 'center',
    marginTop: '80px', // to avoid navbar overlap
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '20px',
    maxWidth: '700px',
    wordWrap: 'break-word',
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '40px',
    fontWeight: '300',
    maxWidth: '600px',
    wordWrap: 'break-word',
  },
  ctaContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  ctaButton: {
    padding: '15px 30px',
    backgroundColor: '#fff',
    color: '#007bff',
    fontSize: '16px',
    border: '2px solid #007bff',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s, color 0.3s',
  },
  ctaButtonHover: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  footer: {
    backgroundColor: '#2d4a71',
    color: '#fff',
    width: '100%',
    padding: '20px 40px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
  },
};

export default LandingPage;
