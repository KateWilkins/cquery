const defaultConfig = {
  serverUrl: 'http:/localhost:8000',
  dataset: 'c8378529-df8d-56df-8439-a3c84912ac2a',
  systemPrompt: '',
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