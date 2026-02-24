import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { loadConfig, saveConfig } from './config'
import defaultConfig from './config'
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

  const handleDatasetSelect = (datasetId, datasetName) => {
    const newConfig = { ...config, dataset: datasetId, datasetName }
    saveConfig(newConfig)
    setConfig(newConfig)
    setDatasetModalOpen(false)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const initializeDataset = async () => {
      if (!config.dataset) {
        try {
          const response = await axios.get('/api/v1/datasets')
          const datasets = response.data
          const defaultDataset = datasets.find(d => d.name === defaultConfig.datasetName)
          if (defaultDataset) {
            const newConfig = { ...config, dataset: defaultDataset.id, datasetName: defaultDataset.name }
            saveConfig(newConfig)
            setConfig(newConfig)
          } else {
            setDatasetModalOpen(true)
          }
        } catch (error) {
          console.error('Error fetching datasets:', error)
          setDatasetModalOpen(true)
        }
      }
    }
    initializeDataset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="w-full bg-base-100 p-4 flex justify-between items-center border-b">
        <div className="flex-1"></div>
        <h1 className="text-xl font-bold">Cognee Viewer{config.datasetName ? ` (${config.datasetName})` : ''}</h1>
        <div className="flex-1 flex justify-end gap-2">
          <button className="btn" onClick={() => setDatasetModalOpen(true)} title="Select Dataset">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 001.06.44l4.122.525a1.5 1.5 0 001.06-.44H18A2.25 2.25 0 0120.25 6v3.776M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
            </svg>
          </button>
          <button className={`btn ${!config.dataset ? 'btn-disabled' : ''}`} onClick={() => window.open(`http://localhost:8000/api/v1/visualize?dataset_id=${config.dataset}`, '_blank')} title="Visualize Graph">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </button>
          <button className="btn" onClick={() => setModalOpen(true)} title="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
