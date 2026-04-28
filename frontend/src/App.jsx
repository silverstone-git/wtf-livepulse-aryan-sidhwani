import React, { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import useStore from './store/useStore';

function App() {
  const highContrast = useStore((state) => state.settings.highContrast);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return (
    <div className="w-full min-h-screen">
      <Dashboard />
    </div>
  );
}

export default App;
