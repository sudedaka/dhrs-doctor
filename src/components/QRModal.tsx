import { QRCodeCanvas } from 'qrcode.react';
import { X, ShieldCheck, CheckCircle2, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { SessionData } from '../types';

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  sessionData: SessionData | null;
}

export default function QRModal({ open, onClose, sessionData }: QRModalProps) {
  const [scanned, setScanned] = useState(false);
  const [simulating, setSimulating] = useState(false);

  if (!open || !sessionData) return null;

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setScanned(true);
    }, 2000);
  };

  const handleClose = () => {
    setScanned(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Hasta Bağlantısı</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">RSA 2048 Şifreli</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Patient info bar */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-700">{sessionData.patientName}</span>
          <span className="text-xs text-blue-500 font-mono">{sessionData.patientId}</span>
        </div>

        {/* Content */}
        <div className="p-8 text-center bg-slate-50/50">
          <AnimatePresence mode="wait">
            {!scanned ? (
              <motion.div
                key="qr-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="relative inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <QRCodeCanvas
                    value={JSON.stringify(sessionData)}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  {simulating && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-2xl">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                      <span className="text-xs font-bold text-slate-600">Kimlik Doğrulanıyor...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-slate-900 font-semibold text-lg">Kayda Erişmek İçin Taratın</p>
                  <p className="text-slate-500 text-sm px-4">
                    Hastalar, geçici tıbbi veri paylaşımını yetkilendirmek için bu kodu DHRS uygulamasını kullanarak taratmalıdır.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-100 inline-flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tighter">
                    OTURUM: {sessionData.sessionId}
                  </span>
                </div>

                {!simulating && (
                  <button
                    onClick={handleSimulate}
                    className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    Hasta Taramasını Simüle Et
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-4"
              >
                <div className="flex justify-center">
                  <div className="p-4 bg-emerald-50 rounded-full">
                    <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-slate-900">Güvenli Bağlantı</h4>
                  <p className="text-slate-500 text-sm">
                    Geçici ID:{' '}
                    <span className="font-mono text-blue-600 font-bold">
                      {Math.random().toString(36).substring(7).toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="p-4 bg-emerald-50/50 rounded-xl text-left border border-emerald-100">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                      Bu oturum için tıbbi kayıtlara erişim izni verildi. Tüm veriler izoledir ve oturum
                      sonlandırıldığında sistemden temizlenecektir.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                  Konsültasyona Devam Et
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}