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
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus, IconSearch, IconTrack } from "@tabler/icons-react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { getAllMedicines } from "../../../Service/MedicineService";
import { addSales } from "../../../Service/SalesService";
import { errorNotification, successNotification } from "../../../Utility/NotificationUtil";

interface SaleItem {
   medicineId: string;
   quantity: number;
}

const Sales = () => {
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
         saleItems: [{ medicineId: "", quantity: 0 }] as SaleItem[],
      },

      validate: {
         saleItems: {
            medicineId: (value: any) => (value ? null : "Medicine ID is required"),
            quantity: (value: any) => (value > 0 ? null : "Quantity must be positive"),
         },
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
      // getAllStock()
      //    .then((res) => {
      //       setData(res);
      //    })
      //    .catch((err) => {
      //       console.log("Error fetching stocks:", err);
      //    });
   };

   const handleSubmit = (values: any) => {
      let update = false;

      setLoading(true);
      addSales(values)
         .then((res: any) => {
            successNotification(`Stock ${update ? "updated" : "added"} successfully`);
            form.reset();
            setEdit(false);
            fetchData();
         })
         .catch((err: any) => {
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
               Sell Medicine
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

   const addMore = () => {
      form.insertListItem("saleItems", { medicineId: "", quantity: 0 });
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
      <>
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
                  className="grid gap-5 w-full"
                  legend={<span className="text-lg font-medium text-primary-500">Medicine information</span>}
                  radius="md"
               >
                  <div className="grid gap-4 grid-cols-5 w-full">
                     {form.values.saleItems.map((item, index) => (
                        <React.Fragment key={index}>
                           <div className="col-span-2 w-full">
                              <Select
                                 renderOption={renderSelectOption}
                                 {...form.getInputProps(`saleItems.${index}.medicineId`)}
                                 label="Medicine "
                                 placeholder="Select medicine"
                                 className="w-full"
                                 data={medicine.map((item) => ({
                                    ...item,
                                    value: "" + item.id,
                                    label: item.name,
                                 }))}
                              />
                           </div>
                           <div className="col-span-2 w-full">
                              <NumberInput
                                 {...form.getInputProps(`saleItems.${index}.quantity`)}
                                 label="Quantity"
                                 placeholder="Enter quantity"
                                 className="w-full"
                                 min={0}
                                 max={50}
                                 clampBehavior="strict"
                              />
                           </div>

                           <div className="flex item-end justify-between">
                              {item.quantity && item.medicineId ? (
                                 <div>
                                    Total: {item.quantity} X {medicineMap[item.medicineId]?.unitPrice} =
                                    {item.quantity * medicineMap[item.medicineId]?.unitPrice}
                                 </div>
                              ) : (
                                 <div> </div>
                              )}

                              <ActionIcon color="red" onClick={() => form.removeListItem("saleItems", index)}>
                                 <IconTrack size={16} />
                              </ActionIcon>
                           </div>
                        </React.Fragment>
                     ))}
                  </div>
                  <div className="flex item-center justify-center w-full">
                     <Button variant="outline" leftSection={<IconPlus size={16} />} onClick={addMore}>
                        Add more
                     </Button>
                  </div>
               </Fieldset>

               <div className="flex items-center gap-5 justify-center w-full">
                  <Button loading={loading} type="submit" variant="filled" color="primary">
                     Sell Medicine
                  </Button>

                  <Button loading={loading} variant="filled" color="red" onClick={cancelButton}>
                     Cancel
                  </Button>
               </div>
            </form>
         )}
      </>
   );
};

export default Sales;
