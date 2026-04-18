import { Avatar, Button, Divider, Modal, NumberInput, Select, Table, TagsInput, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { bloodGroup, BloodGroupData } from "../../../Data/DropdownData";
import { getPatient, updatePatient } from "../../../Service/PatientProfileService";
import { formatDate } from "../../../Utility/DateUtility";
import { errorNotification, successNotification } from "../../../Utility/NotificationUtil";
import { arrayToCSV } from "../../../Utility/OtherUtility";
import { DropzoneButton } from "../../Utility/Dropzone/DropzoneButton";

const Profile = () => {
   const user = useSelector((state: any) => state.user);
   const [edit, setEdit] = useState(false);
   const [opened, { open, close }] = useDisclosure(false);

   const [patient, setPatient] = useState<any>({});

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
      getPatient(user.id)
         .then((data) => {
            setPatient({
               ...data,
               allergies: data.allergies ? arrayToCSV(JSON.parse(data.allergies)) : null,
               chronicDisease: data.chronicDisease ? arrayToCSV(JSON.parse(data.allergies)) : null,
            });
         })
         .catch((error) => {
            console.log(error);
         });
   }, [user.id]);

   const form = useForm({
      initialValues: {
         dob: patient.dob ? new Date(patient.dob) : undefined,
         phone: patient.phone || "",
         address: patient.address || "",
         aadharNo: patient.aadharNo || "",
         bloodGroup: patient.bloodGroup || "",
         allergies: parseArray(patient.allergies) || [],
         chronicDisease: parseArray(patient.chronicDisease) || [],
      },
      validate: {
         dob: (value: any) => (!value ? "Date of Birth is required" : undefined),
         phone: (value: string) => (!value ? "Phone Number is required" : undefined),
         aadharNo: (value: string) => (!value ? "Aadhar Number is required" : undefined),
         address: (value: string) => (!value ? "Address is required" : undefined),
      },
   });

   const handleSubmit = (e: any) => {
      let values = form.getValues();
      form.validate();
      if (!form.isValid()) return;

      updatePatient({
         ...patient,
         ...values,
         allergies: values.allergies ? JSON.stringify(values.allergies) : null,
         chronicDisease: values.chronicDisease ? JSON.stringify(values.chronicDisease) : null,
      })
         .then((data) => {
            successNotification("Profile updated successfully");
            setPatient({ ...patient, ...values });
            setEdit(false);
         })
         .catch((error) => {
            errorNotification(error.response.data.errorMessage);
         });
   };

   const handleEdit = () => {
      form.setValues({
         ...patient,
         dob: patient.dob ? new Date(patient.dob) : undefined,
         chronicDisease: parseArray(patient.chronicDisease),
         allergies: parseArray(patient.allergies),
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
                        <Table.Td className="text-xl">{formatDate(patient.dob) ?? "-"}</Table.Td>
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
                        <Table.Td className="text-xl">{patient.phone ?? "-"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Address</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <TextInput placeholder="Enter your address" {...form.getInputProps("address")} />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{patient.address ?? "-"}</Table.Td>
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
                              {...form.getInputProps("aadharNo")}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{patient.aadharNo ?? "-"}</Table.Td>
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
                              {...form.getInputProps("bloodGroup")}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{bloodGroup[patient.bloodGroup] ?? "-"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Allergies</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <TagsInput
                              placeholder="Add allergy"
                              {...form.getInputProps("allergies")}
                              value={form.values.allergies || []}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{patient.allergies ?? "-"}</Table.Td>
                     )}
                  </Table.Tr>
                  <Table.Tr>
                     <Table.Td className="font-semibold text-xl">Chronic Diseases</Table.Td>

                     {edit ? (
                        <Table.Td className="text-xl">
                           <TagsInput
                              placeholder="Add chronic disease"
                              {...form.getInputProps("chronicDisease")}
                              value={form.values.chronicDisease || []}
                           />
                        </Table.Td>
                     ) : (
                        <Table.Td className="text-xl">{patient.chronicDiseases ?? "-"}</Table.Td>
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
         >
            <DropzoneButton />
         </Modal>
      </div>
   );
};

export default Profile;
