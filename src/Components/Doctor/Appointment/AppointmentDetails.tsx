import { Badge, Breadcrumbs, Card, Divider, Group, Tabs, Text, Title } from "@mantine/core";
import { IconClipboardHeart, IconStethoscope, IconVaccine } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAppointmentDetails } from "../../../Service/AppointmentService";
import { formatDateWithTime } from "../../../Utility/DateUtility";
import ApReport from "./ApReport";

const AppointmentDetails = () => {
   const { id } = useParams();
   const [appointment, setAppointment] = useState<any>({});

   useEffect(() => {
      getAppointmentDetails(id)
         .then((res) => {
            console.log("Appointment details fetched successfully:", res);
            setAppointment(res);
         })
         .catch((err) => {
            console.log("Error fetching appointment details:", err);
         });
   }, []);

   return (
      <div>
         <Breadcrumbs mb="md">
            <Link className="text-primary-400 hover:underline" to="/doctor/dashboard">
               Dashboard
            </Link>
            <Link className="text-primary-400 hover:underline" to="/doctor/appointments">
               Appointments
            </Link>
            <Text className="text-primary-400">Details</Text>
         </Breadcrumbs>

         <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="sm">
               <Title order={2}>{appointment.patientName}</Title>
               <Badge color={appointment.status === "CANCELLED" ? "red" : "green"} variant="light">
                  {appointment.status}
               </Badge>
            </Group>

            <div className="grid grid-cols-2 gap-5">
               <Text>
                  <strong>Email:</strong> {appointment.patientEmail}
               </Text>
               <Text>
                  <strong>Phone:</strong> {appointment.patientPhone}
               </Text>
            </div>

            <div className="grid grid-cols-2 gap-5">
               <Text>
                  <strong>Reason:</strong> {appointment.reason}
               </Text>
               <Text>
                  <strong>Appointment Time:</strong> {formatDateWithTime(appointment.appointmentTime)}
               </Text>
            </div>

            {appointment.notes && (
               <Text mt="sm" color="dimed" size="sm">
                  <strong>Notes:</strong> {appointment.notes}
               </Text>
            )}
         </Card>

         <Tabs variant="pills" my="md" defaultValue="medical">
            <Tabs.List>
               <Tabs.Tab value="medical" leftSection={<IconStethoscope size={20} />}>
                  Medical History
               </Tabs.Tab>
               <Tabs.Tab value="prescriptions" leftSection={<IconVaccine size={20} />}>
                  Prescriptions
               </Tabs.Tab>
               <Tabs.Tab value="reports" leftSection={<IconClipboardHeart size={20} />}>
                  Reports
               </Tabs.Tab>
            </Tabs.List>
            <Divider my="md" />
            <Tabs.Panel value="medical">Medical</Tabs.Panel>

            <Tabs.Panel value="prescriptions">Prescriptions</Tabs.Panel>

            <Tabs.Panel value="reports">
               <ApReport />
            </Tabs.Panel>
         </Tabs>
      </div>
   );
};

export default AppointmentDetails;
