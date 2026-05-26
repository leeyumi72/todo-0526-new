import { useState, useEffect, useRef } from 'react'

const VALID_CATS = ['업무', '개인', '건강', '학습', '쇼핑', '기타']
const VALID_PRIS = ['높음', '보통', '낮음']

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    setEditing(false)
    onEdit(todo.id, editVal)
  }

  const safeCat = VALID_CATS.includes(todo.category) ? todo.category : null
  const safePri = VALID_PRIS.includes(todo.priority) ? todo.priority : null

  return (
    <div className={`todo-item${todo.done ? ' done' : ''}`}>
      <button className="check-btn" onClick={() => onToggle(todo.id)}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <polyline points="1.5,5.5 4,8.5 9.5,2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="todo-content">
        {editing ? (
          <input
            ref={inputRef}
            className="edit-input"
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') setEditing(false)
            }}
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={() => { setEditVal(todo.text); setEditing(true) }}
          >
            {todo.text}
          </span>
        )}

        {todo.classifying ? (
          <div className="classifying-row">
            <div className="spinner" />
            <span>AI 분류 중…</span>
          </div>
        ) : (safeCat || todo.tags?.length > 0) ? (
          <div className="todo-meta">
            {safeCat && <span className={`cat-badge cat-${safeCat}`}>{safeCat}</span>}
            {safePri && (
              <>
                <span className={`pri-dot pri-${safePri}`} title={safePri} />
                <span className="pri-label">{safePri}</span>
              </>
            )}
            {todo.tags?.map(tag => (
              <span key={tag} className="todo-tag">#{tag}</span>
            ))}
          </div>
        ) : null}
      </div>

      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <line x1="1" y1="1" x2="12" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="12" y1="1" x2="1" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
