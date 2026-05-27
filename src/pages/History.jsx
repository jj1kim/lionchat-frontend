import { useEffect, useState } from 'react';
import { chats } from '../apis/api.js';

export default function History() {
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    chats.list().then((r) => setLogs(r.data));
  }, []);

  if (logs === null) return <div className="card">불러오는 중...</div>;

  return (
    <div className="card">
      <h2>이전 대화</h2>
      {logs.length === 0 ? (
        <p>아직 대화 기록이 없습니다.</p>
      ) : (
        <ul className="history-list">
          {logs.map((log) => (
            <li key={log.id}>
              <p className="prompt">{log.prompt}</p>
              <p className="response">{log.response.slice(0, 200)}{log.response.length > 200 ? '...' : ''}</p>
              <p className="time">{new Date(log.created_at).toLocaleString('ko-KR')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
