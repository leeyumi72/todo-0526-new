import { useState, useCallback } from 'react'
import Header from './components/Header'
import ApiKeyPanel from './components/ApiKeyPanel'
import ProgressSection from './components/ProgressSection'
import TodoInput from './components/TodoInput'
import FilterBar from './components/FilterBar'
import TodoList from './components/TodoList'
import { classifyTodo } from './api/classify'

const STORAGE_KEY = 'todo-app-items'

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export default function App() {
  const [todos, setTodos] = useState(() =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  )
  const [filter, setFilter] = useState('all')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [apiKey, setApiKey] = useState(() =>
    localStorage.getItem('anthropic-api-key') || import.meta.env.VITE_ANTHROPIC_API_KEY || ''
  )

  const updateTodos = useCallback((updater) => {
    setTodos(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveTodos(next)
      return next
    })
  }, [])

  const addTodo = useCallback((text) => {
    text = text.trim()
    if (!text) return
    const todo = {
      id: Date.now(), text, done: false,
      category: null, priority: null, tags: [], classifying: false,
    }

    if (apiKey) {
      updateTodos(prev => [{ ...todo, classifying: true }, ...prev])
      classifyTodo(text, apiKey).then(result => {
        updateTodos(prev => prev.map(t =>
          t.id === todo.id
            ? {
                ...t,
                classifying: false,
                category: result?.category || null,
                priority: result?.priority || null,
                tags: Array.isArray(result?.tags) ? result.tags.slice(0, 2) : [],
              }
            : t
        ))
      })
    } else {
      updateTodos(prev => [todo, ...prev])
    }
  }, [apiKey, updateTodos])

  const toggleTodo = useCallback((id) => {
    updateTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [updateTodos])

  const deleteTodo = useCallback((id) => {
    updateTodos(prev => prev.filter(t => t.id !== id))
  }, [updateTodos])

  const editTodo = useCallback((id, text) => {
    text = text.trim()
    if (!text) {
      deleteTodo(id)
      return
    }
    updateTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t))
  }, [updateTodos, deleteTodo])

  const clearDone = useCallback(() => {
    if (confirm('완료된 항목을 모두 삭제할까요?')) {
      updateTodos(prev => prev.filter(t => !t.done))
    }
  }, [updateTodos])

  const saveApiKey = useCallback((key) => {
    key = key.trim()
    if (key) {
      localStorage.setItem('anthropic-api-key', key)
    } else {
      localStorage.removeItem('anthropic-api-key')
    }
    setApiKey(key)
    setSettingsOpen(false)
  }, [])

  const visible = todos.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  const doneCount = todos.filter(t => t.done).length
  const activeCount = todos.filter(t => !t.done).length
  const pct = todos.length === 0 ? 0 : Math.round((doneCount / todos.length) * 100)

  return (
    <div className="app">
      <Header
        settingsOpen={settingsOpen}
        onToggleSettings={() => setSettingsOpen(o => !o)}
      />
      <ApiKeyPanel open={settingsOpen} apiKey={apiKey} onSave={saveApiKey} />
      <ProgressSection pct={pct} />
      <TodoInput onAdd={addTodo} />
      <FilterBar filter={filter} onFilter={setFilter} />
      <TodoList
        todos={visible}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
        filter={filter}
      />
      <footer className="footer">
        <span>{`미완료 ${activeCount}개${doneCount ? ` · 완료 ${doneCount}개` : ''}`}</span>
        {doneCount > 0 && (
          <button onClick={clearDone}>완료 항목 삭제</button>
        )}
      </footer>
    </div>
  )
}
