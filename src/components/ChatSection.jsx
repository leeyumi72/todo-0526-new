import { useState, useRef, useEffect } from 'react'

export default function ChatSection() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg = { role: 'user', content: text }
    const history = [...messages.filter(m => !m.streaming), userMsg]

    setMessages([...history, { role: 'assistant', content: '', streaming: true }])
    setInput('')
    setStreaming(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!res.ok) {
        throw new Error(`서버 오류 (${res.status})`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (!data) continue
          try {
            const event = JSON.parse(data)
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              fullText += event.delta.text
              setMessages(prev => prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: fullText } : m
              ))
            }
          } catch {}
        }
      }

      setMessages(prev => prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, streaming: false } : m
      ))
    } catch (err) {
      setMessages(prev => prev.map((m, i) =>
        i === prev.length - 1
          ? { ...m, content: `오류: ${err.message}`, streaming: false, error: true }
          : m
      ))
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="chat-section">
      <div className="chat-header">
        <span className="chat-title">AI 채팅</span>
        {messages.length > 0 && (
          <button className="chat-clear-btn" onClick={() => setMessages([])}>
            지우기
          </button>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">무엇이든 물어보세요</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className={`chat-bubble${msg.error ? ' error' : ''}`}>
                {msg.content}
                {msg.streaming && <span className="chat-cursor" />}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="메시지를 입력하세요..."
          disabled={streaming}
          autoComplete="off"
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={!input.trim() || streaming}
        >
          {streaming ? (
            <div className="spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L14 2L8 14L7 9L2 8Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
