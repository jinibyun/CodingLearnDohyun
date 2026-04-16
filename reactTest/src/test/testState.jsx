import { useState } from 'react'

function TestState() {
  const [count, setCount] = useState(100)
  const [text, setText] = useState('')

  const textLength = text.length
  const isEmpty = textLength === 0
  const isWarning = textLength >= 41

  const submitButtonStyle = {
    border: 'none',
    borderRadius: '999px',
    padding: '10px 16px',
    fontWeight: 700,
    cursor: isEmpty ? 'not-allowed' : 'pointer',
    backgroundColor: isEmpty ? '#9ca3af' : '#1d9bf0',
    color: '#ffffff',
  }

  return (
    <section
      style={{
        maxWidth: '420px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        textAlign: 'center',
      }}
    >
      <h3 style={{ margin: '0 0 12px' }}>Simple Counter</h3>
      <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 16px' }}>{count}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button className="counter" onClick={() => setCount((prev) => prev - 1)}>
          -
        </button>
        <button className="counter" onClick={() => setCount((prev) => prev + 1)}>
          +
        </button>
      </div>

      <div style={{ marginTop: '22px', textAlign: 'left' }}>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={50}
          placeholder="지금 무슨 일이 일어나고 있나요?"
          style={{
            width: '100%',
            minHeight: '110px',
            borderRadius: '12px',
            border: '1px solid #d1d5db',
            padding: '12px',
            resize: 'vertical',
            boxSizing: 'border-box',
            fontSize: '15px',
          }}
        />

        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: isWarning ? '#ef4444' : '#6b7280', fontWeight: 600 }}>
            {textLength}/50
          </span>
          <button type="button" disabled={isEmpty} style={submitButtonStyle}>
            등록
          </button>
        </div>
      </div>
    </section>
  )
}

export default TestState
