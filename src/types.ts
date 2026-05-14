export interface Doctor {
  id: string;
  name: string;
  department: string;
  specialization: string;
}

export interface Patient {
  id: string;
  name: string;
  time: string;
  status: 'waiting' | 'authorized' | 'done';
}

export interface SessionData {
  sessionId: string;
  patientId: string;
  patientName: string;
  doctorPublicKey: string;
  hospitalPublicKey: string;
  expiresAt: string;
}

export interface Notification {
  type: 'info' | 'warning';
  tag: string;
  text: string;
}