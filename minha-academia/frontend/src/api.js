// Camada de comunicação com a API em C#.
// Em desenvolvimento, o caminho relativo /api é redirecionado pelo Vite
// para http://localhost:5000 (veja vite.config.js).
const BASE = import.meta.env.VITE_API_URL ?? ''

async function req(path, options) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok && res.status !== 204) {
    throw new Error('Erro na API: ' + res.status)
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  getWorkouts: () => req('/api/workouts'),
  toggleWorkout: (date) =>
    req('/api/workouts/toggle', { method: 'POST', body: JSON.stringify({ date }) }),
  getSettings: () => req('/api/settings'),
  saveSettings: (s) => req('/api/settings', { method: 'PUT', body: JSON.stringify(s) }),
}
