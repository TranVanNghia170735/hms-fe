import { Avatar, Button, Divider, Modal, NumberInput, Select, Table, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DoctorDepartments, DoctorSpecializations } from "../../../Data/DropdownData";
import { getDoctor, updateDoctor } from "../../../Service/DoctorProfileService";
import { formatDate } from "../../../Utility/DateUtility";
import { errorNotification, successNotification } from "../../../Utility/NotificationUtil";

const doctor = {
   name: "Dr. Swapnil Patil",
   email: "pranav.khaire@example.com",
   dob: "1999-12-20",
   phone: "+91 9876543210",
   address: "Pune, Maharashtra, India",
   licenseNo: "MH123456",
   specialization: "Cardiology",
   department: "Cardiology",
   totalExp: 5,
   profilePicture: "https://randomuser.me/api/portraits/men/75.jpg",
};

const Profile = () => {
   const user = useSelector((state: any) => state.user);
   const [edit, setEdit] = useState(false);
   const [opened, { open, close }] = useDisclosure(false);
   const [doctor, setDoctor] = useState<any>({});

   const parseArray = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      try {
         const parsed = JSON.parse(value);
         return Array.isArray(parsed) ? parsed : [];
      } catch {
         return [];
      }
   };

   useEffect(() => {
      getDoctor(user.profileId)
         .then((data) => {
            setDoctor({ ...data });
         })
         .catch((error) => {
            console.log(error);
         });
   }, [user.profileId]);

   const form = useForm({
      initialValues: {
         dob: "",
         phone: "",
         address: "",
         licenseNo: "",
         specialization: "",
         department: "",
         totalExp: "",
      },
      validate: {
         dob: (value: any) => (!value ? "Date of Birth is required" : undefined),
         phone: (value: string) => (!value ? "Phone Number is required" : undefined),
         licenseNo: (value: string) => (!value ? "License Number is required" : undefined),
         address: (value: string) => (!value ? "Address is required" : undefined),
         specialization: (value: string) => (!value ? "Specialization is required" : undefined),
         department: (value: string) => (!value ? "Department is required" : undefined),
         totalExp: (value: any) => (value < 0 ? "Experience cannot be negative" : undefined),
      },
   });

   const handleSubmit = (e: any) => {
      let values = form.getValues();
      form.validate();
      if (!form.isValid()) return;

      updateDoctor({
         ...doctor,
         ...values,
      })
         .then((data) => {
            successNotification("Profile updated successfully");
            setDoctor({ ...doctor, ...values });
            setEdit(false);
         })
         .catch((error) => {
            errorNotification(error.response.data.errorMessage);
         });
   };

   const handleEdit = () => {
      form.setValues({
         ...doctor,
         dob: doctor.dob ? new Date(doctor.dob) : undefined,
      });
      setEdit(true);
   };

   return (
      <div className="p-10">
         <div className="flex justify-between items-start">
            <div className="flex gap-5 items-center">
               <div className="flex flex-col items-center gap-3">
                  <Avatar variant="filled" src="../nghiatv8.png" size={150} alt="it's me" />
                  {edit && (
                     <Button size="sm" variant="outline" onClick={open}>
                        Upload
                     </Button>
                  )}
               </div>
               <div className="flex flex-col gap-3">
                  <div className="text-3xl font-medium text-neutral-900">{user.name}</div>
                  <div className="text-xl text-neutral-700">{user.email}</div>
               </div>
            </div>
            {edit ? (
               <Button onClick={handleSubmit} variant="filled" leftSection={<IconEdit />} size="lg" type="submit">
                  Submit
               </Button>
            ) : (
               <Button onClick={handleEdit} variant="filled" leftSection={<IconEdit />} size="lg" type="button">
                  Edit
               </Button>
            )}
         </div>
         <Divider my="xl" />
         <div>
            <div className="text-2xl font-medium mb-5 text-neutral-900">Personal Information</div>
            <Table striped stripedColor="primary.1" verticalSpacing="md" withRowBorders={false}>
               <Table.Tbody className="[&>tr]:!mb-3 [&_td]:!w-1/2">
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Date of Birth</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <DateInput {...form.getInputProps("dob")} placeholder="Date of Birth" />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{formatDate(doctor.dob) ?? "-"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Phone</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <NumberInput
                              placeholder="Enter your phone number"
                              hideControls
                              maxLength={10}
                              clampBehavior="strict"
                              {...form.getInputProps("phone")}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.phone ?? "-"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Address</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <TextInput placeholder="Address" {...form.getInputProps("address")} />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.address ?? "-"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">License No</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <TextInput placeholder="Licensce number" {...form.getInputProps("licenseNo")} />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.licenseNo ?? "-"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Specialization</Table.Td>
                     {edit ? (
                        <Table.Td className="text-xl">
                           <Select
                              placeholder="Specialization"
                              data={DoctorSpecializations}
                              {...form.getInputProps("specialization")}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.specialization ?? "-"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Department</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <Select
                              placeholder="Department"
                              data={DoctorDepartments}
                              {...form.getInputProps("department")}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.department ?? "-"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Total Experience</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <NumberInput
                              maxLength={2}
                              max={50}
                              clampBehavior="strict"
                              placeholder="Total Experience"
                              hideControls
                              {...form.getInputProps("totalExp")}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">
                           {doctor.totalExp ?? "-"}
                           {doctor.totalExp ? "years" : ""}
                        </Table.Td>
                     )}
                  </Table.Tr>
               </Table.Tbody>
            </Table>
         </div>
         <Modal
            opened={opened}
            onClose={close}
            centered
            title={<span className="text-xl font-medium">Upload Profile picture</span>}
         ></Modal>
      </div>
   );
};

export default Profile;
