import { Button, PasswordInput, SegmentedControl, TextInput } from "@mantine/core";
import { IconHeartbeat } from "@tabler/icons-react";

import { useForm } from "@mantine/form";
import React from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../Service/UserService";
import { errorNotification, successNotification } from "../Utility/NotificationUtil";

const RegisterPage = () => {
   const [loading, setLoading] = React.useState(false);
   const navigate = useNavigate();
   const form = useForm({
      initialValues: {
         name: "",
         role: "PATIENT",
         email: "",
         password: "",
         confirmPassword: "",
      },

      validate: {
         name: (value: any) => (value ? null : "Name is required"),
         email: (value: any) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
         password: (value: any) =>
            !value
               ? "Password is required"
               : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/.test(value)
                 ? null
                 : "Password must be 8–15 characters, include uppercase, lowercase, number, and special character",
         confirmPassword: (value: any, values: any) => (value === values.password ? null : "Passwords do not match"),
      },
   });

   const handleSubmit = (values: typeof form.values) => {
      setLoading(true);
      registerUser(values)
         .then((response: any) => {
            successNotification("Registration Successfully");
            navigate("/login");
         })
         .catch((error: any) => {
            errorNotification(error.response?.data?.errorMessage || "Registration failed");
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
               <div className="self-center font-medium font-heading text-white text-xl">Register</div>
               <SegmentedControl
                  fullWidth
                  size="md"
                  radius="md"
                  color="pink"
                  bg="none"
                  className="[&_*]:!text-white border border-white"
                  data={[
                     { label: "PATIENT", value: "PATIENT" },
                     { label: "DOCTOR", value: "DOCTOR" },
                     { label: "ADMIN", value: "ADMIN" },
                  ]}
                  {...form.getInputProps("role")}
               />

               <TextInput
                  className="transition duration 300"
                  variant="unstyled"
                  size="md"
                  radius="md"
                  placeholder="Name"
                  {...form.getInputProps("name")}
               />
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

               <PasswordInput
                  variant="unstyled"
                  size="md"
                  radius="md"
                  placeholder="Confirm Password"
                  {...form.getInputProps("confirmPassword")}
               />
               <Button loading={loading} type="submit" color="pink" radius="md" size="md">
                  Register
               </Button>
               <div className="text-neutral-100 text-sm self-center">
                  Have an account ?
                  <Link to="/login" className="hover:underline">
                     Login
                  </Link>
               </div>
            </form>
         </div>
      </div>
   );
};

export default RegisterPage;
