import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout, { ScrollToTop } from './components/Layout.tsx'
import Seo from './components/Seo.tsx'
import VisitorTracker from './components/VisitorTracker.tsx'
import HomePage from './pages/HomePage.tsx'
import MenuPage from './pages/MenuPage.tsx'
import ClassesPage from './pages/ClassesPage.tsx'
import ReviewsPage from './pages/ReviewsPage.tsx'
import FAQPage from './pages/FAQPage.tsx'
import ContactPage from './pages/ContactPage.tsx'
import AdminLoginPage from './pages/AdminLoginPage.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Seo />
      <ScrollToTop />
      <VisitorTracker />
      <Routes>
        <Route path="/" element={<Layout navColor="white"><HomePage /></Layout>} />
        <Route path="/menu" element={<Layout><MenuPage /></Layout>} />
        <Route path="/classes" element={<Layout><ClassesPage /></Layout>} />
        <Route path="/reviews" element={<Layout navColor="white"><ReviewsPage /></Layout>} />
        <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
