// const BloodGroupData = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const BloodGroupData = [
   { value: "A_POSITIVE", label: "A+" },
   { value: "A_NEGATIVE", label: "A-" },
   { value: "B_POSITIVE", label: "B+" },
   { value: "B_NEGATIVE", label: "B-" },
   { value: "O_POSITIVE", label: "O+" },
   { value: "O_NEGATIVE", label: "O-" },
   { value: "AB_POSITIVE", label: "AB+" },
   { value: "AB_NEGATIVE", label: "AB-" },
];

const bloodGroup: Record<string, string> = {
   A_POSITIVE: "A+",
   A_NEGATIVE: "A-",
   B_POSITIVE: "B+",
   B_NEGATIVE: "B-",
   AB_POSITIVE: "AB+",
   AB_NEGATIVE: "AB-",
   O_POSITIVE: "O+",
   O_NEGATIVE: "O-",
};

const DoctorSpecializations = [
   "Cardiologist",
   "Dermatologist",
   "Neurologist",
   "Orthopedic",
   "Pediatrician",
   "Psychiatrist",
   "Gynecologist",
   "Oncologist",
   "Radiologist",
   "Anesthesiologist",
   "ENT Specialist",
   "Urologist",
   "Endocrinologist",
   "Gastroenterologist",
   "General Physician",
];

const DoctorDepartments = [
   "Cardiology",
   "Dermatology",
   "Neurology",
   "Orthopedics",
   "Pediatrics",
   "Psychiatry",
   "Gynecology",
   "Oncology",
   "Radiology",
   "Anesthesiology",
   "ENT",
   "Urology",
   "Endocrinology",
   "Gastroenterology",
   "General Medicine",
];

const appointmentReasons = [
   "General Consultation",
   "Follow-up",
   "Prescription Refill",
   "Lab Results Review",
   "Specialist Referral",
   "Vaccination",
   "Health Screening",
   "Chronic Condition Management",
   "Mental Health Support",
   "Physical Therapy",
   "Surgical Consultation",
   "Emergency Care",
];

const symptoms = [
   "Fever",
   "Cough",
   "Shortness of Breath",
   "Fatigue",
   "Headache",
   "Sore Throat",
   "Runny Nose",
   "Muscle Aches",
   "Loss of Taste or Smell",
   "Nausea",
   "Vomiting",
   "Diarrhea",
   "Dizziness",
   "Muscle Pain",
   "Chest Pain",
   "Abdominal Pain",
   "Back Pain",
   "Joint Pain",
   "Rash",
   "Swelling",
];

const tests = [
   "CBC",
   "Blood Sugar",
   "Lipid Profile",
   "Liver Function Test",
   "Kidney Function Test",
   "Thyroid Function Test",
   "Urinalysis",
   "ECG",
   "X-ray",
   "MRI",
   "CT Scan",
   "Ultrasound",
   "COVID-19 Test",
];

export { appointmentReasons, bloodGroup, BloodGroupData, DoctorDepartments, DoctorSpecializations, symptoms, tests };
