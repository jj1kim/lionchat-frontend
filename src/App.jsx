import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Main from './pages/Main.jsx';
import History from './pages/History.jsx';

function isAuthed() {
  return Boolean(localStorage.getItem('access'));
}

function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function NavBar() {
  const nav = useNavigate();
  const authed = isAuthed();
  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    nav('/login');
  };
  return (
    <header className="nav">
      <Link to="/" className="brand">🦁 LionChat</Link>
      <nav>
        {authed ? (
          <>
            <Link to="/history">이전 대화</Link>
            <button onClick={logout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<PrivateRoute><Main /></PrivateRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}
