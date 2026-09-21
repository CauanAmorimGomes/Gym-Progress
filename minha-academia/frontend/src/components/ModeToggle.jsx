const HINTS = {
  treino: 'Modo ativo: tocar num dia registra ou remove um treino.',
  inicio: 'Modo ativo: tocar num dia define o início do período (toque de novo pra remover).',
  fim: 'Modo ativo: tocar num dia define o fim do período (toque de novo pra remover).',
}

const CHIPS = [
  ['treino', 'Marcar treino'],
  ['inicio', 'Marcar início'],
  ['fim', 'Marcar fim'],
]

export default function ModeToggle({ mode, onMode }) {
  return (
    <>
      <div className="modes">
        {CHIPS.map(([m, label]) => (
          <button
            key={m}
            className={'chip' + (mode === m ? ' active' : '')}
            data-mode={m}
            onClick={() => onMode(m)}
          >
            <span className="sw"></span>{label}
          </button>
        ))}
      </div>
      <p className="hint">{HINTS[mode]}</p>
    </>
  )
}
