import axiosInstance from "../Interceptor/AxiosInterceptor";

const registerUser = async (user: any) => {
   return axiosInstance
      .post("/user/register", user)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const loginUser = async (credentials: any) => {
   return axiosInstance
      .post("/user/login", credentials)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getUserProfile = async (id: any) => {
   return axiosInstance
      .get(`/user/getProfile/${id}`)
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

const getRegistrationCounts = async () => {
   return axiosInstance
      .get("/user/getRegistrationCounts")
      .then((response) => response.data)
      .catch((error) => {
         throw error;
      });
};

export { getRegistrationCounts, getUserProfile, loginUser, registerUser };
