import { useState, useRef, useEffect } from 'react';
import { chats } from '../apis/api.js';

const TOPICS = ['코딩·웹 개발', '동아리 활동', '세미나·발표', '진로·취업', '학교 생활'];

const SAMPLE_QUESTIONS = [
  'React 컴포넌트 분리는 어떤 기준으로 해야 하나요?',
  'Django REST Framework로 인증은 어떻게 구현하나요?',
  '동아리 발표 자료는 어떻게 준비하면 좋을까요?',
  '개발자 인턴 지원할 때 포트폴리오는 뭘 보여줘야 해요?',
];

export default function Main() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const windowRef = useRef(null);

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.scrollTop = windowRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (textOverride) => {
    const text = (textOverride ?? prompt).trim();
    if (!text || loading) return;
    setErr('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setPrompt('');
    setLoading(true);
    try {
      const { data } = await chats.send(text);
      setMessages((m) => [...m, { role: 'bot', text: data.response }]);
    } catch (e) {
      setErr(e.response?.data?.detail || '응답을 받지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => { e.preventDefault(); send(); };

  return (
    <>
      <div className="card hero">
        <div className="hero-emoji">🦁💬</div>
        <h2>선배 사자에게 물어보기</h2>
        <p>멋사 동아리 후배들의 코딩·진로·동아리 활동 관련 질문에 따뜻하게 답해드려요.</p>
        <div className="topic-tags">
          {TOPICS.map((t) => <span key={t} className="topic-tag">#{t}</span>)}
        </div>
      </div>

      <div className="card">
        <div className="chat-window" ref={windowRef}>
          {messages.length === 0 && (
            <div className="empty-state">
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>이런 질문이 잘 어울려요</strong> 🦁
              </p>
              {SAMPLE_QUESTIONS.map((q) => (
                <div key={q} style={{ margin: '0.4rem 0' }}>
                  <button
                    type="button"
                    onClick={() => send(q)}
                    style={{
                      background: 'transparent',
                      border: '1px dashed var(--primary-light)',
                      color: 'var(--secondary)',
                      padding: '0.5rem 0.9rem',
                      borderRadius: 16,
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {q}
                  </button>
                </div>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>{m.text}</div>
          ))}
          {loading && (
            <div className="bubble bot thinking">선배 사자가 생각 중...</div>
          )}
        </div>
        {err && <p className="error">{err}</p>}
        <form className="chat-input" onSubmit={onSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="질문을 입력하세요. (Enter로 보내기, Shift+Enter로 줄바꿈)"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button type="submit" className="primary" disabled={loading || !prompt.trim()}>
            보내기
          </button>
        </form>
      </div>
    </>
  );
}
