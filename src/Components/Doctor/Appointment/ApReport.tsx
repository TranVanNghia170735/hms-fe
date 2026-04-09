import { ActionIcon, Button, Fieldset, MultiSelect, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconSearch, IconTrash } from "@tabler/icons-react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dosageFrequencies, symptoms, tests } from "../../../Data/DropdownData";
import { createAppointmentReport, getReportsByPatientId, isReportExists } from "../../../Service/AppointmentService";
import { formatDate } from "../../../Utility/DateUtility";
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
   const navigate = useNavigate();
   const [data, setData] = useState<any[]>([]);
   const [allowAdd, setAllowAdd] = useState<boolean>(false);
   const [edit, setEdit] = useState<boolean>(false);
   const [filters, setFilters] = useState<DataTableFilterMeta>({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
   });
   const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
   const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters: any = { ...filters };

      _filters["global"].value = value;
      setFilters(_filters);
      setGlobalFilterValue(value);
   };

   const [loading, setLoading] = useState(false);
   useEffect(() => {
      fetchData();
   }, [appointment.id, appointment?.patientId]);

   const fetchData = () => {
      if (!appointment?.patientId) return;
      getReportsByPatientId(appointment?.patientId)
         .then((res) => {
            setData(res);
         })
         .catch((err) => {
            console.log("Error fetching reports:", err);
         });
      isReportExists(appointment.id)
         .then((res) => {
            setAllowAdd(!res);
         })
         .catch((err) => {
            setAllowAdd(true);
            setEdit(true);
         });
   };

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
            setEdit(false);
            setAllowAdd(false);
            fetchData();
         })
         .catch((err) => {
            errorNotification(err?.response?.data?.errorMessage || "Error creating report");
         })
         .finally(() => {
            setLoading(false);
         });
   };
   const renderHeader = () => {
      return (
         <div className="flex flex-wrap gap-2 justify-between items-center">
            {allowAdd && (
               <Button variant="filled" onClick={() => setEdit(true)}>
                  Add Report
               </Button>
            )}
            <TextInput
               leftSection={<IconSearch />}
               fw={500}
               value={globalFilterValue}
               onChange={onGlobalFilterChange}
               placeholder="Keyword Search"
            />
         </div>
      );
   };

   const header = renderHeader();

   const actionBodyTemplate = (rowData: any) => {
      return (
         <div className="flex gap-2">
            <ActionIcon onClick={() => navigate("/doctor/appointments/" + rowData.appointmentId)}>
               <IconEye size={20} stroke={1.5} />
            </ActionIcon>
         </div>
      );
   };

   return (
      <div>
         {!edit ? (
            <DataTable
               stripedRows
               value={data}
               size="small"
               paginator
               header={header}
               rows={10}
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
               rowsPerPageOptions={[10, 25, 50]}
               dataKey="id"
               filters={filters}
               filterDisplay="menu"
               globalFilterFields={["doctorName", "notes"]}
               emptyMessage="No appointment found."
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
               <Column field="doctorName" header="Doctor" />

               <Column field="diagnosis" header="Diagnosis" />

               <Column
                  field="reportDate"
                  header="Report Date"
                  sortable
                  body={(rowData) => formatDate(rowData.createdAt)}
               />
               <Column field="notes" header="Notes" style={{ minWidth: "14rem" }} />
               <Column
                  headerStyle={{ width: "5rem", textAlign: "center" }}
                  bodyStyle={{ textAlign: "center", overflow: "visible" }}
                  body={actionBodyTemplate}
               />
            </DataTable>
         ) : (
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
         )}
      </div>
   );
};

export default ApReport;
