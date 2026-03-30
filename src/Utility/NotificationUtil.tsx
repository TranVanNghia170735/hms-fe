import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

const successNotification = (message: string) => {
   notifications.show({
      title: "Success",
      position: "top-right",
      message: message,
      color: "teal",
      icon: <IconCheck />,
      autoClose: 5000,
      withCloseButton: true,
      className: "border-green-500 z-50",
      withBorder: true,
   });
};

const errorNotification = (message: string) => {
   notifications.show({
      title: "Error",
      position: "top-right",
      message: message,
      color: "red",
      autoClose: 5000,
      withCloseButton: true,
      className: "border-red-500 z-50",
      withBorder: true,
      icon: <IconCheck />,
   });
};

export { successNotification, errorNotification };
