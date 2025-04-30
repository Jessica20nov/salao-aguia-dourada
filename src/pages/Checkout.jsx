import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Checkout.css";
import { Navigate, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.valor, 0);

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h3 className="text-center mb-3">Resumo do Pedido</h3>
        {cart.length === 0 ? (
          <p className="text-center">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="list-group list-group-flush">
              {cart.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {item.produto} - R$ {item.valor.toFixed(2)}
                  </span>
                  <button
                    className="btn btn-danger btn-sm btn-delete"
                    onClick={() => removeFromCart(item.id)} // Remove o produto do carrinho
                  >
                    <i className="bi bi-trash"></i> {/* Ícone de deletar */}
                  </button>
                </li>
              ))}
            </ul>
            <h4 className="text-center mt-3">Total: R$ {total.toFixed(2)}</h4>
            <button className="btn btn-success w-100 mt-3 btn-finalizar" onClick={() => navigate("/FinalizarCompra")}>
              Finalizar Compra
            </button>
          </>
        )}

      </div>
    </div>


  );
};




export default Checkout;