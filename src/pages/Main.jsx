import { useState } from 'react';
import { chats } from '../apis/api.js';

export default function Main() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const send = async (e) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || loading) return;
    setErr('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setPrompt('');
    setLoading(true);
    try {
      const { data } = await chats.send(text);
      setMessages((m) => [...m, { role: 'bot', text: data.response }]);
    } catch (e) {
      setErr(e.response?.data?.detail || '응답을 받지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>선배 사자에게 물어보기</h2>
      <div className="chat-window">
        {messages.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            궁금한 걸 물어보세요. 코딩·동아리 활동·발표 준비 등 어떤 주제든
            선배 사자가 친절히 답해줍니다.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>{m.text}</div>
        ))}
        {loading && (
          <div className="bubble bot thinking">선배 사자가 생각 중...</div>
        )}
      </div>
      {err && <p className="error">{err}</p>}
      <form className="chat-input" onSubmit={send}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="질문을 입력하세요"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(e);
            }
          }}
        />
        <button type="submit" className="primary" disabled={loading}>
          전송
        </button>
      </form>
    </div>
  );
}
