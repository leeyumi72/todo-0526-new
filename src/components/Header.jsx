import { useMemo } from 'react'

export default function Header() {
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
      </div>
    </header>
  )
}
