import axiosInstance from "../Interceptor/AxiosInterceptor";

const getPatient = async (patientId: string) => {
   return axiosInstance
      .get(`/profile/patient/get/${patientId}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error.response ? error.response.data : error.message;
      });
};

const updatePatient = async (patient: any) => {
   return axiosInstance
      .put("/profile/patient/update", patient)
      .then((response: any) => response.data)
      .catch((error: any) => {
         throw error;
      });
};

const getAllPatients = async () => {
   return axiosInstance
      .get("/profile/patient/getAll")
      .then((response: any) => response.data)
      .catch((error: any) => {
         throw error;
      });
};

export { getAllPatients, getPatient, updatePatient };
