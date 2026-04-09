import { ActionIcon, Button, Fieldset, MultiSelect, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { dosageFrequencies, symptoms, tests } from "../../../Data/DropdownData";
import { createAppointmentReport } from "../../../Service/AppointmentService";
import { errorNotification, successNotification } from "../../../Utility/NotificationUtil";

type Medicine = {
   name: string;
   medicineId?: number;
   dosage: string;
   frequency: string;
   duration: number;
   route: string;
   type: string;
   instructions: string;
   prescriptionId?: string;
};

const ApReport = ({ appointment }: any) => {
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);
   const form = useForm({
      initialValues: {
         symptoms: [],
         tests: [],
         diagnosis: "",
         referral: "",
         notes: "",
         prescription: {
            medicines: [] as Medicine[],
         },
      },
      validate: {
         symptoms: (value: any) => (value.length > 0 ? null : "Please select at least one symptom"),
         diagnosis: (value: any) => (value.trim() ? null : "Diagnosis is required"),
         prescription: {
            medicines: {
               name: (value: any) => (value.trim() ? null : "Medicine name is required"),
               dosage: (value: any) => (value.trim() ? null : "Dosage is required"),
               frequency: (value: any) => (value.trim() ? null : "Frequency is required"),
               duration: (value: any) => (value > 0 ? null : "Duration must be greater than 0"),
               route: (value: any) => (value ? null : "Route is required"),
               type: (value: any) => (value ? null : "Type is required"),
               instructions: (value: any) => (value.trim() ? null : "Instructions are required"),
            },
         },
      },
   });

   const insertMedicine = (medicine: any) => {
      form.insertListItem("prescription.medicines", {
         name: "",
         dosage: "",
         frequency: "",
         duration: 0,
         route: "",
         type: "",
         instructions: "",
      });
   };

   const removeMedicine = (index: number) => {
      form.removeListItem("prescription.medicines", index);
   };

   const handleSubmit = (values: typeof form.values) => {
      console.log("Form values:", values);
      let data = {
         ...values,
         doctorId: appointment.doctorId,
         patientId: appointment.patientId,
         appointmentId: appointment.id,
         prescription: {
            ...values.prescription,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            appointmentId: appointment.id,
         },
      };
      setLoading(true);
      createAppointmentReport(data)
         .then((res) => {
            successNotification("Report created successfully");
            form.reset();
         })
         .catch((err) => {
            errorNotification(err?.response?.data?.errorMessage || "Error creating report");
         })
         .finally(() => {
            setLoading(false);
         });
   };

   return (
      <form onSubmit={form.onSubmit(handleSubmit)} className="grid gap-5">
         <Fieldset
            className="grid gap-4 grid-cols-1"
            legend={<span className="text-lg font-medium text-primary-500">Personal information</span>}
            radius="md"
         >
            <MultiSelect
               {...form.getInputProps("symptoms")}
               withAsterisk
               label="Symptoms"
               placeholder="Pick symptoms"
               data={symptoms}
               className="w-full"
            />

            <MultiSelect
               {...form.getInputProps("tests")}
               label="Tests"
               placeholder="Pick tests"
               data={tests}
               className="w-full"
            />

            <TextInput
               {...form.getInputProps("diagnosis")}
               withAsterisk
               label="Diagnosis"
               placeholder="Enter diagnosis"
               className="w-full"
            />
            <TextInput
               {...form.getInputProps("referral")}
               label="Referral"
               placeholder="Enter referral details"
               className="w-full"
            />

            <Textarea
               {...form.getInputProps("notes")}
               label="Notes"
               placeholder="Enter any additional notes"
               className="w-full"
            />
         </Fieldset>

         <Fieldset
            className="grid gap-5 w-full"
            legend={<span className="text-lg font-medium text-primary-500">Prescription</span>}
            radius="md"
         >
            {form.values.prescription.medicines.map((_medicine, index) => (
               <Fieldset
                  legend={
                     <div className="flex items-center gap-5 w-full">
                        <h1 className="text-lg font-medium">Medicine {index + 1}</h1>
                        <ActionIcon
                           onClick={() => removeMedicine(index)}
                           variant="filled"
                           color="red"
                           size="md"
                           className="mb-2"
                        >
                           <IconTrash />
                        </ActionIcon>
                     </div>
                  }
                  className="grid gap-4 grid-cols-2"
               >
                  <TextInput
                     {...form.getInputProps(`prescription.medicines.${index}.name`)}
                     withAsterisk
                     label="Medicine"
                     placeholder="Enter medicine name"
                     className="w-full"
                  />
                  <TextInput
                     {...form.getInputProps(`prescription.medicines.${index}.dosage`)}
                     withAsterisk
                     label="Dosage"
                     placeholder="Enter dosage"
                     className="w-full"
                  />
                  <Select
                     {...form.getInputProps(`prescription.medicines.${index}.frequency`)}
                     withAsterisk
                     label="Frequency"
                     placeholder="Enter frequency"
                     data={dosageFrequencies}
                     className="w-full"
                  />
                  <NumberInput
                     {...form.getInputProps(`prescription.medicines.${index}.duration`)}
                     withAsterisk
                     label="Duration (days)"
                     placeholder="Enter duration in days"
                     className="w-full"
                  />
                  <Select
                     {...form.getInputProps(`prescription.medicines.${index}.route`)}
                     withAsterisk
                     label="Route"
                     placeholder="Select route"
                     data={["Oral", "Intravenous", "Topical", "Rectal"]}
                     className="w-full"
                  />

                  <Select
                     {...form.getInputProps(`prescription.medicines.${index}.type`)}
                     withAsterisk
                     label="Type"
                     placeholder="Select type"
                     data={["Tablet", "Syrup", "Injection", "Capsule", "Ointment"]}
                     className="w-full"
                  />
                  <TextInput
                     {...form.getInputProps(`prescription.medicines.${index}.instructions`)}
                     withAsterisk
                     label="Instructions"
                     placeholder="Enter instructions"
                     className="w-full"
                  />
               </Fieldset>
            ))}

            <div className="flex items-start col-span-2 justify-center w-full">
               <Button onClick={insertMedicine} variant="outline" color="primary" className="col-span-2">
                  Add Medicine
               </Button>
            </div>
            <div className="flex items-center gap-5 justify-center w-full">
               <Button loading={loading} type="submit" variant="filled" color="primary">
                  Submit Report
               </Button>

               <Button loading={loading} variant="filled" color="red">
                  Cancel
               </Button>
            </div>
         </Fieldset>
      </form>
   );
};

export default ApReport;
