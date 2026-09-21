export default function Stats({ monthCount, monthName, adherence, streak }) {
  return (
    <section className="stats">
      <div className="stat">
        <div className="n">{monthCount}</div>
        <div className="k">dias em {monthName}</div>
      </div>
      <div className="stat cool">
        <div className="n">{adherence}%</div>
        <div className="k">aderência total</div>
      </div>
      <div className="stat">
        <div className="n">{streak}</div>
        <div className="k">semanas na meta</div>
      </div>
    </section>
  )
}
