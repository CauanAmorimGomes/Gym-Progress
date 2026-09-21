export default function GoalControl({ goal, onChange }) {
  return (
    <div className="goal">
      <button className="step" onClick={() => onChange(Math.max(1, goal - 1))} aria-label="Diminuir meta">−</button>
      <div style={{ textAlign: 'center' }}>
        <div className="val">{goal}</div>
        <div className="lbl">treinos por semana</div>
      </div>
      <button className="step" onClick={() => onChange(Math.min(7, goal + 1))} aria-label="Aumentar meta">+</button>
    </div>
  )
}
