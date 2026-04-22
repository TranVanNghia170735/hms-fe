import { Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeJwt } from "../../Slices/JwtSlice";
import { removeUser } from "../../Slices/UserSlice";
import SideDrawer from "../SideDrawer/SideDrawer";
import ProfileMenu from "./ProfileMenu";

const Header = () => {
   const jwt = useSelector((state: any) => state.jwt);
   const dispatch = useDispatch();
   const handleLogout = () => {
      dispatch(removeJwt());
      dispatch(removeUser());
      // window.location.href = "/login";
   };

   const matches = useMediaQuery("(min-width: 768px)");
   return (
      <div className="bg-light shadow-lg w-full h-16 flex justify-between px-5 items-center">
         {matches && <SideDrawer />}

         <div className="flex gap-5 items-center">
            {jwt ? (
               <Button color="red" onClick={handleLogout}>
                  Logout
               </Button>
            ) : (
               <Link to="login">
                  <Button>Login</Button>
               </Link>
            )}
            {jwt && (
               <>
                  {/* <ActionIcon variant="transparent" size="md" aria-label="Settings">
                     <IconBellRinging style={{ width: "90%", height: "90%" }} stroke={2} />
                  </ActionIcon> */}
                  <ProfileMenu />
               </>
            )}
         </div>
      </div>
   );
};

export default Header;
