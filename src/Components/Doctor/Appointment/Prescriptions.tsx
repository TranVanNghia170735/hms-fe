import { ActionIcon, TextInput } from "@mantine/core";
import { IconEye, IconSearch } from "@tabler/icons-react";
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
   const filteredAppointments: any[] = [];

   useEffect(() => {
      getPrescriptionsByPatientId(appointment?.patientId)
         .then((res) => {
            console.log("Prescriptions Data:", res);
            setData(res);
         })
         .catch((err) => {
            console.log("Error fetching prescriptions:", err);
         });
   }, [appointment?.patientId]);

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
      </div>
   );
};

export default Prescriptions;
