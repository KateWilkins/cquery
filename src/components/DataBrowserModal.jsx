import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function DataBrowserModal({ datasetId, onClose }) {
  const [dataItems, setDataItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [content, setContent] = useState('')
  const [contentLoading, setContentLoading] = useState(false)

  useEffect(() => {
    const fetchDataItems = async () => {
      try {
        const response = await axios.get(`/api/v1/datasets/${datasetId}/data`)
        // Sort by updatedAt descending
        const sortedItems = response.data.sort((a, b) =>
          new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
        )
        setDataItems(sortedItems)
      } catch (err) {
        console.error('Error fetching data items:', err)
        setError('Failed to load data items')
      } finally {
        setLoading(false)
      }
    }

    if (datasetId) {
      fetchDataItems()
    }
  }, [datasetId])

  const handleItemSelect = async (item) => {
    setSelectedItem(item)
    setContentLoading(true)
    try {
      const response = await axios.get(`/api/v1/datasets/${datasetId}/data/${item.id}/raw`)
      setContent(response.data.content || response.data)
    } catch (err) {
      console.error('Error fetching content:', err)
      setContent('Failed to load content')
    } finally {
      setContentLoading(false)
    }
  }

  const handleBack = useCallback(() => {
    setSelectedItem(null)
    setContent('')
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedItem) {
          handleBack()
        } else {
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedItem, onClose, handleBack])

  const renderContent = () => {
    if (!selectedItem) return null

    // For now, only handle text/plain with markdown
    if (selectedItem.mimeType === 'text/plain') {
      return (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )
    }

    // Placeholder for other types
    return (
      <pre className="whitespace-pre-wrap text-sm">{content}</pre>
    )
  }

  return (
    <div className="modal modal-open" onClick={(e) => {
      if (e.target === e.currentTarget) {
        if (selectedItem) {
          handleBack()
        } else {
          onClose()
        }
      }
    }}>
      <div className="modal-box max-w-6xl max-h-[90vh]">
        <h3 className="font-bold text-lg mb-4">
          {selectedItem ? `Data Item: ${selectedItem.name}` : 'Browse Data'}
        </h3>

        {selectedItem ? (
          // Content view
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <span>ID: {selectedItem.id}</span>
              <span>Type: {selectedItem.extension} ({selectedItem.mimeType})</span>
              <span>Created: {new Date(selectedItem.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(selectedItem.updatedAt).toLocaleString()}</span>
            </div>

            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-base-100">
              {contentLoading ? (
                <div className="flex justify-center items-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                  <span className="ml-2">Loading content...</span>
                </div>
              ) : (
                renderContent()
              )}
            </div>


          </div>
        ) : (
          // List view
          <>
            {loading && (
              <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
                <span className="ml-2">Loading data items...</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && (
              <div className="overflow-x-auto max-h-96">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Created</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataItems.map((item) => (
                      <tr key={item.id}>
                        <td className="font-medium">{item.name || item.label || 'N/A'}</td>
                        <td className="font-mono text-xs">{item.id}</td>
                        <td>{item.extension} ({item.mimeType})</td>
                        <td className="text-xs">{new Date(item.createdAt).toLocaleString()}</td>
                        <td className="text-xs">{new Date(item.updatedAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleItemSelect(item)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {dataItems.length === 0 && (
                  <div className="text-center py-8 text-base-content/60">
                    No data items available
                  </div>
                )}
              </div>
            )}


          </>
        )}
      </div>
    </div>
  )
}