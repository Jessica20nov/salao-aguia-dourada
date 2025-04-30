import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const FinalizarCompra = () => {
  const [user, loading] = useAuthState(auth); // Verifica se o cliente está logado
  const [cliente, setCliente] = useState(null); // Armazena os dados do cliente
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      if (user) {
        try {
          const clienteDoc = await getDoc(doc(db, "Clientes", user.uid));
          if (clienteDoc.exists()) {
            setCliente(clienteDoc.data()); // Armazena os dados do cliente
          } else {
            console.error("Cliente não encontrado no banco de dados.");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do cliente:", error);
        }
      } else if (!loading) {
        navigate("/login"); // Redireciona para o login se o cliente não estiver logado
      }
    };

    fetchCliente();
  }, [user, loading, navigate]);

  if (loading) {
    return <p>Carregando...</p>; // Exibe um carregador enquanto verifica o login
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h3 className="text-center mb-3">Confirmação de Endereço</h3>
        {cliente ? (
          <>
            <p><strong>Olá,</strong> {cliente.nome} {cliente.sobrenome}</p>
            <p><strong>Endereço cadastrado para entrega:</strong></p>
            <ul>
              <li><strong>Rua:</strong> {cliente.endereco.rua}</li>
              <li><strong>Bairro:</strong> {cliente.endereco.bairro}</li>
              <li><strong>Cidade:</strong> {cliente.endereco.cidade}</li>
              <li><strong>Estado:</strong> {cliente.endereco.estado}</li>
            </ul>
            <button
              className="btn btn-success w-100 mt-3"
              onClick={() => alert("Compra finalizada com sucesso! Você receberá mais informações no e-mail.")}
            >
              Confirmar Compra
            </button>

            <div>
  <br></br>
  <br></br>
<h5 className="text-center mb-3">💰 Facilidade no pagamento! 💰</h5>
<p className="text-center">Pague no momento da entrega com a opção que mais combina com você:</p>
<ul className="list-group list-group-flush">
  <li className="list-group-item">✔ Cartão de débito</li>
  <li className="list-group-item">✔ Cartão de crédito</li>
  <li className="list-group-item">✔ Dinheiro</li>
  <li className="list-group-item">✔ Pix</li>
</ul>
</div>
          </>
        ) : (
          <p>Carregando informações do cliente...</p>
        )}
      </div>
    </div>

    
  );
};

export default FinalizarCompra;