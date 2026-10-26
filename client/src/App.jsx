import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { SOSButton } from './components/SOSButton';

// Context Providers
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Pages
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import CustomerDashboard from './pages/CustomerDashboard';
import FindWorkers from './pages/FindWorkers';
import WorkerProfile from './pages/WorkerProfile';
import Negotiation from './pages/Negotiation';
import WorkerDashboard from './pages/WorkerDashboard';
import JobTracking from './pages/JobTracking';
import ReviewPage from './pages/ReviewPage';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen on first session load
    return !sessionStorage.getItem('homecrew_splash_seen');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('homecrew_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <SocketProvider>
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginSignup />} />
                  <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                  <Route path="/find-workers" element={<FindWorkers />} />
                  <Route path="/worker/:id" element={<WorkerProfile />} />
                  <Route path="/negotiation/:jobId" element={<Negotiation />} />
                  <Route path="/worker/dashboard" element={<WorkerDashboard />} />
                  <Route path="/tracking/:jobId" element={<JobTracking />} />
                  <Route path="/review/:jobId" element={<ReviewPage />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              {/* Universal Floating Safety Alarm */}
              <SOSButton />
            </div>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
