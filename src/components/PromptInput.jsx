import { useState, useRef, useEffect } from 'react'

export default function PromptInput({ onSubmit, loading }) {
  const [prompt, setPrompt] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      onSubmit(prompt.trim())
      setPrompt('')
    }
  }

  useEffect(() => {
    if (!loading) {
      textareaRef.current?.focus()
    }
  }, [loading])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-base-100 border-t flex relative">
      <div className="flex-1 mr-2">
        <textarea
          ref={textareaRef}
          className="textarea textarea-bordered w-full h-20 resize-none"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Send
      </button>
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-box">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
    </form>
  )
}