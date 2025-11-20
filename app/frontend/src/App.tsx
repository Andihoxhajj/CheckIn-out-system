import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { History } from '@/pages/History';
import { Settings } from '@/pages/Settings';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </Layout>
);

export default App;

