import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { loadConfig, saveConfig } from './config'
import MessageBox from './components/MessageBox'
import PromptInput from './components/PromptInput'
import SettingsModal from './components/SettingsModal'

function App() {
  const [config, setConfig] = useState(loadConfig())
  const [messages, setMessages] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const handleSubmit = async (prompt) => {
    setLoading(true)
    try {
      const apiUrl = '/api/v1/search'
      const payload = {
        searchType: 'GRAPH_COMPLETION',
        datasets: [],
        datasetIds: [config.dataset],
        query: prompt,
        systemPrompt: config.systemPrompt,
        nodeName: [],
        topK: 10,
        onlyContext: false,
        verbose: false,
      }
      console.log('Calling API:', apiUrl, payload)
      const res = await axios.post(apiUrl, payload)
      console.log('Response:', res.data)
      const response = res.data.length > 0 ? res.data[0].answer || JSON.stringify(res.data[0]) : 'No response'
      setMessages([...messages, { query: prompt, response }])
    } catch (error) {
      console.log('Error:', error)
      setMessages([...messages, { query: prompt, response: 'Error: ' + error.message }])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = (newConfig) => {
    saveConfig(newConfig)
    setConfig(newConfig)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-base-100 p-4 flex justify-between items-center z-10 border-b">
        <div className="flex-1"></div>
        <h1 className="text-xl font-bold">Cognee Viewer</h1>
        <div className="flex-1 flex justify-end">
          <button className="btn" onClick={() => setModalOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.1 2.016c.03.058.044.124.044.192a.125.125 0 01-.192.096l-1.1-2.016a.125.125 0 00-.154-.038l-1.217.456c-.355.133-.75.072-1.075-.124-.072-.044-.145-.087-.22-.127-.332-.184-.582-.496-.645-.87l-.213-1.281a.125.125 0 00-.11-.094h-2.593a.125.125 0 00-.11.094l-.213 1.281c-.063.374-.313.686-.645.87-.074.04-.147.083-.22.127-.325.196-.72.257-1.075.124l-1.217-.456a1.125 1.125 0 01-.49-1.37l.456-1.217a1.125 1.125 0 011.37-.49l1.216.456c.355.133.75.072 1.075-.124.072-.044.145-.087.22-.127.332-.184.582-.496.645-.87l.213-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 pt-24">
        {messages.map((msg, i) => (
          <MessageBox key={i} query={msg.query} response={msg.response} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-0 left-0 right-0">
        <PromptInput onSubmit={handleSubmit} loading={loading} />
      </div>
      {modalOpen && (
        <SettingsModal config={config} onSave={handleSaveConfig} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}

export default App
