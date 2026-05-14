import { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  History,
  LayoutGrid,
  QrCode,
  Info,
  PhoneCall,
  Archive,
  LogOut,
  Clock,
  User,
  FileText,
  Calendar,
} from 'lucide-react';
import type { Doctor, Patient, SessionData } from '../types';
import QRModal from '../components/QRModal';

interface DashboardProps {
  doctor: Doctor;
  onLogout: () => void;
}

const INITIAL_PATIENTS: Patient[] = [
  { id: 'PAT-001', name: 'Ayşe Yılmaz', time: '09:00', status: 'waiting' },
  { id: 'PAT-002', name: 'Mehmet Demir', time: '09:30', status: 'waiting' },
  { id: 'PAT-003', name: 'Zeynep Kaya', time: '10:00', status: 'waiting' },
  { id: 'PAT-004', name: 'Ali Çelik', time: '10:30', status: 'waiting' },
  { id: 'PAT-005', name: 'Fatma Şahin', time: '11:00', status: 'waiting' },
];

function generateSessionId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function Dashboard({ doctor, onLogout }: DashboardProps) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

 const openQR = async (patient: Patient) => {
  // TODO: //hastane server gelince burayı gerçek API çağrısı yapacak şekilde güncellenecek
  // const res = await fetch('http://hospital-server/api/session/create', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ patientId: patient.id, doctorId: doctor.id })
  // });
  // const data = await res.json();
  // setSessionData(data); // server'dan gelecek: { sessionId, doctorPublicKey, hospitalPublicKey, expiresAt }

  // MOCK - şimdilik bu:
  const now = new Date();
  setSessionData({
    sessionId: generateSessionId(),
    patientId: patient.id,
    patientName: patient.name,
    doctorPublicKey: 'MOCK_DOC_PUB_KEY',
    hospitalPublicKey: 'MOCK_HOSP_PUB_KEY',
    expiresAt: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
  });
  setModalOpen(true);
};

  const handleModalClose = () => {
    setModalOpen(false);
    // QR tarandıysa hastayı authorized yap
    if (sessionData) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === sessionData.patientId ? { ...p, status: 'authorized' } : p
        )
      );
    }
    setSessionData(null);
  };

  const authorizedCount = patients.filter((p) => p.status === 'authorized').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="font-semibold text-slate-800 tracking-tight">DHRS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800 leading-none">{doctor.name}</p>
            <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wide">
              {doctor.id} • {doctor.department}
            </p>
          </div>
          <button
            onClick={onLogout}
            title="Çıkış Yap"
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 grid grid-cols-[1fr_300px] gap-4 p-5 max-w-[1280px] w-full mx-auto">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<Users className="w-5 h-5 text-blue-600" strokeWidth={1.5} />}
              iconBg="bg-blue-50"
              value={patients.length}
              label="Bugünkü Hastalar"
            />
            <StatCard
              icon={<Activity className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />}
              iconBg="bg-emerald-50"
              value="98.2%"
              label="Sistem Durumu"
            />
            <StatCard
              icon={<History className="w-5 h-5 text-violet-600" strokeWidth={1.5} />}
              iconBg="bg-violet-50"
              value={24}
              label="Denetim Kayıtları"
            />
          </div>

          {/* Patient list */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <LayoutGrid className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                Randevulu Hastalar
              </div>
              <span className="text-[10px] font-semibold tracking-widest uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                Canlı Güncellemeler
              </span>
            </div>

            <div className="space-y-1">
              {patients.map((patient) => (
                <PatientRow
                  key={patient.id}
                  patient={patient}
                  onOpenQR={() => openQR(patient)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-slate-400 mb-1">
              Sistem Notları
            </p>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-slate-800">Bölüm Duyuruları</h2>
              <Info className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <NoticeCard
                type="info"
                tag="Yeni Güncelleme"
                text="Bölüm içi veri senkronizasyonu artık daha hızlı. Blockchain kayıtları otomatik doğrulanıyor."
              />
              <NoticeCard
                type="warning"
                tag="Bilgilendirme"
                text="Hasta gizliliği için oturum sonrası ekran kilidini kullanmayı unutmayın."
              />
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-medium text-slate-800 mb-4">Hızlı İşlemler</h2>
            <div className="space-y-1">
              <QuickAction icon={<PhoneCall className="w-4 h-4 text-slate-500" strokeWidth={1.5} />} title="Görüntülü Görüşme" subtitle="Aramayı Başlat" />
              <QuickAction icon={<Archive className="w-4 h-4 text-slate-500" strokeWidth={1.5} />} title="Arşivlenmiş Kayıtlar" subtitle="Geçmiş Kayıtlar" />
              <QuickAction icon={<FileText className="w-4 h-4 text-slate-500" strokeWidth={1.5} />} title="Rapor Oluştur" subtitle="Günlük Özet" />
              <QuickAction icon={<Calendar className="w-4 h-4 text-slate-500" strokeWidth={1.5} />} title="Randevu Takvimi" subtitle="Haftalık Görünüm" />
            </div>
          </div>

          {/* Session status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-medium text-slate-800 mb-3">Oturum Durumu</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Yetkilendirilen</span>
              <span className="font-medium text-slate-700">
                {authorizedCount} / {patients.length}
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(authorizedCount / patients.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <QRModal open={modalOpen} onClose={handleModalClose} sessionData={sessionData} />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function StatCard({ icon, iconBg, value, label }: {
  icon: React.ReactNode; iconBg: string; value: string | number; label: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-2xl font-semibold text-slate-800 leading-none">{value}</p>
      <p className="text-[10px] font-semibold tracking-[0.07em] uppercase text-slate-400 mt-1.5">{label}</p>
    </div>
  );
}

function PatientRow({ patient, onOpenQR }: { patient: Patient; onOpenQR: () => void }) {
  const authorized = patient.status === 'authorized';
  return (
    <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{patient.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">{patient.id}</span>
            <Clock className="w-3 h-3 text-slate-300" />
            <span className="text-xs text-slate-400">{patient.time}</span>
          </div>
        </div>
      </div>

      {authorized ? (
        <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Yetkilendirildi
        </span>
      ) : (
        <button
          onClick={onOpenQR}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <QrCode className="w-3.5 h-3.5" />
          Oturumu Yetkilendir
        </button>
      )}
    </div>
  );
}

function NoticeCard({ type, tag, text }: { type: 'info' | 'warning'; tag: string; text: string }) {
  const styles = type === 'info' ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200';
  const tagColor = type === 'info' ? 'text-blue-600' : 'text-slate-400';
  return (
    <div className={`rounded-xl border p-3 ${styles}`}>
      <p className={`text-[10px] font-semibold tracking-widest uppercase mb-1 ${tagColor}`}>{tag}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
    </div>
  );
}

function QuickAction({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </button>
  );
}