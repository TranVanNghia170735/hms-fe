import { Avatar, Button, Divider, Modal, NumberInput, Select, Table, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { DoctorDepartments, DoctorSpecializations } from "../../../Data/DropdownData";

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
               <Button onClick={() => setEdit(false)} variant="filled" leftSection={<IconEdit />} size="lg">
                  Submit
               </Button>
            ) : (
               <Button onClick={() => setEdit(true)} variant="filled" leftSection={<IconEdit />} size="lg">
                  Edit
               </Button>
            )}
         </div>
         <Divider my="xl" />
         <div>
            <div className="text-2xl font-medium mb-5 text-neutral-900">Personal Information</div>
            <Table striped stripedColor="primary.1" verticalSpacing="md" withRowBorders={false}>
               <Table.Tbody>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Date of Birth</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <DatePickerInput
                              placeholder="Date of Birth"
                              onChange={(date) => {
                                 // Handle date change
                              }}
                              clearable
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.dob}</Table.Td>
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
                              onChange={(value) => {
                                 // Handle phone number change
                              }}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.phone}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Address</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <TextInput placeholder="" />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.address}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">License No</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <NumberInput maxLength={12} clampBehavior="strict" placeholder="Licensce No" hideControls />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.licenseNo}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Specialization</Table.Td>
                     {edit ? (
                        <Table.Td className="text-xl">
                           <Select placeholder="Specialization" data={DoctorSpecializations} />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.specialization}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Department</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <Select placeholder="Department" data={DoctorDepartments} />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.department || "None"}</Table.Td>
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
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{doctor.totalExp || "None"}</Table.Td>
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
