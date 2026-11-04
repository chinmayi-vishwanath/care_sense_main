import type { Role } from '@/types/domain';

/** True when Supabase env vars are NOT set — the app runs in demo mode. */
export function isDemoMode(): boolean {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
  );
}

export const DEMO_COOKIE = 'demo_role';

// ── Mock profiles for each role ──────────────────────────────────────────────

export const DEMO_PROFILES: Record<Role, DemoProfile> = {
  patient: {
    id: 'demo-patient-001',
    full_name: 'Ramesh K.',
    role: 'patient' as Role,
    phone: '+919876543210',
  },
  caregiver: {
    id: 'demo-caregiver-001',
    full_name: 'Priya K.',
    role: 'caregiver' as Role,
    phone: '+919876543211',
  },
  doctor: {
    id: 'demo-doctor-001',
    full_name: 'Dr. Shah',
    role: 'doctor' as Role,
    phone: '+919876543212',
  },
};

export type DemoProfile = {
  id: string;
  full_name: string;
  role: Role;
  phone: string;
};

export const DEMO_PATIENT_ID = 'demo-patient-001';

// ── Mock vitals (Ramesh — deteriorating BP story) ────────────────────────────

function generateDemoVitals() {
  const vitals = [];
  const now = Date.now();
  const DAY = 86400000;

  for (let d = 29; d >= 0; d--) {
    const day = d;
    // Ramesh: stable days 0-17, drift 18-22, spike 23-29
    let bpSys = 128, bpDia = 82, glucose = 135;
    if (day >= 18 && day < 23) {
      bpSys = 128 + (day - 17) * 3;
      bpDia = 82 + (day - 17) * 2;
      glucose = 135 + (day - 17) * 5;
    } else if (day >= 23) {
      bpSys = 145 + (day - 22) * 5;
      bpDia = 92 + (day - 22) * 3;
      glucose = 160 + (day - 22) * 15;
    }
    // Add small noise
    const noise = () => Math.round((Math.random() - 0.5) * 4);

    vitals.push({
      id: `demo-vital-${30 - d}`,
      patient_id: DEMO_PATIENT_ID,
      logged_at: new Date(now - d * DAY).toISOString(),
      bp_systolic: bpSys + noise(),
      bp_diastolic: bpDia + noise(),
      glucose_mgdl: glucose + noise(),
      heart_rate: 72 + (day >= 23 ? (day - 22) * 6 : 0) + noise(),
      spo2: day >= 27 ? 94 + noise() : 97 + Math.round(Math.random()),
      weight_kg: 78,
      sleep_hours: day >= 20 ? 4.5 + Math.random() : 7 + Math.random(),
      activity_level: day >= 22 ? 'low' : 'medium',
      diet_flag: day >= 20 ? 'high_sodium' : 'normal',
      mood: day >= 23 ? 2 : 4,
      notes: null,
    });
  }
  return vitals;
}

export const DEMO_VITALS = generateDemoVitals();

export const DEMO_BASELINE = {
  patient_id: DEMO_PATIENT_ID,
  bp_systolic_mean: 128,
  bp_systolic_std: 5,
  bp_diastolic_mean: 82,
  bp_diastolic_std: 4,
  glucose_mean: 135,
  glucose_std: 10,
  heart_rate_mean: 72,
  heart_rate_std: 6,
  data_points_count: 30,
};

export const DEMO_MEDICATIONS = [
  { id: 'demo-med-1', patient_id: DEMO_PATIENT_ID, name: 'Metformin', dosage: '500mg', frequency: 'morning_evening', active: true },
  { id: 'demo-med-2', patient_id: DEMO_PATIENT_ID, name: 'Amlodipine', dosage: '5mg', frequency: 'morning', active: true },
  { id: 'demo-med-3', patient_id: DEMO_PATIENT_ID, name: 'Atorvastatin', dosage: '10mg', frequency: 'evening', active: true },
];

export const DEMO_ALERTS = [
  {
    id: 'demo-alert-1',
    patient_id: DEMO_PATIENT_ID,
    level: 'risk' as const,
    title: 'BP Trending Upward',
    message: 'Your blood pressure has been rising steadily over the past 5 days, reaching 165/101 today. This is above your personal baseline of 128/82. Combined with 3 missed Amlodipine doses and reduced sleep, your risk of a hypertensive episode has increased.',
    recommendation: 'Take your Amlodipine dose now if you haven\'t today, rest, and avoid salty foods. If symptoms appear, consult your doctor.',
    shap_breakdown: { vital_change: 0.45, medication: 0.35, lifestyle: 0.20 },
    confidence: 0.84,
    forecast_72hr: { predicted: 172, interval_low: 162, interval_high: 182, days_to_critical: 2.3, confidence: 0.84 },
    message_source: 'fallback' as const,
    status: 'open' as const,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const DEMO_PATIENT = {
  id: DEMO_PATIENT_ID,
  user_id: 'demo-patient-001',
  age: 62,
  sex: 'M',
  conditions: ['diabetes', 'hypertension'],
  allergies: ['Penicillin'],
  emergency_contact_name: 'Priya K.',
  emergency_contact_phone: '+919876543211',
  location_lat: 12.9716,
  location_lng: 77.5946,
  address: 'Whitefield, Bengaluru',
  created_at: new Date().toISOString(),
};

export const DEMO_HOSPITALS = [
  { id: 'h1', name: 'Apollo Hospital Whitefield', specialty: ['Cardiology', 'Endocrinology'], address: 'Whitefield Main Rd', lat: 12.9698, lng: 77.7500, beds_available: 4, beds_total: 120, rating: 4.5, phone: '+918012345678', distance_km: 2.3 },
  { id: 'h2', name: 'Manipal Hospital', specialty: ['Cardiology', 'Nephrology'], address: 'HAL Airport Rd', lat: 12.9592, lng: 77.6480, beds_available: 7, beds_total: 200, rating: 4.3, phone: '+918012345679', distance_km: 5.1 },
  { id: 'h3', name: 'Narayana Health City', specialty: ['Cardiology'], address: 'Hosur Rd', lat: 12.8715, lng: 77.6390, beds_available: 12, beds_total: 300, rating: 4.6, phone: '+918012345680', distance_km: 8.4 },
  { id: 'h4', name: 'Columbia Asia Whitefield', specialty: ['General', 'Cardiology'], address: 'ITPL Main Rd', lat: 12.9855, lng: 77.7315, beds_available: 2, beds_total: 80, rating: 4.1, phone: '+918012345681', distance_km: 3.7 },
  { id: 'h5', name: 'Fortis Hospital Bannerghatta', specialty: ['Cardiology', 'Emergency'], address: 'Bannerghatta Rd', lat: 12.8900, lng: 77.5970, beds_available: 5, beds_total: 150, rating: 4.4, phone: '+918012345682', distance_km: 10.2 },
];

// Caregiver's linked patients
export const DEMO_CAREGIVER_PATIENTS = [
  { ...DEMO_PATIENT, full_name: 'Ramesh K.', relationship: 'Father', alert_level: 'risk' },
  { id: 'demo-patient-002', user_id: 'demo-patient-002', full_name: 'Lakshmi P.', age: 58, sex: 'F', conditions: ['hypertension'], allergies: [], relationship: 'Mother', alert_level: 'stable', emergency_contact_name: 'Priya K.', emergency_contact_phone: '+919876543211', location_lat: 12.9716, location_lng: 77.5946, address: 'Koramangala, Bengaluru', created_at: new Date().toISOString() },
];

// Doctor's patient list
export const DEMO_DOCTOR_PATIENTS = [
  { ...DEMO_PATIENT, full_name: 'Ramesh K.', alert_level: 'risk', last_logged: new Date(Date.now() - 7200000).toISOString() },
  { id: 'demo-patient-002', user_id: 'demo-patient-002', full_name: 'Lakshmi P.', age: 58, sex: 'F', conditions: ['hypertension'], allergies: [], alert_level: 'stable', last_logged: new Date(Date.now() - 14400000).toISOString(), emergency_contact_name: null, emergency_contact_phone: null, location_lat: 12.9716, location_lng: 77.5946, address: 'Koramangala, Bengaluru', created_at: new Date().toISOString() },
  { id: 'demo-patient-003', user_id: 'demo-patient-003', full_name: 'Suresh M.', age: 70, sex: 'M', conditions: ['post-cardiac'], allergies: ['Aspirin'], alert_level: 'watch', last_logged: new Date(Date.now() - 28800000).toISOString(), emergency_contact_name: 'Meera M.', emergency_contact_phone: '+919876543215', location_lat: 12.9716, location_lng: 77.5946, address: 'Indiranagar, Bengaluru', created_at: new Date().toISOString() },
];
