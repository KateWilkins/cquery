import { useState } from 'react'

export default function PromptInput({ onSubmit, loading }) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      onSubmit(prompt.trim())
      setPrompt('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button type="submit" className={`btn btn-primary mt-2 ${loading ? 'loading' : ''}`} disabled={loading}>Send</button>
    </form>
  )
}