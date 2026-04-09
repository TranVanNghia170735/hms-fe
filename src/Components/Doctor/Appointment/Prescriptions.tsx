import { ActionIcon, Card, Divider, Grid, Modal, Text, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconMedicineSyrup, IconSearch } from "@tabler/icons-react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPrescriptionsByPatientId } from "../../../Service/AppointmentService";
import { formatDate } from "../../../Utility/DateUtility";

const Prescriptions = ({ appointment }: any) => {
   const navigate = useNavigate();
   const [data, setData] = useState<any[]>([]);
   const [opened, { open, close }] = useDisclosure(false);
   const [medicineData, setMedicineData] = useState<any>([]);
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

   useEffect(() => {
      getPrescriptionsByPatientId(appointment?.patientId)
         .then((res) => {
            setData(res);
         })
         .catch((err) => {
            console.log("Error fetching prescriptions:", err);
         });
   }, [appointment?.patientId]);

   const handleMedicine = (medicine: any) => {
      console.log("Medicine data:", medicine);
      open();
      setMedicineData(medicine);
   };

   const renderHeader = () => {
      return (
         <div className="flex flex-wrap gap-2 justify-end items-center">
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

            <ActionIcon color="red" onClick={() => handleMedicine(rowData.medicines)}>
               <IconMedicineSyrup size={20} stroke={1.5} />
            </ActionIcon>
         </div>
      );
   };
   return (
      <div>
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

            <Column
               field="prescriptionDate"
               header="Prescription Date"
               sortable
               body={(rowData) => formatDate(rowData.prescriptionDate)}
            />

            <Column field="medicine" header="Medicines" sortable body={(rowData) => rowData.medicines?.length ?? 0} />
            <Column field="notes" header="Notes" style={{ minWidth: "14rem" }} />
            <Column
               headerStyle={{ width: "5rem", textAlign: "center" }}
               bodyStyle={{ textAlign: "center", overflow: "visible" }}
               body={actionBodyTemplate}
            />
         </DataTable>
         <Modal opened={opened} size="xl" onClose={close} title="Medicines" centered>
            <div className="grid grid-cols-2 gap-5">
               {medicineData.map((data: any, index: number) => (
                  <Card shadow="md" radius="md" padding="lg" withBorder key={index}>
                     <Title order={4} mb="sm">
                        {data.name} ({data.type})
                     </Title>

                     <Divider my="sm" />

                     <Grid>
                        <Grid.Col span={6}>
                           <Text size="sm" fw={500}>
                              Dosage:
                           </Text>
                           <Text>{data.dosage}</Text>
                        </Grid.Col>

                        <Grid.Col span={6}>
                           <Text size="sm" fw={500}>
                              Frequency:
                           </Text>
                           <Text>{data.frequency}</Text>
                        </Grid.Col>

                        <Grid.Col span={6}>
                           <Text size="sm" fw={500}>
                              Duration:
                           </Text>
                           <Text>{data.duration} days</Text>
                        </Grid.Col>

                        <Grid.Col span={6}>
                           <Text size="sm" fw={500}>
                              Route:
                           </Text>
                           <Text>{data.route}</Text>
                        </Grid.Col>

                        <Grid.Col span={6}>
                           <Text size="sm" fw={500}>
                              Prescription ID:
                           </Text>
                           <Text>{data.prescriptionId}</Text>
                        </Grid.Col>

                        <Grid.Col span={6}>
                           <Text size="sm" fw={500}>
                              Medicine ID:
                           </Text>
                           <Text>{data.medicineId ?? "N/A"}</Text>
                        </Grid.Col>

                        <Grid.Col span={12}>
                           <Text size="sm" fw={500}>
                              Instructions:
                           </Text>
                           <Text>{data.instructions}</Text>
                        </Grid.Col>
                     </Grid>
                  </Card>
               ))}
            </div>
            {medicineData.length === 0 && (
               <Text color="dimmed" size="sm" mt="md">
                  No medicines found for this prescription.
               </Text>
            )}
         </Modal>
      </div>
   );
};

export default Prescriptions;
