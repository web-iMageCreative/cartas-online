import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MenusServices from './MenusService';

export default function MenusList() {
  const { business_slug } = useParams();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    MenusServices.listMenu(business_slug)
      .then((data) => {
        setMenus(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [business_slug]);

console.log("menus:", menus);
console.log("tipo:", typeof menus);
console.log("es array:", Array.isArray(menus));

  return (
    <>
      <h1>Menús de {business_slug}</h1>

      {menus.map((menu) => (
        <div key={menu.id}>
          <h2>{menu.name}</h2>
          <p>{menu.description}</p>
        </div>
      ))}
    </>
  );
}







  