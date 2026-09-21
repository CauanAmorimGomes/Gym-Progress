import { useEffect, useState } from 'react'
import { api } from './api'
import { key, parse, addDays, sundayOf, MONTHS } from './utils/dates'
import ProgressRing from './components/ProgressRing'
import GoalControl from './components/GoalControl'
import Calendar from './components/Calendar'
import Stats from './components/Stats'
import ModeToggle from './components/ModeToggle'

export default function App() {
  const [goal, setGoal] = useState(4)
  const [attended, setAttended] = useState({})       // { 'YYYY-MM-DD': true }
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [mode, setMode] = useState('treino')
  const [view, setView] = useState(() => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), 1) })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carrega dados do back-end ao abrir
  useEffect(() => {
    (async () => {
      try {
        const [ws, s] = await Promise.all([api.getWorkouts(), api.getSettings()])
        const map = {}
        ws.forEach((w) => { map[w.date] = true })
        setAttended(map)
        setGoal(s.weeklyGoal ?? 4)
        setStart(s.periodStart ?? null)
        setEnd(s.periodEnd ?? null)
      } catch (e) {
        setError('Não foi possível falar com o servidor. Confira se o back-end está rodando em http://localhost:5000 e recarregue.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function saveSettings(next) {
    try { await api.saveSettings(next) } catch (e) { /* mantém o valor local mesmo se falhar */ }
  }

  async function onDay(d, k) {
    if (mode === 'treino') {
      // atualização otimista + persistência
      setAttended((prev) => {
        const n = { ...prev }
        if (n[k]) delete n[k]; else n[k] = true
        return n
      })
      try { await api.toggleWorkout(k) } catch (e) { setError('Falha ao salvar o treino. Verifique o back-end.') }
    } else if (mode === 'inicio') {
      const v = start === k ? null : k
      setStart(v)
      saveSettings({ weeklyGoal: goal, periodStart: v, periodEnd: end })
    } else if (mode === 'fim') {
      const v = end === k ? null : k
      setEnd(v)
      saveSettings({ weeklyGoal: goal, periodStart: start, periodEnd: v })
    }
  }

  function changeGoal(g) {
    setGoal(g)
    saveSettings({ weeklyGoal: g, periodStart: start, periodEnd: end })
  }

  // ---------- estatísticas (calculadas a partir dos dados) ----------
  const today = new Date(); today.setHours(0, 0, 0, 0)

  function weekCount(sunday) {
    let c = 0
    for (let i = 0; i < 7; i++) if (attended[key(addDays(sunday, i))]) c++
    return c
  }

  const wkSun = sundayOf(today)
  const weekDone = weekCount(wkSun)
  const pct = goal > 0 ? Math.min(100, Math.round((weekDone / goal) * 100)) : 0

  let monthCount = 0
  Object.keys(attended).forEach((k) => {
    if (attended[k]) {
      const d = parse(k)
      if (d.getFullYear() === view.getFullYear() && d.getMonth() === view.getMonth()) monthCount++
    }
  })

  const keys = Object.keys(attended).filter((k) => attended[k]).sort()
  let refStart = start ? parse(start) : keys.length ? parse(keys[0]) : today
  if (refStart > today) refStart = today
  let doneInRange = 0
  keys.forEach((k) => { const d = parse(k); if (d >= refStart && d <= today) doneInRange++ })
  const weeks = Math.round((sundayOf(today) - sundayOf(refStart)) / (7 * 86400000)) + 1
  const expected = goal * weeks
  const adherence = expected > 0 ? Math.round((doneInRange / expected) * 100) : 0

  let cursor = sundayOf(today)
  if (weekCount(cursor) < goal) cursor = addDays(cursor, -7)
  let streak = 0, guard = 0
  while (goal > 0 && weekCount(cursor) >= goal && guard < 520) { streak++; cursor = addDays(cursor, -7); guard++ }

  const weekDots = Array.from({ length: goal }, (_, i) => i < weekDone)
  let motivation
  if (weekDone === 0) motivation = 'Bora começar a semana! 🚀'
  else if (weekDone < goal) motivation = `Faltam ${goal - weekDone} treino${goal - weekDone > 1 ? 's' : ''} pra fechar a meta.`
  else if (weekDone === goal) motivation = 'Meta batida! Mandou bem. 🔥'
  else motivation = 'Acima da meta! Você é fera. 💪'

  const wkEnd = addDays(wkSun, 6)
  const weekLabel = `Semana de ${wkSun.getDate()}/${wkSun.getMonth() + 1} a ${wkEnd.getDate()}/${wkEnd.getMonth() + 1}`

  if (loading) {
    return <div className="wrap"><p style={{ color: 'var(--muted)', marginTop: 40 }}>Carregando…</p></div>
  }

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <div className="mark">💪</div>
          <div>
            <h1>Minha Academia</h1>
            <p>Toque nos dias que você treinou e acompanhe sua meta.</p>
          </div>
        </div>
        <GoalControl goal={goal} onChange={changeGoal} />
      </header>

      {error && <div className="banner">{error}</div>}

      <section className="hero">
        <ProgressRing pct={pct} />
        <div className="hero-side">
          <p className="wk">{weekLabel}</p>
          <div className="count"><b>{weekDone}</b> de {goal} treinos</div>
          <p className="msg">{motivation}</p>
          <div className="dots">
            {weekDots.map((on, i) => <div key={i} className={'dot' + (on ? ' on' : '')} />)}
          </div>
        </div>
      </section>

      <Stats
        monthCount={monthCount}
        monthName={MONTHS[view.getMonth()].toLowerCase()}
        adherence={adherence}
        streak={streak}
      />

      <Calendar
        view={view}
        setView={setView}
        attended={attended}
        start={start}
        end={end}
        onDay={onDay}
      />

      <ModeToggle mode={mode} onMode={setMode} />

      <footer>
        <p>Dados salvos no servidor (banco SQL).</p>
      </footer>
    </div>
  )
}
