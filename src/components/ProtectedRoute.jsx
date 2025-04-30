import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function ProtectedRoute({ children, adminOnly = false }) {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = React.useState(true);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "Clientes", user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().isAdmin);
        }
      }
      setIsLoadingAdmin(false); 
    };

    fetchUserRole();
  }, [user]);

  if (loading || isLoadingAdmin) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/products" />; // Redireciona para outra página se não for admin
  }

  return children;
}

export default ProtectedRoute;