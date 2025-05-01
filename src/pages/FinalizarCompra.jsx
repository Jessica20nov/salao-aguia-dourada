import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { CartContext } from "../context/CartContext"; // Certifique-se de que o contexto do carrinho está configurado
import "./FinalizarCompra.css";

const FinalizarCompra = () => {
  const [user, loading] = useAuthState(auth); // Verifica se o cliente está logado
  const [cliente, setCliente] = useState(null); // Armazena os dados do cliente
  const { cart, clearCart } = useContext(CartContext); // Obtém os produtos do carrinho e a função para limpá-lo
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

  const handleConfirmarCompra = async () => {
    try {
      // Atualiza os produtos no Firestore
      for (const item of cart) {
        const produtoRef = doc(db, "Produtos", item.id);
        const produtoDoc = await getDoc(produtoRef);

        if (produtoDoc.exists()) {
          const produtoData = produtoDoc.data();
           // Verifica se há estoque suficiente
        if (produtoData.quantidadeEstoque > 0) {
          await updateDoc(produtoRef, {
            quantidadeVendida: produtoData.quantidadeVendida + 1, // Incrementa a quantidade vendida
            quantidadeEstoque: produtoData.quantidadeEstoque - 1, // Diminui a quantidade em estoque
          });
        } else {
          alert(`O produto "${produtoData.produto}" está sem estoque!`);
        }
      }
    }

      // Limpa o carrinho após a compra
      clearCart();

      alert("Compra finalizada com sucesso! Você receberá mais informações no e-mail.");
      navigate("/products"); // Redireciona para a página de produtos
    } catch (error) {
      console.error("Erro ao confirmar a compra:", error);
      alert("Ocorreu um erro ao finalizar a compra. Tente novamente.");
    }
  };

  if (loading) {
    return <p>Carregando...</p>; // Exibe um carregador enquanto verifica o login
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h5 className="text-center mb-3">Confirmação de Endereço</h5>
        {cliente ? (
          <>
            <p>
              <strong>Olá,</strong> {cliente.nome} {cliente.sobrenome}
            </p>
            <p>
              <strong>Endereço cadastrado para entrega:</strong>
            </p>
            <ul>
              <li>
                <strong>Rua:</strong> {cliente.endereco.rua}
              </li>
              <li>
                <strong>Bairro:</strong> {cliente.endereco.bairro}
              </li>
              <li>
                <strong>Cidade:</strong> {cliente.endereco.cidade}
              </li>
              <li>
                <strong>Estado:</strong> {cliente.endereco.estado}
              </li>
            </ul>
            <button
              className="btn btn-success btn-confirmar-compra mt-3"
              onClick={handleConfirmarCompra}
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