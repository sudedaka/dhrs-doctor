import { useState } from 'react';
import { ShieldCheck, Shield, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (doctorId: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [doctorId, setDoctorId] = useState('DOC-001');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!doctorId.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setLoading(false);
      onLogin(doctorId.trim());
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 w-[380px] flex flex-col items-center"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight">DHRS</h1>
        <p className="text-sm text-slate-400 mb-8">Dağıtık Hastane Randevu Sistemi</p>

        {/* Doctor ID */}
        <div className="w-full mb-4">
          <label className="block text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase mb-1.5">
            Yetkili Kimliği (ID)
          </label>
          <div className="relative flex items-center">
            <Shield className="absolute left-3.5 w-4 h-4 text-slate-300" strokeWidth={1.5} />
            <input
              type="text"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              placeholder="DOC-001"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="w-full mb-2">
          <label className="block text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase mb-1.5">
            Güvenlik Anahtarı
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-slate-300" strokeWidth={1.5} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="w-full text-xs text-red-500 mt-1 mb-2">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Giriş yapılıyor...
            </span>
          ) : (
            <>
              Güvenli Giriş Yap
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}