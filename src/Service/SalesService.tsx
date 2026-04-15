import axiosInstance from "../Interceptor/AxiosInterceptor";

const addSales = async (data: any) => {
   return axiosInstance
      .post("/pharmacy/sales/create", data)
      .then((response: any) => response.data)
      .catch((error: any) => {
         throw error;
      });
};

const getSales = async (id: any) => {
   return axiosInstance
      .get(`/pharmacy/sales/get/${id}`)
      .then((response: any) => response.data)
      .catch((error: any) => {
         throw error;
      });
};

const getAllSaleItems = async (id: any) => {
   return axiosInstance
      .get(`/pharmacy/getSaleItems/getAll/${id}`)
      .then((response: any) => response.data)
      .catch((error: any) => {
         throw error;
      });
};

const updateSale = async (data: any) => {
   return axiosInstance
      .put("/pharmacy/sales/update", data)
      .then((response: any) => response.data)
      .catch((error: any) => {
         throw error;
      });
};

export { addSales, getAllSaleItems, getSales, updateSale };
