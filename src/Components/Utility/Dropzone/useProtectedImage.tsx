import { useEffect, useState } from "react";
import axiosInstance from "../../../Interceptor/AxiosInterceptor";

const useProtectedImage = (imageId?: string | null) => {
   console.log("Test 2, " + imageId);
   const [imageUrl, setImageUrl] = useState<string>("../nghiatv8.png");

   useEffect(() => {
      if (!imageId) return;
      axiosInstance
         .get("/media/" + imageId, { responseType: "blob" })
         .then((response) => {
            const url = URL.createObjectURL(response.data);
            setImageUrl(url);
            console.log("Test 3, " + url);
         })
         .catch((error) => {
            console.log("Error fetching protected image: ", error);
         });
   }, [imageId]);
   return imageUrl;
};

export default useProtectedImage;
