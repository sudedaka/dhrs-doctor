import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import type { Doctor } from './types';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const handleLogin = (doctorId: string) => {
    setDoctor({
      id: doctorId || 'DOC-001',
      name: 'Dr. Osman Doluca',
      department: 'Kardiyoloji Bölümü',
      specialization: 'Yapısal Kalp Uzmanı',
    });
  };

  const handleLogout = () => setDoctor(null);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AnimatePresence mode="wait">
        {!doctor ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Login onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Dashboard doctor={doctor} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}