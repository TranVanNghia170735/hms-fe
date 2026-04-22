import { Avatar, Menu, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
   IconArrowsLeftRight,
   IconMessageCircle,
   IconPhoto,
   IconSearch,
   IconSettings,
   IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../Service/UserService";
import useProtectedImage from "../Utility/Dropzone/useProtectedImage";

function ProfileMenu() {
   const user = useSelector((state: any) => state.user);
   const [picId, setPicId] = useState<string | null>(null);

   useEffect(() => {
      if (!user) return;
      getUserProfile(user.id)
         .then((data) => {
            setPicId(data);
         })
         .catch((error) => {
            console.log(error);
         });
   }, [user]);

   const url = useProtectedImage(picId);
   const matches = useMediaQuery("(min-width: 768px)");
   return (
      <Menu shadow="md" width={200}>
         <Menu.Target>
            <div className="flex items-center gap-3 cursor-pointer">
               {!matches && <span className="font-medium text-lg text-neutral-900">{user?.name}</span>}
               <Avatar variant="filled" src={url} size={50} alt="it's me" />
            </div>
         </Menu.Target>

         <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item leftSection={<IconMessageCircle size={14} />}>Messages</Menu.Item>
            <Menu.Item leftSection={<IconPhoto size={14} />}>Gallery</Menu.Item>
            <Menu.Item
               leftSection={<IconSearch size={14} />}
               rightSection={
                  <Text size="xs" c="dimmed">
                     ⌘K
                  </Text>
               }
            >
               Search
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item leftSection={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
               Delete my account
            </Menu.Item>
         </Menu.Dropdown>
      </Menu>
   );
}
export default ProfileMenu;
