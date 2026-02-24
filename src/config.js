const defaultConfig = {
  serverUrl: 'http://localhost:8000',
  dataset: 'a82ca4c3-14a6-5069-ac65-9c2d7513b55b',
  datasetName: null,
  systemPrompt: 'You are a helpful assistant.',
};

const CONFIG_KEY = 'cogneeConfig';

export const loadConfig = () => {
  const stored = localStorage.getItem(CONFIG_KEY);
  return stored ? JSON.parse(stored) : defaultConfig;
};

export const saveConfig = (config) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export default defaultConfig;