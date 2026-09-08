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

 return (
   <div>Dashboard</div>
 );
}