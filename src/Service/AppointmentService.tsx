import axiosInstance from "../Interceptor/AxiosInterceptor";

const scheduleAppointment = async (data: any) => {
   return axiosInstance
      .post("/appointment/schedule", data)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const cancelAppointment = async (id: any) => {
   return axiosInstance
      .put(`/appointment/cancel/${id}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getAppointment = async (id: any) => {
   return axiosInstance
      .get("/appointment/get/", id)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getAppointmentDetails = async (id: any) => {
   return axiosInstance
      .get(`/appointment/get/details/${id}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getAppointmentsByPatient = async (patientId: any) => {
   return axiosInstance
      .get(`/appointment/getAllByPatient/${patientId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getAppointmentsByDoctor = async (doctorId: any) => {
   return axiosInstance
      .get(`/appointment/getAllByDoctor/${doctorId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const createAppointmentReport = (data: any) => {
   return axiosInstance
      .post("/appointment/report/create", data)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const isReportExists = async (appointmentId: any) => {
   return axiosInstance
      .get(`/appointment/report/isRecordExists/${appointmentId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getReportsByPatientId = async (patientId: any) => {
   return axiosInstance
      .get(`/appointment/report/getReportsByPatientId/${patientId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getPrescriptionsByPatientId = async (patientId: any) => {
   return axiosInstance
      .get(`/appointment/report/getPrescriptionsByPatientId/${patientId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getAllPrescriptions = async () => {
   return axiosInstance
      .get("/appointment/report/getAllPrescriptions")
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getMedicinesByPrescriptionId = async (prescriptionId: any) => {
   return axiosInstance
      .get(`/appointment/report/getMedicinesByPrescriptionId/${prescriptionId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const countAppointmentsByPatient = async (patientId: any) => {
   return axiosInstance
      .get(`/appointment/countByPatient/${patientId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const countAppointmentsByDoctor = async (doctorId: any) => {
   return axiosInstance
      .get(`/appointment/countByDoctor/${doctorId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const countAllAppointments = async () => {
   return axiosInstance
      .get("/appointment/visitCount")
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const countReasonsByPatient = async (patientId: any) => {
   return axiosInstance
      .get(`/appointment/countReasonsByPatient/${patientId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const countReasonsByDoctor = async (doctorId: any) => {
   return axiosInstance
      .get(`/appointment/countReasonsByDoctor/${doctorId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const countAllReasons = async () => {
   return axiosInstance
      .get("/appointment/countReasons")
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getMedicinesConsumedByPatient = async (patientId: any) => {
   return axiosInstance
      .get(`/appointment/getMedicinesByPatient/${patientId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getTodaysAppointments = async () => {
   return axiosInstance
      .get("/appointment/today")
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

export {
   cancelAppointment,
   countAllAppointments,
   countAllReasons,
   countAppointmentsByDoctor,
   countAppointmentsByPatient,
   countReasonsByDoctor,
   countReasonsByPatient,
   createAppointmentReport,
   getAllPrescriptions,
   getAppointment,
   getAppointmentDetails,
   getAppointmentsByDoctor,
   getAppointmentsByPatient,
   getMedicinesByPrescriptionId,
   getMedicinesConsumedByPatient,
   getPrescriptionsByPatientId,
   getReportsByPatientId,
   getTodaysAppointments,
   isReportExists,
   scheduleAppointment,
};
