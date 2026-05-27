import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../apis/api.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await auth.login(form);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.detail || '로그인 실패');
    }
  };

  return (
    <div className="card auth-card">
      <div className="auth-icon">🦁💬</div>
      <h2>LionChat 로그인</h2>
      <p className="auth-intro">선배 사자가 멋사 후배의 질문에 답해드려요.</p>
      <form onSubmit={submit}>
        <label>이메일
          <input type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="lionchat@snulion.com" />
        </label>
        <label>비밀번호
          <input type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {err && <p className="error">{err}</p>}
        <button type="submit" className="primary">로그인</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        아직 계정이 없나요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}
