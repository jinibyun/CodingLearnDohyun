import { useEffect, useRef, useState } from 'react'
import './NameInputForm.css'

function NameInputForm() {
  const inputRef = useRef(null)
  const [name, setName] = useState('')
  const [savedName, setSavedName] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])  // first load only

  const handleSave = () => {
    setSavedName(name.trim())
  }

  const handleResetAndFocus = () => {
    setName('')
    setSavedName('')
    inputRef.current?.focus()
  }

  return (
    <section className="name-ref-section">
      <h2>useRef 입력 연습</h2>
      <p className="name-ref-help">컴포넌트가 열리면 자동으로 입력창에 포커스됩니다.</p>

      <div className="name-ref-controls">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름을 입력하세요"
        />
        <button type="button" onClick={handleSave}>
          이름 저장
        </button>
        <button type="button" onClick={handleResetAndFocus}>
          초기화하고 다시 입력
        </button>
      </div>

      {savedName ? (
        <p className="name-ref-result">
          저장된 이름: <strong>{savedName}</strong>
        </p>
      ) : null}
    </section>
  )
}

export default NameInputForm