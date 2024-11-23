import Login from './components/Login';
import Content from './components/Content';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (tokenExpiration && new Date(tokenExpiration) < new Date()) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      return false;
    }
    return !!token;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/protected"
          element={
            isAuthenticated() ? <Content /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
