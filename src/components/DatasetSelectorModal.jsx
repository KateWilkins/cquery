import { useState, useEffect } from 'react'
import axios from 'axios'

export default function DatasetSelectorModal({ currentDatasetId, onSelect, onClose }) {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await axios.get('/api/v1/datasets')
        // Sort by updatedAt descending (most recent first)
        const sortedDatasets = response.data.sort((a, b) =>
          new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
        )
        setDatasets(sortedDatasets)
      } catch (err) {
        console.error('Error fetching datasets:', err)
        setError('Failed to load datasets')
      } finally {
        setLoading(false)
      }
    }

    fetchDatasets()
  }, [])

  const handleDatasetSelect = (datasetId) => {
    const selectedDataset = datasets.find(d => d.id === datasetId)
    onSelect(datasetId, selectedDataset?.name || null)
    onClose()
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl">
        <h3 className="font-bold text-lg mb-4">Select Dataset</h3>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-2">Loading datasets...</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {datasets.map((dataset) => (
                <div
                key={dataset.id}
                className={`card bg-base-100 border cursor-pointer transition-all hover:shadow-lg ${
                  dataset.id === currentDatasetId
                    ? 'border-primary bg-primary/10'
                    : 'border-base-300 hover:border-base-content/20'
                }`}
                onClick={() => handleDatasetSelect(dataset.id)}
              >
                <div className="card-body p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 001.06.44l4.122.525a1.5 1.5 0 001.06-.44H18A2.25 2.25 0 0120.25 6v3.776M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                    </svg>
                    <h4 className="card-title text-sm font-semibold truncate">{dataset.name}</h4>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-base-content/60">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                    <span className="text-xs font-mono text-base-content/70 truncate">{dataset.id}</span>
                  </div>

                  <div className="text-xs text-base-content/60 mb-1">
                    <div>Created: {dataset.createdAt ? new Date(dataset.createdAt).toISOString().replace(/\.\d{3}Z$/, 'Z') : 'N/A'}</div>
                    <div>Updated: {dataset.updatedAt ? new Date(dataset.updatedAt).toISOString().replace(/\.\d{3}Z$/, 'Z') : 'N/A'}</div>
                  </div>

                  {dataset.id === currentDatasetId && (
                    <div className="badge badge-primary badge-sm">Current</div>
                  )}
                </div>
              </div>
            ))}

            {datasets.length === 0 && (
              <div className="col-span-full text-center py-8 text-base-content/60">
                No datasets available
              </div>
            )}
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}