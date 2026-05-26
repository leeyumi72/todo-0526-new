import { useState } from 'react'

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('')

  const handleAdd = () => {
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }

  return (
    <div className="input-row">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="새 할 일 추가..."
        autoComplete="off"
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
      />
      <button onClick={handleAdd}>추가</button>
    </div>
  )
}
