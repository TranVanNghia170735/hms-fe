import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Calendar } from "primereact/calendar";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { ProgressBar } from "primereact/progressbar";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { Tag } from "primereact/tag";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { appointmentReasons } from "../../../Data/DropdownData";
import { getDoctorDropdown } from "../../../Service/DoctorProfileService";

interface Country {
   name: string;
   code: string;
}

interface Representative {
   name: string;
   image: string;
}

interface Customer {
   id: number;
   name: string;
   country: Country;
   company: string;
   date: string | Date;
   status: string;
   verified: boolean;
   activity: number;
   representative: Representative;
   balance: number;
}

export default function Appointment() {
   const [opened, { open, close }] = useDisclosure(false);
   const [doctors, setDoctors] = useState<any[]>([]);
   const [customers, setCustomers] = useState<Customer[]>([]);
   const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
   const user = useSelector((state: any) => state.user);
   const [filters, setFilters] = useState<DataTableFilterMeta>({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      "country.name": {
         operator: FilterOperator.AND,
         constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
      balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
   });
   const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
   const [representatives] = useState<Representative[]>([
      { name: "Amy Elsner", image: "amyelsner.png" },
      { name: "Anna Fali", image: "annafali.png" },
      { name: "Asiya Javayant", image: "asiyajavayant.png" },
      { name: "Bernardo Dominic", image: "bernardodominic.png" },
      { name: "Elwin Sharvill", image: "elwinsharvill.png" },
      { name: "Ioni Bowcher", image: "ionibowcher.png" },
      { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
      { name: "Onyama Limba", image: "onyamalimba.png" },
      { name: "Stephen Shaw", image: "stephenshaw.png" },
      { name: "XuXue Feng", image: "xuxuefeng.png" },
   ]);
   const [statuses] = useState<string[]>(["unqualified", "qualified", "new", "negotiation", "renewal"]);

   const getSeverity = (status: string) => {
      switch (status) {
         case "unqualified":
            return "danger";

         case "qualified":
            return "success";

         case "new":
            return "info";

         case "negotiation":
            return "warning";

         case "renewal":
            return null;
      }
   };

   useEffect(() => {
      // CustomerService.getCustomersLarge().then((data) => setCustomers(getCustomers(data)));
      setCustomers([
         {
            id: 1000,
            name: "James Butt",
            country: {
               name: "Algeria",
               code: "dz",
            },
            company: "Benton, John B Jr",
            date: "2015-09-13",
            status: "unqualified",
            verified: true,
            activity: 17,
            representative: {
               name: "Ioni Bowcher",
               image: "ionibowcher.png",
            },
            balance: 70663,
         },
         {
            id: 1001,
            name: "Anna Smith",
            country: {
               name: "Germany",
               code: "de",
            },
            company: "Smith Logistics",
            date: "2018-03-22",
            status: "qualified",
            verified: false,
            activity: 45,
            representative: {
               name: "Anna Fali",
               image: "annafali.png",
            },
            balance: 45200,
         },
         {
            id: 1002,
            name: "Carlos Diaz",
            country: {
               name: "Mexico",
               code: "mx",
            },
            company: "Diaz Corp",
            date: "2020-11-10",
            status: "new",
            verified: true,
            activity: 60,
            representative: {
               name: "Asiya Javayant",
               image: "asiyajavayant.png",
            },
            balance: 12300,
         },
         {
            id: 1003,
            name: "Liam Johnson",
            country: {
               name: "United States",
               code: "us",
            },
            company: "Johnson & Co",
            date: "2017-06-05",
            status: "negotiation",
            verified: false,
            activity: 30,
            representative: {
               name: "Bernardo Dominic",
               image: "bernardodominic.png",
            },
            balance: 88000,
         },
         {
            id: 1004,
            name: "Yuki Tanaka",
            country: {
               name: "Japan",
               code: "jp",
            },
            company: "Tanaka Industries",
            date: "2021-01-15",
            status: "renewal",
            verified: true,
            activity: 75,
            representative: {
               name: "Elwin Sharvill",
               image: "elwinsharvill.png",
            },
            balance: 54000,
         },
      ]);
      getDoctorDropdown()
         .then((data) => {
            console.log("Doctor dropdown data:", data);
            setDoctors(data.map((doctor: any) => ({ label: doctor.name, value: "" + doctor.id })));
         })
         .catch((error) => {
            console.error("Error fetching doctor dropdown data:", error);
         });
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   const getCustomers = (data: Customer[]) => {
      return [...(data || [])].map((d) => {
         d.date = new Date(d.date);

         return d;
      });
   };

   const formatDate = (value: string | Date) => {
      return new Date(value).toLocaleDateString("en-US", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      });
   };

   const formatCurrency = (value: number) => {
      return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
   };

   const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters: any = { ...filters };

      _filters["global"].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
   };

   const form = useForm({
      initialValues: {
         doctorId: "",
         patientId: user.profileId,
         appointmentTime: new Date(),
         reason: "",
         notes: "",
      },

      validate: {
         doctorId: (value: string) => (!value ? "Doctor is required" : undefined),
         appointmentTime: (value: Date) => (!value ? "Appointment time is required" : undefined),
         reason: (value: string) => (!value ? "Reason for appointment is required" : undefined),
      },
   });

   const renderHeader = () => {
      return (
         <div className="flex flex-wrap gap-2 justify-between items-center">
            <Button leftSection={<IconPlus />} variant="filled" onClick={open}>
               Schedule Appointment
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

   const countryBodyTemplate = (rowData: Customer) => {
      return (
         <div className="flex align-items-center gap-2">
            <img
               alt="flag"
               src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
               className={`flag flag-${rowData.country.code}`}
               style={{ width: "24px" }}
            />
            <span>{rowData.country.name}</span>
         </div>
      );
   };

   const representativeBodyTemplate = (rowData: Customer) => {
      const representative = rowData.representative;

      return (
         <div className="flex align-items-center gap-2">
            <img
               alt={representative.name}
               src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`}
               width="32"
            />
            <span>{representative.name}</span>
         </div>
      );
   };

   const representativeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
      return (
         <React.Fragment>
            <div className="mb-3 font-bold">Agent Picker</div>
            <MultiSelect
               value={options.value}
               options={representatives}
               itemTemplate={representativesItemTemplate}
               onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)}
               optionLabel="name"
               placeholder="Any"
               className="p-column-filter"
            />
         </React.Fragment>
      );
   };

   const representativesItemTemplate = (option: Representative) => {
      return (
         <div className="flex align-items-center gap-2">
            <img
               alt={option.name}
               src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
               width="32"
            />
            <span>{option.name}</span>
         </div>
      );
   };

   const dateBodyTemplate = (rowData: Customer) => {
      return formatDate(rowData.date);
   };

   const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
      return (
         <Calendar
            value={options.value}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            dateFormat="mm/dd/yy"
            placeholder="mm/dd/yyyy"
            mask="99/99/9999"
         />
      );
   };

   const balanceBodyTemplate = (rowData: Customer) => {
      return formatCurrency(rowData.balance);
   };

   const balanceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
      return (
         <InputNumber
            value={options.value}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            mode="currency"
            currency="USD"
            locale="en-US"
         />
      );
   };

   const statusBodyTemplate = (rowData: Customer) => {
      return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
   };

   const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
      return (
         <Dropdown
            value={options.value}
            options={statuses}
            onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)}
            itemTemplate={statusItemTemplate}
            placeholder="Select One"
            className="p-column-filter"
            showClear
         />
      );
   };

   const statusItemTemplate = (option: string) => {
      return <Tag value={option} severity={getSeverity(option)} />;
   };

   const activityBodyTemplate = (rowData: Customer) => {
      return <ProgressBar value={rowData.activity} showValue={false} style={{ height: "6px" }}></ProgressBar>;
   };

   const activityFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
      return (
         <>
            <Slider
               value={options.value}
               onChange={(e: SliderChangeEvent) => options.filterCallback(e.value)}
               range
               className="m-3"
            ></Slider>
            <div className="flex align-items-center justify-content-between px-2">
               <span>{options.value ? options.value[0] : 0}</span>
               <span>{options.value ? options.value[1] : 100}</span>
            </div>
         </>
      );
   };

   const actionBodyTemplate = () => {
      return <Button type="button"></Button>;
   };

   const header = renderHeader();

   const handleSubmit = (e: any) => {
      const values = form.values;
      console.log("Form values:", values);
      // Here you can add the logic to submit the form data to your backend or perform any other actions needed
      close(); // Close the modal after submission
   };

   return (
      <div className="card">
         <DataTable
            value={customers}
            paginator
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="id"
            selectionMode="checkbox"
            selection={selectedCustomers}
            onSelectionChange={(e) => {
               const customers = e.value as Customer[];
               setSelectedCustomers(customers);
            }}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={["name", "country.name", "representative.name", "balance", "status"]}
            emptyMessage="No customers found."
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
         >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
            <Column
               field="name"
               header="Name"
               sortable
               filter
               filterPlaceholder="Search by name"
               style={{ minWidth: "14rem" }}
            />
            <Column
               field="country.name"
               header="Country"
               sortable
               filterField="country.name"
               style={{ minWidth: "14rem" }}
               body={countryBodyTemplate}
               filter
               filterPlaceholder="Search by country"
            />
            <Column
               header="Agent"
               sortable
               sortField="representative.name"
               filterField="representative"
               showFilterMatchModes={false}
               filterMenuStyle={{ width: "14rem" }}
               style={{ minWidth: "14rem" }}
               body={representativeBodyTemplate}
               filter
               filterElement={representativeFilterTemplate}
            />
            <Column
               field="date"
               header="Date"
               sortable
               filterField="date"
               dataType="date"
               style={{ minWidth: "12rem" }}
               body={dateBodyTemplate}
               filter
               filterElement={dateFilterTemplate}
            />
            <Column
               field="balance"
               header="Balance"
               sortable
               dataType="numeric"
               style={{ minWidth: "12rem" }}
               body={balanceBodyTemplate}
               filter
               filterElement={balanceFilterTemplate}
            />
            <Column
               field="status"
               header="Status"
               sortable
               filterMenuStyle={{ width: "14rem" }}
               style={{ minWidth: "12rem" }}
               body={statusBodyTemplate}
               filter
               filterElement={statusFilterTemplate}
            />
            <Column
               field="activity"
               header="Activity"
               sortable
               showFilterMatchModes={false}
               style={{ minWidth: "12rem" }}
               body={activityBodyTemplate}
               filter
               filterElement={activityFilterTemplate}
            />
            <Column
               headerStyle={{ width: "5rem", textAlign: "center" }}
               bodyStyle={{ textAlign: "center", overflow: "visible" }}
               body={actionBodyTemplate}
            />
         </DataTable>
         <Modal
            opened={opened}
            onClose={close}
            size="lg"
            title={<div className="text-xl font-semibold text-primary-500">Schedule Appointment</div>}
            centered
         >
            <form className="grid grid-cols-1 gap-5" onSubmit={form.onSubmit(handleSubmit)}>
               <Select
                  {...form.getInputProps("doctorId")}
                  withAsterisk
                  data={doctors}
                  label="Doctor"
                  placeholder="Select Doctor"
                  className="w-full"
               />
               <DatePickerInput
                  {...form.getInputProps("appointmentTime")}
                  withAsterisk
                  label="Appointment Time"
                  placeholder="Pick date"
                  className="w-full"
               />

               <Select
                  {...form.getInputProps("reason")}
                  withAsterisk
                  data={appointmentReasons}
                  label="Reason"
                  placeholder="Select Reason"
                  className="w-full"
               />

               <Textarea
                  {...form.getInputProps("notes")}
                  label="Additional Notes"
                  placeholder="Enter any additional notes"
                  className="w-full"
               />
               <Button type="submit" variant="filled" fullWidth>
                  Submit
               </Button>
            </form>
         </Modal>
      </div>
   );
}
