'use client';

export default function Dashboard({ streak, xp, xpToNextLevel = 500 }) {
  const progressPct = Math.min(100, (xp % xpToNextLevel) / xpToNextLevel * 100);

  return (
    <div className="carbon-card rounded-xl p-6 flex items-center justify-between gap-6">
      <div>
        <p className="text-neon-green text-sm tracking-widest uppercase">Streak</p>
        <p className="text-4xl font-bold text-white">
          {streak} <span className="text-lg text-carbon-700">dias</span>
        </p>
      </div>

      <div className="flex-1">
        <p className="text-carbon-700 text-xs uppercase tracking-widest mb-1">XP</p>
        <div className="h-3 w-full bg-carbon-800 rounded-full overflow-hidden">
          <div
            className="tach-bar h-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-right text-xs text-carbon-700 mt-1">{xp} XP</p>
      </div>
    </div>
  );
}
