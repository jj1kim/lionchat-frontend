import { useEffect, useState } from 'react';
import { chats } from '../apis/api.js';

export default function History() {
  const [logs, setLogs] = useState(null);
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    chats.list().then((r) => setLogs(r.data));
  }, []);

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (logs === null) return <div className="card">불러오는 중...</div>;

  return (
    <div className="card">
      <h2>📜 이전 대화</h2>
      {logs.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>
          아직 대화 기록이 없어요. 선배 사자에게 첫 질문을 던져볼까요?
        </p>
      ) : (
        <ul className="history-list">
          {logs.map((log) => {
            const isExpanded = expanded.has(log.id);
            return (
              <li key={log.id} onClick={() => toggle(log.id)}>
                <p className="h-prompt">🙋 {log.prompt}</p>
                <p className={`h-response${isExpanded ? '' : ' collapsed'}`}>
                  🦁 {log.response}
                </p>
                <div className="h-meta">
                  <span className="h-time">{new Date(log.created_at).toLocaleString('ko-KR')}</span>
                  <button type="button" className="h-toggle" onClick={(e) => { e.stopPropagation(); toggle(log.id); }}>
                    {isExpanded ? '접기 ▲' : '전체 보기 ▼'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
