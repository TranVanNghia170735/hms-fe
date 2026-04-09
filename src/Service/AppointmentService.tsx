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

export {
   cancelAppointment,
   createAppointmentReport,
   getAppointment,
   getAppointmentDetails,
   getAppointmentsByDoctor,
   getAppointmentsByPatient,
   getPrescriptionsByPatientId,
   getReportsByPatientId,
   isReportExists,
   scheduleAppointment,
};
