import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./FinalizarCompra.css";

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
        <h5 className="text-center mb-3">Confirmação de Endereço</h5>
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
              className="btn btn-success btn-confirmar-compra mt-3"
              onClick={() => alert("Compra finalizada com sucesso! Você receberá mais informações no e-mail.")}
            >
              Confirmar Compra
            </button>

            <div className="pagamento-info">
              <br></br>
              <h5 className="text-center mb-3">💰 Facilidade no pagamento! 💰</h5>
              <p>Pague no momento da entrega com a opção que mais combina com você:</p>
              <ul>
                <li>✔ Cartão de débito</li>
                <li>✔ Cartão de crédito</li>
                <li>✔ Dinheiro</li>
                <li>✔ Pix</li>
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