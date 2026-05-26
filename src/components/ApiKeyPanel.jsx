import { useState } from 'react'

export default function ApiKeyPanel({ open, apiKey, onSave }) {
  const [inputVal, setInputVal] = useState('')

  const handleSave = () => {
    onSave(inputVal)
    setInputVal('')
  }

  return (
    <div className={`api-key-panel${open ? ' open' : ''}`}>
      <label>
        Claude API 키{' '}
        <span className={`api-key-status ${apiKey ? 'saved' : 'empty'}`}>
          {apiKey ? '설정됨 ✓' : '미설정'}
        </span>
      </label>
      <div className="api-key-row">
        <input
          type="password"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder={apiKey ? '••••••••••••••••••••' : 'sk-ant-api03-...'}
          autoComplete="off"
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <button onClick={handleSave}>저장</button>
      </div>
      <p className="api-key-hint">
        키는 브라우저 로컬스토리지에만 저장됩니다. 할 일 추가 시 자동으로 카테고리·우선순위를 분류합니다.
      </p>
    </div>
  )
}
