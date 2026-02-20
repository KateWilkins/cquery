export default function MessageBox({ query, response }) {
  return (
    <div className="mb-4">
      <div className="chat chat-start">
        <div className="chat-header">You</div>
        <div className="chat-bubble chat-bubble-primary">{query}</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-header">Assistant</div>
        <div className="chat-bubble chat-bubble-secondary whitespace-pre-wrap">{response}</div>
      </div>
    </div>
  )
}