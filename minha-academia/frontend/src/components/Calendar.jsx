import { MONTHS, WEEKDAYS, key, parse, addDays, sameYMD, fmtBR, sundayOf } from '../utils/dates'

export default function Calendar({ view, setView, attended, start, end, onDay }) {
  const y = view.getFullYear()
  const m = view.getMonth()
  const first = new Date(y, m, 1)
  const gridStart = addDays(first, -first.getDay())
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const startD = start ? parse(start) : null
  const endD = end ? parse(end) : null

  const cells = []
  for (let i = 0; i < 42; i++) {
    const d = addDays(gridStart, i)
    const k = key(d)
    const inMonth = d.getMonth() === m
    const isAtt = !!attended[k]
    const isToday = sameYMD(d, today)

    let inRange = false
    if (startD && endD) {
      const lo = startD <= endD ? startD : endD
      const hi = startD <= endD ? endD : startD
      inRange = d >= lo && d <= hi
    }
    const isStart = startD && sameYMD(d, startD)
    const isEnd = endD && sameYMD(d, endD)

    const cls = ['cell']
    if (!inMonth) cls.push('out')
    if (isAtt) cls.push('att')
    if (isToday) cls.push('today')
    if (inRange) cls.push('inrange')
    if (isStart || isEnd) cls.push('edge')

    cells.push(
      <button key={k} className={cls.join(' ')} onClick={() => onDay(d, k)}>
        {(isStart || isEnd) && (
          <span className="tag">{isStart && isEnd ? 'in/fim' : isStart ? 'início' : 'fim'}</span>
        )}
        {d.getDate()}
      </button>
    )
  }

  // Legenda do período abaixo do calendário
  let note
  if (!start && !end) {
    note = <span style={{ color: 'var(--muted-2)' }}>Use os modos abaixo para marcar o início e o fim do seu período de treino.</span>
  } else {
    const parts = []
    if (start) parts.push(<span key="s">início <b>{fmtBR(start)}</b></span>)
    if (end) {
      if (parts.length) parts.push(<span key="sep"> — </span>)
      parts.push(<span key="e">fim <b>{fmtBR(end)}</b></span>)
    }
    let weeks = null
    if (start && end) {
      const s = sundayOf(parse(start)), e = sundayOf(parse(end))
      weeks = Math.round(Math.abs(e - s) / (7 * 86400000)) + 1
    }
    note = (
      <>Período: {parts}{weeks != null && <> · <b>{weeks}</b> semana{weeks > 1 ? 's' : ''}</>}</>
    )
  }

  return (
    <section className="cal">
      <div className="cal-head">
        <div className="month">{MONTHS[m]} {y}</div>
        <div className="nav">
          <button onClick={() => setView(new Date(y, m - 1, 1))} aria-label="Mês anterior">‹</button>
          <button className="today-btn" onClick={() => { const t = new Date(); setView(new Date(t.getFullYear(), t.getMonth(), 1)) }}>Hoje</button>
          <button onClick={() => setView(new Date(y, m + 1, 1))} aria-label="Próximo mês">›</button>
        </div>
      </div>
      <div className="grid">{WEEKDAYS.map((w) => <div key={w} className="wd">{w}</div>)}</div>
      <div className="grid" style={{ marginTop: 6 }}>{cells}</div>
      <div className="range-note">{note}</div>
    </section>
  )
}
