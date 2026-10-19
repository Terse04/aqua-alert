import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ScrollToTop } from '@/components/common/ScrollToTop';

import { HomePage } from '@/pages/HomePage';
import { ReportPage } from '@/pages/ReportPage';
import { TrackPage } from '@/pages/TrackPage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { AwarenessPage } from '@/pages/AwarenessPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { FeedbackPage } from '@/pages/FeedbackPage';
import { AboutPage } from '@/pages/AboutPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#F5F9FB] text-[#263746]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/awareness" element={<AwarenessPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
