import { useEffect, useState } from 'react'
import './todolist.css'

const TODO_STORAGE_KEY = 'react-test-todos'

const initialTodos = [
//   { id: 1, text: 'UI 시안 정리하기', completed: false },
//   { id: 2, text: 'React 컴포넌트 구조 나누기', completed: true },
//   { id: 3, text: '오늘 작업 내용 커밋 준비', completed: false },
]

function getStoredTodos() {
  const savedTodos = localStorage.getItem(TODO_STORAGE_KEY)

  if (!savedTodos) {
    return initialTodos
  }

  try {
    const parsedTodos = JSON.parse(savedTodos)
    return Array.isArray(parsedTodos) ? parsedTodos : initialTodos
  } catch {
    return initialTodos
  }
}

function TodoList() {
  const [todos, setTodos] = useState(getStoredTodos)
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextValue = inputValue.trim()
    if (!nextValue) {
      return
    }

    setTodos((currentTodos) => [
      {
        id: Date.now(),
        text: nextValue,
        completed: false,
      },
       ...currentTodos,
    ])
    setInputValue('')
  }

  const toggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <main className="todo-page">
      <section className="todo-shell">
        <header className="todo-hero">
          <div>
            <p className="todo-eyebrow">Daily Planner</p>
            <h1>Todo List</h1>
            <p className="todo-copy">
              오늘 해야 할 일을 빠르게 적고, 카드 형태로 관리하세요.
            </p>
          </div>
          <a className="todo-home-link" href="#">
            홈으로 돌아가기
          </a>
        </header>

        <section className="todo-summary" aria-label="할 일 요약">
          <div>
            <strong>{todos.length}</strong>
            <span>전체 할 일</span>
          </div>
          <div>
            <strong>{completedCount}</strong>
            <span>완료된 항목</span>
          </div>
          <div>
            <strong>{todos.length - completedCount}</strong>
            <span>남은 작업</span>
          </div>
        </section>

        <form className="todo-form" onSubmit={handleSubmit}>
          <label className="todo-input-wrap" htmlFor="todo-input">
            <span className="sr-only">할 일 입력</span>
            <input
              id="todo-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="새 할 일을 입력하세요"
            />
          </label>
          <button type="submit">추가</button>
        </form>

        <section className="todo-list-section" aria-label="할 일 목록">
          {todos.length > 0 ? (
            <div className="todo-grid">
              {todos.map((todo) => (
                <article
                  className={`todo-card${todo.completed ? ' is-complete' : ''}`}
                  key={todo.id}
                >
                  <div className="todo-card-main">
                    <label className="todo-check">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                      />
                      <span>완료</span>
                    </label>
                    <p>{todo.text}</p>
                  </div>
                  <button
                    aria-label={`${todo.text} 삭제`}
                    className="todo-delete"
                    onClick={() => deleteTodo(todo.id)}
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                      viewBox="0 0 24 24"
                      width="20"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4.8c0-.44.36-.8.8-.8h6.4c.44 0 .8.36.8.8V6" />
                      <path d="M18 6l-1 13.2c-.03.46-.42.8-.88.8H7.88c-.46 0-.85-.34-.88-.8L6 6" />
                      <path d="M10 10.5v5.5" />
                      <path d="M14 10.5v5.5" />
                    </svg>
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="todo-empty">
              <p>아직 등록된 할 일이 없습니다. 첫 번째 카드를 추가해 보세요.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default TodoList