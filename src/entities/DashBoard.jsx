import { Button } from "@mantine/core";
import { authService } from "./users/authService";
import { useEffect } from "react";

export default function Dashboard() {

  useEffect(() => {
    const checkToken = async () => {
      const token = await authService.getToken();
      console.log('Token en Dashboard:', token);
    };

    checkToken();
  }, []);

  const handleLogOut = async () => {
    await authService.logout();
  }

 return (
   <>
   <div>Dashboard</div>
   <Button variant="outline" color="red" onClick={ () => {handleLogOut()} }>
      Cerrar sesión
   </Button>
   </>
 );
}