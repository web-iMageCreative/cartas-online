import { Button } from "@mantine/core";
import { authService } from "./users/authService";

export default function Dashboard() {
 return (
   <>
   <div>Dashboard</div>
   <Button variant="outline" color="red" onClick={ () => {authService.logout()} }>
      Cerrar sesión
   </Button>
   </>
 );
}