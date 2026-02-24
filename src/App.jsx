import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { loadConfig, saveConfig } from './config'
import MessageBox from './components/MessageBox'
import PromptInput from './components/PromptInput'
import SettingsModal from './components/SettingsModal'
import DatasetSelectorModal from './components/DatasetSelectorModal'

function App() {
  const [config, setConfig] = useState(loadConfig())
  const [messages, setMessages] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [datasetModalOpen, setDatasetModalOpen] = useState(false)
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

  const handleDatasetSelect = (datasetId) => {
    const newConfig = { ...config, dataset: datasetId }
    saveConfig(newConfig)
    setConfig(newConfig)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="w-full bg-base-100 p-4 flex justify-between items-center border-b">
        <div className="flex-1"></div>
        <h1 className="text-xl font-bold">Cognee Viewer</h1>
        <div className="flex-1 flex justify-end gap-2">
          <button className="btn" onClick={() => setDatasetModalOpen(true)} title="Select Dataset">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 001.06.44l4.122.525a1.5 1.5 0 001.06-.44H18A2.25 2.25 0 0120.25 6v3.776M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
            </svg>
          </button>
          <button className="btn" onClick={() => setModalOpen(true)} title="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.1 2.016c.03.058.044.124.044.192a.125.125 0 01-.192.096l-1.1-2.016a.125.125 0 00-.154-.038l-1.217.456c-.355.133-.75.072-1.075-.124-.072-.044-.145-.087-.22-.127-.332-.184-.582-.496-.645-.87l-.213-1.281a.125.125 0 00-.11-.094h-2.593a.125.125 0 00-.11.094l-.213 1.281c-.063.374-.313.686-.645.87-.074.04-.147.083-.22.127-.325.196-.72.257-1.075.124l-1.217-.456a1.125 1.125 0 01-.49-1.37l.456-1.217a1.125 1.125 0 011.37-.49l1.216.456c.355.133.75.072 1.075-.124.072-.044.145-.087.22-.127.332-.184.582-.496.645-.87l.213-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <MessageBox key={i} query={msg.query} response={msg.response} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full">
        <PromptInput onSubmit={handleSubmit} loading={loading} />
      </div>
      {modalOpen && (
        <SettingsModal config={config} onSave={handleSaveConfig} onClose={() => setModalOpen(false)} />
      )}
      {datasetModalOpen && (
        <DatasetSelectorModal
          currentDatasetId={config.dataset}
          onSelect={handleDatasetSelect}
          onClose={() => setDatasetModalOpen(false)}
        />
      )}
    </div>
  )
}

export default App
