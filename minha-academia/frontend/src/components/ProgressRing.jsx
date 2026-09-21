export default function ProgressRing({ pct }) {
  const r = 62
  const C = 2 * Math.PI * r
  return (
    <div className="ring">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF5A36" />
            <stop offset="1" stopColor="#FFB020" />
          </linearGradient>
        </defs>
        <circle className="track" cx="75" cy="75" r={r} />
        <circle
          className="fill"
          cx="75" cy="75" r={r}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct / 100)}
        />
      </svg>
      <div className="center">
        <div className="pct">{pct}<span>%</span></div>
        <div className="cap">da semana</div>
      </div>
    </div>
  )
}
