import { Avatar, Button, Divider, Modal, NumberInput, Select, Table, TagsInput, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BloodGroupData } from "../../../Data/DropdownData";

const patient: any = {
   name: "John Doe",
   email: "john.doe@example.com",
   dob: "1990-05-15",
   phone: "+1 234 567 890",
   address: "123 Main St, Anytown, USA",
   addharNo: "1234-5678-9012",
   bloodGroup: "A+",
   allergies: "Peanuts",
   chronicDiseases: "Diabetes",
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
                        <Table.Td className="text-xl">{patient.dob}</Table.Td>
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
                        <Table.Td className="text-xl">{patient.phone}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Address</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <TextInput placeholder="" />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{patient.address}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Aadhar Number</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <NumberInput
                              maxLength={12}
                              clampBehavior="strict"
                              placeholder="Aadhar number"
                              hideControls
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{patient.addharNo}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Blood Group</Table.Td>
                     {edit ? (
                        <Table.Td className="text-xl">
                           <Select
                              // label="Blood Group"
                              placeholder="Select blood group"
                              data={BloodGroupData}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{patient.bloodGroup}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Allergies</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <TagsInput
                              placeholder="Add allergy"
                              onChange={(value) => {
                                 // Handle allergies change
                              }}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{patient.allergies || "None"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Chronic Diseases</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <TagsInput
                              placeholder="Add chronic disease"
                              onChange={(value) => {
                                 // Handle chronic diseases change
                              }}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{patient.chronicDiseases || "None"}</Table.Td>
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
