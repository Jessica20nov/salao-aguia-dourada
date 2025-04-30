import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

function Sidebar() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "Clientes", user.uid));
        if (userDoc.exists()) {
            console.log("Dados do usuário:", userDoc.data());
          setIsAdmin(userDoc.data().isAdmin);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/products">Produtos</Link>
        </li>
        <li>
          <Link to="/checkout">Checkout</Link>
        </li>
        <li>
          <Link to="/sobre">Sobre</Link>
        </li>
        {isAdmin && ( // Exibe a página de Gestão apenas para administradores
          <li>
            <Link to="/gestao">Gestão</Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;