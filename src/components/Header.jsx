import { useMemo } from 'react'

export default function Header({ settingsOpen, onToggleSettings }) {
  const dateStr = useMemo(() =>
    new Date().toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
    }),
  [])

  return (
    <header>
      <div className="header-row">
        <div>
          <h1>Todo</h1>
          <p>{dateStr}</p>
        </div>
        <button
          className={`settings-btn${settingsOpen ? ' active' : ''}`}
          onClick={onToggleSettings}
          title="Claude API 키 설정"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13.2 6.4c.1.5.1 1 0 1.5l1.2.9a.5.5 0 0 1 .1.6l-1.2 2a.5.5 0 0 1-.6.2l-1.4-.6c-.4.3-.8.5-1.2.6l-.2 1.5a.5.5 0 0 1-.5.4H7.4a.5.5 0 0 1-.5-.4l-.2-1.5c-.4-.1-.8-.4-1.2-.6l-1.4.6a.5.5 0 0 1-.6-.2l-1.2-2a.5.5 0 0 1 .1-.6l1.2-.9c-.1-.5-.1-1 0-1.5L2.4 5.5a.5.5 0 0 1-.1-.6l1.2-2a.5.5 0 0 1 .6-.2l1.4.6c.4-.3.8-.5 1.2-.6l.2-1.5A.5.5 0 0 1 7.4 1h1.2a.5.5 0 0 1 .5.4l.2 1.5c.4.1.8.4 1.2.6l1.4-.6a.5.5 0 0 1 .6.2l1.2 2a.5.5 0 0 1-.1.6l-1.4.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
