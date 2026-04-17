import {
   ActionIcon,
   Button,
   CheckIcon,
   Fieldset,
   Group,
   MultiSelect,
   NumberInput,
   Select,
   SelectProps,
   Textarea,
   TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconSearch, IconTrash } from "@tabler/icons-react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dosageFrequencies, medicineTypes, symptoms, tests } from "../../../Data/DropdownData";
import { createAppointmentReport, getReportsByPatientId, isReportExists } from "../../../Service/AppointmentService";
import { getAllMedicines } from "../../../Service/MedicineService";
import { formatDate } from "../../../Utility/DateUtility";
import { errorNotification, successNotification } from "../../../Utility/NotificationUtil";

type Medicine = {
   name: string | null;
   medicineId?: string | number | undefined;
   dosage: string | null;
   frequency: string | null;
   duration: number | null;
   route: string | null;
   type: string | null;
   instructions: string | null;
   prescriptionId?: string | null;
};

const ApReport = ({ appointment }: any) => {
   const navigate = useNavigate();
   const [data, setData] = useState<any[]>([]);
   const [allowAdd, setAllowAdd] = useState<boolean>(false);
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
   const [medicine, setMedicine] = useState<any[]>([]);
   const [edit, setEdit] = useState<boolean>(true);
   const [loading, setLoading] = useState(false);
   const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});

   useEffect(() => {
      fetchData();
   }, [appointment.id, appointment?.patientId]);

   useEffect(() => {
      getAllMedicines()
         .then((res) => {
            setMedicine(res);
            setMedicineMap(
               res.reduce((acc: any, item: any) => {
                  acc[String(item.id)] = item;
                  return acc;
               }, {}),
            );
         })
         .catch((err) => {
            console.log("Error fetching medicines:", err);
         });
   }, []);

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
               // route: (value: any) => (value ? null : "Route is required"),
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
            medicines: values.prescription.medicines.map((med) => ({
               ...med,
               medicineId: med.medicineId === "OTHER" ? null : med.medicineId,
            })),
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

   const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }: any) => (
      <Group flex="1" gap="xs">
         <div className="flex gap-5 items-center">
            {option.label}
            {option?.manufacturer && (
               <span style={{ marginLeft: "auto", fontSize: "0.8em", color: "gray" }}>
                  {option.manufacturer} - {option.dosage}
               </span>
            )}
         </div>
         {checked && <CheckIcon style={{ marginInlineStart: "auto" }} />}
      </Group>
   );

   const handleChangeMed = (medId: any, index: number) => {
      if (medId && medId !== "OTHER") {
         form.setFieldValue(`prescription.medicines.${index}.medicineId`, medId);
         form.setFieldValue(`prescription.medicines.${index}.name`, medicineMap[medId]?.name || "");
         form.setFieldValue(`prescription.medicines.${index}.dosage`, medicineMap[medId]?.dosage || "");
         form.setFieldValue(`prescription.medicines.${index}.type`, medicineMap[medId]?.type || "");
      } else {
         form.setFieldValue(`prescription.medicines.${index}.medicineId`, "OTHER");
         form.setFieldValue(`prescription.medicines.${index}.name`, null);
         form.setFieldValue(`prescription.medicines.${index}.dosage`, null);
         form.setFieldValue(`prescription.medicines.${index}.type`, null);
      }
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
                  {form.values.prescription.medicines.map((med, index) => (
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
                        <Select
                           renderOption={renderSelectOption}
                           {...form.getInputProps(`prescription.medicines.${index}.medicineId`)}
                           label="Medicine "
                           placeholder="Select medicine"
                           className="w-full"
                           data={[
                              ...medicine
                                 .filter(
                                    (x: any) =>
                                       !form.values.prescription.medicines.some(
                                          (item1: any, idx) => item1.medicineId === x.id && idx !== index,
                                       ),
                                 )
                                 .map((item) => ({
                                    ...item,
                                    value: "" + item.id,
                                    label: item.name,
                                 })),
                              { label: "Other", value: "OTHER" },
                           ]}
                           onChange={(value: any) => handleChangeMed(value, index)}
                           withAsterisk
                        />
                        {med.medicineId === "OTHER" && (
                           <TextInput
                              {...form.getInputProps(`prescription.medicines.${index}.name`)}
                              withAsterisk
                              label="Medicine"
                              placeholder="Enter medicine name"
                              className="w-full"
                           />
                        )}
                        <TextInput
                           disabled={med.medicineId === "OTHER"}
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
                        {/* <Select
                           {...form.getInputProps(`prescription.medicines.${index}.route`)}
                           withAsterisk
                           label="Route"
                           placeholder="Select route"
                           data={["Oral", "Intravenous", "Topical", "Rectal"]}
                           className="w-full"
                        /> */}

                        <Select
                           {...form.getInputProps(`prescription.medicines.${index}.type`)}
                           withAsterisk
                           label="Type"
                           placeholder="Select type"
                           data={medicineTypes}
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
