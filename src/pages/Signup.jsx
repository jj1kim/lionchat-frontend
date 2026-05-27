import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../apis/api.js';

export default function Signup() {
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await auth.signup(form);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.detail || '회원가입 실패');
    }
  };

  return (
    <div className="card auth-card">
      <div className="auth-icon">🦁💬</div>
      <h2>LionChat 시작하기</h2>
      <p className="auth-intro">멋사 선배 사자가 동아리·개발·진로 질문에 답해드릴게요.</p>
      <form onSubmit={submit}>
        <label>이메일
          <input type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="lionchat@snulion.com" />
        </label>
        <label>이름
          <input required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="동아리원 이름" />
        </label>
        <label>비밀번호 (6자 이상)
          <input type="password" required minLength={6} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {err && <p className="error">{err}</p>}
        <button type="submit" className="primary">가입하기</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}
