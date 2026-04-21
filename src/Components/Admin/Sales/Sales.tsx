import {
   ActionIcon,
   Button,
   Card,
   CheckIcon,
   Divider,
   Fieldset,
   Grid,
   Group,
   LoadingOverlay,
   Modal,
   NumberInput,
   SegmentedControl,
   Select,
   SelectProps,
   Text,
   TextInput,
   Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { spotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import { IconEye, IconLayoutGrid, IconPlus, IconSearch, IconTable, IconTrack } from "@tabler/icons-react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useState } from "react";
import { freqMap } from "../../../Data/DropdownData";
import { getAllPrescriptions, getMedicinesByPrescriptionId } from "../../../Service/AppointmentService";
import { getAllMedicines } from "../../../Service/MedicineService";
import { addSales, getAllSaleItems, getAllSales } from "../../../Service/SalesService";
import { formatDate } from "../../../Utility/DateUtility";
import { errorNotification, successNotification } from "../../../Utility/NotificationUtil";
import SaleCard from "./SaleCard";

interface SaleItem {
   medicineId: string;
   quantity: number | undefined;
}

const Sales = () => {
   const [data, setData] = useState<any[]>([]);
   const [medicine, setMedicine] = useState<any[]>([]);
   const [edit, setEdit] = useState<boolean>(true);
   const [loading, setLoading] = useState(false);
   const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});

   const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
   const [filters, setFilters] = useState<DataTableFilterMeta>({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
   });
   const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters: any = { ...filters };

      _filters["global"].value = value;
      setFilters(_filters);
      setGlobalFilterValue(value);
   };

   const [opened, { open, close }] = useDisclosure(false);
   const [saleItems, setSaleItems] = useState<any[]>([]);
   const [actions, setActions] = useState<SpotlightActionData[]>([]);

   const [view, setView] = useState("table");

   const form = useForm({
      initialValues: {
         buyerName: "",
         buyerContact: "",
         saleItems: [{ medicineId: "", quantity: undefined }] as SaleItem[],
      },

      validate: {
         saleItems: {
            medicineId: (value: any) => (value ? null : "Medicine ID is required"),
            quantity: (value: any) => (value && Number(value) > 0 ? null : "Quantity must be positive"),
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

      getAllPrescriptions()
         .then((res) => {
            setActions(
               res.map((item: any) => ({
                  id: String(item.id),
                  label: item.patientName,
                  description: `Prescription by Dr. ${item.doctorName} on ${formatDate(item.prescriptionDate)}`,
                  onClick: () => handleImport(item),
               })),
            );
         })
         .catch((err) => {
            console.log("Error fetching prescriptions:", err);
         });
      fetchData();
   }, []);

   const handleImport = (item: any) => {
      setLoading(true);
      getMedicinesByPrescriptionId(item.id)
         .then((res) => {
            setSaleItems(res);
            form.setValues({
               buyerName: item.patientName,
               saleItems: res
                  .filter((x: any) => x.medicineId != null)
                  .map((x: any) => ({
                     medicineId: String(x.medicineId),
                     quantity: calculateQuantity(x.frequency, x.duration),
                  })),
            });
         })
         .catch((err) => {
            console.log("Error fetching medicines", err);
         })
         .finally(() => {
            setLoading(false);
         });
   };

   const calculateQuantity = (freq: string, duration: number) => {
      const freqValue = freqMap[freq] || 0;
      return Math.ceil(freqValue * duration);
   };

   const fetchData = () => {
      getAllSales()
         .then((res) => {
            setData(res);
         })
         .catch((err) => {
            console.log("Error fetching sales:", err);
         });
   };

   const handleSubmit = (values: any) => {
      let update = false;
      let flag = false;
      values.saleItems.forEach((item: any, index: number) => {
         if (item.quantity > (medicineMap[item.medicineId]?.stock || 0)) {
            flag = true;
            form.setFieldError(`saleItems.${index}.quantity`, "Quantity exceeds available stock");
         }
      });

      if (flag) {
         errorNotification("Quantity exceeds available stock");
         return;
      }
      const saleItems = values.saleItems.map((x: any) => ({
         ...x,
         unitPrice: medicineMap[x.medicineId]?.unitPrice,
      }));

      const totalAmount = saleItems.reduce((acc: number, item: any) => acc + item.unitPrice * item.quantity, 0);
      setLoading(true);
      addSales({ ...values, saleItems, totalAmount })
         .then((res: any) => {
            successNotification(`Medicine sold successfully`);
            form.reset();
            setEdit(false);
            fetchData();
         })
         .catch((err: any) => {
            errorNotification(err?.response?.data?.errorMessage || `Failed to sold Medicine`);
         })
         .finally(() => {
            setLoading(false);
         });
   };

   const handleDetail = (rowData: any) => {
      open();
      setLoading(true);
      getAllSaleItems(rowData.id)
         .then((res) => {
            setSaleItems(res);
         })
         .catch((err) => {
            console.error("Error fetching sale items:", err);
         })
         .finally(() => {
            setLoading(false);
         });
   };

   const onEdit = (rowData: any) => {
      setEdit(true);
      form.setValues({
         ...rowData,
         name: rowData.name,
         dosage: rowData.dosage,
         category: rowData.category,
         type: rowData.type,
         manufacturer: rowData.manufacturer,
         unitPrice: rowData.unitPrice,
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
            <ActionIcon onClick={() => handleDetail(rowData)}>
               <IconEye size={20} stroke={1.5} />
            </ActionIcon>
         </div>
      );
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
               <span style={{ marginLeft: "auto", fontSize: "0.8em", color: "gray" }}>
                  {option.manufacturer} - {option.dosage}
               </span>
            )}
         </div>
         {checked && <CheckIcon style={{ marginInlineStart: "auto" }} />}
      </Group>
   );

   const handleSpotlight = () => {
      spotlight.open();
   };

   const startToolbarTemplate = () => {
      return (
         <Button variant="filled" onClick={() => setEdit(true)}>
            Sell Medicine
         </Button>
      );
   };

   const rightToolbarTemplate = () => {
      return (
         <div className="flex flex-wrap gap-2 justify-end items-center">
            <SegmentedControl
               value={view}
               color="primary"
               onChange={setView}
               data={[
                  { label: <IconTable />, value: "table" },
                  { label: <IconLayoutGrid />, value: "card" },
               ]}
            />
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

   return (
      <>
         {!edit ? (
            <div>
               <Toolbar className="mb-4 !p-1" start={startToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
               {view == "table" ? (
                  <DataTable
                     stripedRows
                     value={data}
                     size="small"
                     paginator
                     removableSort
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
                     <Column field="buyerName" header="Buyer" />
                     <Column field="buyerContact" header="Contact" />
                     <Column field="totalAmount" header="Total Amount" sortable />
                     <Column
                        field="saleDate"
                        header="Sale Date"
                        body={(rowData) => formatDate(rowData.saleData)}
                        sortable
                     />
                     <Column
                        headerStyle={{ textAlign: "center" }}
                        bodyStyle={{ textAlign: "center", overflow: "visible" }}
                        body={actionBodyTemplate}
                     />
                  </DataTable>
               ) : (
                  <div className="grid grid-cols-4 gap-5">
                     {data?.map((appointment) => (
                        <SaleCard key={appointment.id} {...appointment} onView={() => handleDetail(appointment)} />
                     ))}

                     {data.length === 0 && <div className="col-span-4 text-center text-gray-500"> No sales found</div>}
                  </div>
               )}
            </div>
         ) : (
            <div>
               <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl text-primary-500 font-medium">Sell Medicine</h3>
                  <Button variant="filled" onClick={handleSpotlight} leftSection={<IconPlus />}>
                     Import Prescript
                  </Button>
               </div>
               <form className="grid gap-5" onSubmit={form.onSubmit(handleSubmit)}>
                  <LoadingOverlay visible={loading} />
                  <Fieldset
                     className="grid gap-5 w-full"
                     legend={<span className="text-lg font-medium text-primary-500">Buyer information</span>}
                     radius="md"
                  >
                     <div className="grid grid-cols-2 gap-5 w-full">
                        <TextInput
                           withAsterisk
                           label="Buyer Name"
                           placeholder="Enter buyer name"
                           {...form.getInputProps("buyerName")}
                           className="w-full"
                        />
                        <NumberInput
                           maxLength={10}
                           withAsterisk
                           label="Contact Number"
                           placeholder="Enter contact name"
                           {...form.getInputProps("buyerContact")}
                           className="w-full"
                        />
                     </div>
                  </Fieldset>

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
                                    data={medicine
                                       .filter(
                                          (x) =>
                                             !form.values.saleItems.some(
                                                (item1: any, idx) => item1.medicineId === x.id && idx !== index,
                                             ),
                                       )
                                       .map((item) => ({
                                          ...item,
                                          value: "" + item.id,
                                          label: item.name,
                                       }))}
                                 />
                              </div>
                              <div className="col-span-2 w-full">
                                 <NumberInput
                                    {...form.getInputProps(`saleItems.${index}.quantity`)}
                                    rightSectionWidth={80}
                                    label="Quantity"
                                    placeholder="Enter quantity"
                                    className="w-full"
                                    min={1}
                                    clampBehavior="strict"
                                    rightSection={
                                       <div className="text-xs flex gap-1 text-white font-medium rounded-md bg-red-400 p-1">
                                          Stock {medicineMap[item.medicineId]?.stock}
                                       </div>
                                    }
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
            </div>
         )}

         <Modal opened={opened} size="xl" onClose={close} title="Sole Medicines" centered>
            <div className="grid grid-cols-2 gap-5">
               {saleItems.map((data: any, index: number) => (
                  <Card shadow="md" radius="md" padding="lg" withBorder key={index}>
                     <Title order={4} mb="sm">
                        {medicineMap[data.medicinedId]?.name} - {medicineMap[data.medicineId]?.dosage}
                        <span className="text-gray-600">{medicineMap[data.medicineId]?.manufacturer} </span>
                     </Title>
                     <Text size="xs">{data.batchNo}</Text>
                     <Divider my="sm" />

                     <Grid>
                        <Grid.Col span={6}>
                           <Text size="sm" fw={500}>
                              Quantity:
                           </Text>
                           <Text>{data.quantity}</Text>
                        </Grid.Col>

                        <Grid.Col span={6}>
                           <Text size="sm" fw={500}>
                              Unit Price:
                           </Text>
                           <Text>{data.unitPrice}</Text>
                        </Grid.Col>

                        <Grid.Col span={6}>
                           <Text size="sm" fw={500}>
                              Total:
                           </Text>
                           <Text>$ {data.quantity * data.unitPrice}</Text>
                        </Grid.Col>
                     </Grid>
                  </Card>
               ))}
            </div>
            {saleItems.length === 0 && (
               <Text color="dimmed" size="sm" mt="md">
                  No medicines found for this prescription.
               </Text>
            )}
         </Modal>
         <Spotlight
            actions={actions}
            nothingFound="Nothing found..."
            highlightQuery
            searchProps={{
               leftSection: <IconSearch size={20} stroke={1.5} />,
               placeholder: "Search...",
            }}
         />
      </>
   );
};

export default Sales;
