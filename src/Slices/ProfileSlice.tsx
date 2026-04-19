import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const profileSlice = createSlice({
   name: "profile",
   initialState: localStorage.getItem("token") ? jwtDecode(localStorage?.getItem("token") || "") : {},
   reducers: {
      setProfile: (state, action) => {
         state = action.payload;
         return state;
      },
      removeProfile: (state) => {
         localStorage.removeItem("token");
         state = {};
         return state;
      },
   },
});

export const { removeProfile, setProfile } = profileSlice.actions;
export default profileSlice.reducer;
