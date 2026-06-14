import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import LandingPage from './LandingPage.tsx';
import './index.css';

function Root() {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return <App isDemo onExitDemo={() => setShowDemo(false)} />;
  }
  return <LandingPage onLaunchDemo={() => setShowDemo(true)} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
    <Analytics />
  </StrictMode>,
);
