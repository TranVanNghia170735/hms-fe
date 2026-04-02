import { Button, PasswordInput, TextInput } from "@mantine/core";
import { IconHeartbeat } from "@tabler/icons-react";

import { useForm } from "@mantine/form";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../Service/UserService";
import { setJwt } from "../Slices/JwtSlice";
import { setUser } from "../Slices/UserSlice";
import { errorNotification, successNotification } from "../Utility/NotificationUtil";

const LoginPage = () => {
   const [loading, setLoading] = React.useState(false);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const form = useForm({
      initialValues: {
         email: "",
         password: "",
      },

      validate: {
         email: (value: any) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
         password: (value: any) => (!value ? "Password is required" : null),
      },
   });

   const handleSubmit = (values: typeof form.values) => {
      setLoading(true);
      loginUser(values)
         .then((_data) => {
            successNotification("Login Successfully");
            dispatch(setJwt(_data));
            dispatch(setUser(jwtDecode(_data)));
         })
         .catch((error: any) => {
            errorNotification(error.response?.data?.errorMessage || "Login failed");
         })
         .finally(() => {
            setLoading(false);
         });
   };

   return (
      <div
         style={{ background: 'url("/bg.jpg")' }}
         className="h-screen w-screen !bg-cover !bg-center !bg-no-repeat flex flex-col items-center justify-center"
      >
         <div className="py-3 text-pink-500 flex gap-1 items-center">
            <IconHeartbeat size={45} stroke={2.5} />
            <span className="font-heading font-semibold text-5xl">Pulse</span>
         </div>
         <div className="w-[450px] backdrop-blur-md p-10 py-8 rounded-lg">
            <form
               onSubmit={form.onSubmit(handleSubmit)}
               className="flex flex-col gap-5 [&_input]:placeholder-neutral-100 [&_.mantine-Input-input]:!border-white focus-within:[&_.mantine-Input-input]:!border-pink-400 [&_.mantine-Input-input]:!border [&_input]:!pl-2 [&_svg]:text-white [&_input]:!text-white"
            >
               <div className="self-center font-medium font-heading text-white text-xl">Login</div>
               <TextInput
                  className="transition duration 300"
                  variant="unstyled"
                  size="md"
                  radius="md"
                  placeholder="Email"
                  {...form.getInputProps("email")}
               />
               <PasswordInput
                  variant="unstyled"
                  size="md"
                  radius="md"
                  placeholder="Password"
                  {...form.getInputProps("password")}
               />
               <Button loading={loading} type="submit" color="pink" radius="md" size="md">
                  Login
               </Button>
               <div className="text-neutral-100 text-sm self-center">
                  Don't have an account ?
                  <Link to="/register" className="hover:underline">
                     Register
                  </Link>
               </div>
            </form>
         </div>
      </div>
   );
};

export default LoginPage;
