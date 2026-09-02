import { Button } from "@mantine/core";
import { AuthService } from "./users/AuthService";
import { useEffect } from "react";

export default function Dashboard() {

  useEffect(() => {
    const checkToken = async () => {
      const token = await AuthService.getToken();
      console.log('Token en Dashboard:', token);
    };

    checkToken();
  }, []);

  const handleLogOut = async () => {
    await AuthService.logout();
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