export const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
export const WEEKDAYS = ["dom","seg","ter","qua","qui","sex","sáb"]

// Chave 'YYYY-MM-DD' a partir de um Date local (sem problemas de fuso).
export function key(d){
  const m = d.getMonth() + 1, day = d.getDate()
  return `${d.getFullYear()}-${m < 10 ? '0' : ''}${m}-${day < 10 ? '0' : ''}${day}`
}
export function parse(k){ const [y,m,d] = k.split('-').map(Number); return new Date(y, m-1, d) }
export function addDays(d,n){ const x = new Date(d); x.setDate(x.getDate()+n); return x }
export function sundayOf(d){ const x = new Date(d); x.setDate(x.getDate()-x.getDay()); x.setHours(0,0,0,0); return x }
export function fmtBR(k){ const [y,m,d] = k.split('-'); return `${d}/${m}/${y}` }
export function sameYMD(a,b){
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate()
}
