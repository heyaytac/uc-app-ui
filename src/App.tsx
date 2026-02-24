import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BannerProvider } from './context/BannerContext';
import { LandingPage } from './pages/LandingPage';
import { BuilderPage } from './pages/BuilderPage';

function App() {
  return (
    <BrowserRouter>
      <BannerProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/builder" element={<BuilderPage />} />
        </Routes>
      </BannerProvider>
    </BrowserRouter>
  );
}

export default App;
