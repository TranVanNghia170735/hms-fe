import {
   ActionIcon,
   Badge,
   Button,
   CheckIcon,
   Fieldset,
   Group,
   NumberInput,
   Select,
   SelectProps,
   TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconEdit, IconSearch } from "@tabler/icons-react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";
import { addStock, getAllStock, updateStock } from "../../../Service/InventoryService";
import { getAllMedicines } from "../../../Service/MedicineService";
import { errorNotification, successNotification } from "../../../Utility/NotificationUtil";

const Inventory = () => {
   const [data, setData] = useState<any[]>([]);
   const [medicine, setMedicine] = useState<any[]>([]);
   const [edit, setEdit] = useState<boolean>(true);
   const [filters, setFilters] = useState<DataTableFilterMeta>({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
   });
   const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});
   const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
   const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters: any = { ...filters };

      _filters["global"].value = value;
      setFilters(_filters);
      setGlobalFilterValue(value);
   };

   const [loading, setLoading] = useState(false);

   const form = useForm({
      initialValues: {
         id: null,
         medicineId: "",
         batchNo: "",
         quantity: 0,
         expiryDate: "",
      },
      validate: {
         medicineId: (value: any) => (value ? null : "Medicine ID is required"),
         batchNo: (value: any) => (value ? null : "Batch number is required"),
         quantity: (value: any) => (value > 0 ? null : "Quantity must be positive"),
         expiryDate: (value: any) => (value ? null : "Expiry date is required"),
      },
   });

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
      fetchData();
   }, []);

   const fetchData = () => {
      getAllStock()
         .then((res) => {
            setData(res);
         })
         .catch((err) => {
            console.log("Error fetching stocks:", err);
         });
   };

   const handleSubmit = (values: any) => {
      let method;
      let update = false;

      if (values.id) {
         update = true;
         method = updateStock;
      } else {
         method = addStock;
      }
      setLoading(true);
      method(values)
         .then((res) => {
            successNotification(`Stock ${update ? "updated" : "added"} successfully`);
            form.reset();
            setEdit(false);
            fetchData();
         })
         .catch((err) => {
            errorNotification(err?.response?.data?.errorMessage || `Failed to ${update ? "update" : "add"} stock`);
         })
         .finally(() => {
            setLoading(false);
         });
   };

   const renderHeader = () => {
      return (
         <div className="flex flex-wrap gap-2 justify-between items-center">
            <Button variant="filled" onClick={() => setEdit(true)}>
               Add Stock
            </Button>

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
            <ActionIcon onClick={() => onEdit(rowData)}>
               <IconEdit size={20} stroke={1.5} />
            </ActionIcon>
         </div>
      );
   };

   const onEdit = (rowData: any) => {
      console.log("Nghiatv8 test", medicineMap["" + rowData.medicineId]?.name);
      setEdit(true);
      form.setValues({
         ...rowData,
         medicineId: String(rowData.medicineId),
         batchNo: rowData.batchNo,
         quantity: rowData.quantity,
         expiryDate: new Date(rowData.expiryDate),
      });
   };

   const cancelButton = () => {
      form.reset();
      setEdit(false);
   };

   const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }: any) => (
      <Group flex="1" gap="xs">
         <div className="flex gap-5 items-center">
            {option.label}
            {option?.manufacturer && (
               <span style={{ marginLeft: "auto", fontSize: "0.8em", color: "gray" }}>{option.manufacturer}</span>
            )}
         </div>
         {checked && <CheckIcon style={{ marginInlineStart: "auto" }} />}
      </Group>
   );

   const statusBody = (rowData: any) => {
      const isExpired = new Date(rowData.expiryDate) < new Date();
      return <Badge color={isExpired ? "red" : "green"}>{isExpired ? "Expired" : "Active"}</Badge>;
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
               <Column
                  field="name"
                  header="Medicine"
                  body={(rowData: any) => (
                     <span>
                        {medicineMap["" + rowData.medicineId]?.name}
                        <span className="text-xs text-gray-600">
                           {medicineMap["" + rowData.medicineId]?.manufacturer}
                        </span>
                     </span>
                  )}
               />

               <Column field="batchNo" header="Batch No." />
               <Column field="initialQuantity" header="Quantity" />
               <Column field="quantity" header="Remaining Quantity" />
               <Column field="expiryDate" header="Expiry Date" />
               <Column field="status" header="Status" sortable body={statusBody} />
               <Column
                  headerStyle={{ textAlign: "center" }}
                  bodyStyle={{ textAlign: "center", overflow: "visible" }}
                  body={actionBodyTemplate}
               />
            </DataTable>
         ) : (
            <form className="grid gap-5" onSubmit={form.onSubmit(handleSubmit)}>
               <Fieldset
                  className="grid gap-4 grid-cols-1"
                  legend={<span className="text-lg font-medium text-primary-500">Medicine information</span>}
                  radius="md"
               >
                  <Select
                     renderOption={renderSelectOption}
                     {...form.getInputProps("medicineId")}
                     label="Medicine "
                     placeholder="Select medicine"
                     className="w-full"
                     data={medicine.map((item) => ({
                        ...item,
                        value: "" + item.id,
                        label: item.name,
                     }))}
                  />
                  <TextInput
                     {...form.getInputProps("batchNo")}
                     withAsterisk
                     label="Batch No"
                     placeholder="Enter batch number"
                     className="w-full"
                  />
                  <NumberInput
                     {...form.getInputProps("quantity")}
                     label="Quantity"
                     placeholder="Enter quantity"
                     className="w-full"
                     min={0}
                     clampBehavior="strict"
                  />

                  <DateInput
                     {...form.getInputProps("expiryDate")}
                     label="Expiry Date"
                     placeholder="Enter expiry date"
                     className="w-full"
                     withAsterisk
                     minDate={new Date()}
                  />
               </Fieldset>

               <div className="flex items-center gap-5 justify-center w-full">
                  <Button loading={loading} type="submit" variant="filled" color="primary">
                     {form.values.id ? "Update Stock" : "Add Stock"}
                  </Button>

                  <Button loading={loading} variant="filled" color="red" onClick={cancelButton}>
                     Cancel
                  </Button>
               </div>
            </form>
         )}
      </div>
   );
};

export default Inventory;
