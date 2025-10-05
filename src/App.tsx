import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataProvider } from '@/context/DataContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/admin/AdminLayout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import AdministrativeExperience from '@/pages/AdministrativeExperience';
import Publications from '@/pages/Publications';
import Talks from '@/pages/Talks';
import Activities from '@/pages/Activities';
import Awards from '@/pages/Awards';
import FinancialSupport from '@/pages/FinancialSupport';
import Lab from '@/pages/Lab';
import Events from '@/pages/Events';
import Login from '@/pages/Login';
import Dashboard from '@/pages/admin/Dashboard';
import ProfileEditor from '@/pages/admin/ProfileEditor';
import ResearchEditor from '@/pages/admin/ResearchEditor';
import TeachingEditor from '@/pages/admin/TeachingEditor';
import ExperienceEditor from '@/pages/admin/ExperienceEditor';
import PublicationsEditor from '@/pages/admin/PublicationsEditor';
import TalksEditor from '@/pages/admin/TalksEditor';
import ActivitiesEditor from '@/pages/admin/ActivitiesEditor';
import AwardsEditor from '@/pages/admin/AwardsEditor';
import FinancialSupportEditor from '@/pages/admin/FinancialSupportEditor';
import LabEditor from '@/pages/admin/LabEditor';
import EventsEditor from '@/pages/admin/EventsEditor';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="administrative-experience" element={<AdministrativeExperience />} />
              <Route path="publications" element={<Publications />} />
              <Route path="talks" element={<Talks />} />
              <Route path="activities" element={<Activities />} />
              <Route path="awards" element={<Awards />} />
              <Route path="financial-support" element={<FinancialSupport />} />
              <Route path="lab" element={<Lab />} />
              <Route path="events" element={<Events />} />
            </Route>
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<ProfileEditor />} />
              <Route path="research" element={<ResearchEditor />} />
              <Route path="teaching" element={<TeachingEditor />} />
              <Route path="experience" element={<ExperienceEditor />} />
              <Route path="publications" element={<PublicationsEditor />} />
              <Route path="talks" element={<TalksEditor />} />
              <Route path="activities" element={<ActivitiesEditor />} />
              <Route path="awards" element={<AwardsEditor />} />
              <Route path="financial-support" element={<FinancialSupportEditor />} />
              <Route path="lab" element={<LabEditor />} />
              <Route path="events" element={<EventsEditor />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App;