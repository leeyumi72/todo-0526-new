const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '미완료' },
  { key: 'done', label: '완료' },
]

export default function FilterBar({ filter, onFilter }) {
  return (
    <div className="filter-bar">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          className={filter === key ? 'active' : ''}
          onClick={() => onFilter(key)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
