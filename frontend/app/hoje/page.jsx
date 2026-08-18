'use client';

import { useEffect, useState } from 'react';
import Dashboard from '../../components/Dashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''; // vazio = caminho relativo, via nginx
const USER_ID = 1; // MVP: usuário único, você mesmo

export default function TodaySessionPage() {
  const [session, setSession] = useState(null);
  const [progress, setProgress] = useState({ current_streak: 0, xp: 0 });
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/sessions/today?userId=${USER_ID}`).then((r) => r.json()),
      fetch(`${API_URL}/api/sessions/progress?userId=${USER_ID}`).then((r) => r.json()),
    ]).then(([s, p]) => {
      setSession(s);
      setProgress(p || {});
      setLoading(false);
    });
  }, []);

  async function handleComplete() {
    setCompleting(true);
    const res = await fetch(`${API_URL}/api/sessions/${session.id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solutionCode: solution }),
    });
    const data = await res.json();
    setResult(data);
    setCompleting(false);
  }

  if (loading) {
    return <Centered>Carregando sua sessão de hoje...</Centered>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Dashboard streak={progress.current_streak || 0} xp={progress.xp || 0} />

      <div className="carbon-card rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-neon-green">{session.title}</h1>
        <p className="text-carbon-700 whitespace-pre-line">{session.explanation}</p>

        <div className="bg-carbon-900 rounded-lg p-4 font-mono text-sm">
          <p className="text-neon-red mb-1">// Desafio de hoje</p>
          <p className="text-white whitespace-pre-line">{session.challenge}</p>
        </div>

        {session.status !== 'completed' && !result && (
          <>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Cole aqui sua solução (código, explicação, o que você fez)"
              className="w-full h-40 bg-carbon-900 border border-carbon-700 rounded-lg p-3 font-mono text-sm text-white"
            />
            <button
              onClick={handleComplete}
              disabled={completing || !solution.trim()}
              className="w-full py-3 rounded-lg bg-neon-green text-carbon-950 font-bold uppercase tracking-wider disabled:opacity-40"
            >
              {completing ? 'Subindo pro GitHub...' : 'Concluir desafio'}
            </button>
          </>
        )}

        {result && (
          <div className="bg-carbon-900 rounded-lg p-4 space-y-1">
            <p className="text-neon-green font-bold">Desafio concluído! 🔥</p>
            <p className="text-sm text-carbon-700">Streak: {result.streak} dias · +50 XP</p>
            <a href={result.repoUrl} target="_blank" className="text-sm underline text-white">
              Ver commit no GitHub →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

function Centered({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-carbon-700">
      {children}
    </div>
  );
}
