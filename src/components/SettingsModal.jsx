import { useState } from 'react'

export default function SettingsModal({ config, onSave, onClose }) {
  const [localConfig, setLocalConfig] = useState(config)

  const handleSave = () => {
    onSave(localConfig)
    onClose()
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Settings</h3>
        <div className="py-4">
          <label className="label">
            <span className="label-text">Server URL</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={localConfig.serverUrl}
            onChange={(e) => setLocalConfig({...localConfig, serverUrl: e.target.value})}
          />
          <label className="label">
            <span className="label-text">Dataset</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={localConfig.dataset}
            onChange={(e) => setLocalConfig({...localConfig, dataset: e.target.value})}
          />
          <label className="label">
            <span className="label-text">System Prompt</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={localConfig.systemPrompt}
            onChange={(e) => setLocalConfig({...localConfig, systemPrompt: e.target.value})}
          />
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}