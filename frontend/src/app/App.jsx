import './App.css'
import { HomePage } from './pages/HomePage.jsx'
import { MainLayout } from '../layouts/MainLayout.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MentionsLegalesPage } from './pages/MentionsLegalesPage.jsx'
import { PolitiqueConfidentialitePage } from './pages/PolitiqueConfidentialitePage.jsx'
import { CookiesPage } from './pages/CookiesPage.jsx'
import { CguPage } from './pages/CguPage.jsx'
import { ReserverPage } from './pages/ReserverPage.jsx'
import { InstructeursPage } from './pages/InstructeursPage.jsx'
import { FaqPage } from './pages/FaqPage.jsx'
import { AuthPage } from './pages/AuthPage.jsx'
import { CoursPage } from '../pages/CoursPage.jsx'
import { CoursDetailPage } from '../pages/CoursDetailPage.jsx'
import { InscriptionPage } from '../pages/InscriptionPage.jsx'
import { ProfilPage } from '../pages/ProfilPage.jsx'
import { FaqContactPage } from '../pages/FaqContactPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout title="Apnea Flow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cours" element={<CoursPage />} />
          <Route path="/cours/:id" element={<CoursDetailPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/faq-contact" element={<FaqContactPage />} />
          <Route path="/reserver" element={<ReserverPage />} />
          <Route path="/instructeurs" element={<InstructeursPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route
            path="/politique-de-confidentialite"
            element={<PolitiqueConfidentialitePage />}
          />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/cgu" element={<CguPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

