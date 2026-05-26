import TodoItem from './TodoItem'

const EMPTY_MSGS = {
  all: ['📋', '할 일을 추가해보세요!'],
  active: ['✅', '미완료 항목이 없어요.'],
  done: ['🎉', '완료된 항목이 없어요.'],
}

export default function TodoList({ todos, onToggle, onDelete, onEdit, filter }) {
  if (todos.length === 0) {
    const [icon, msg] = EMPTY_MSGS[filter]
    return (
      <div className="list">
        <div className="empty">
          <span>{icon}</span>
          {msg}
        </div>
      </div>
    )
  }

  return (
    <div className="list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
