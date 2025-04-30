import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase"; // Importa a configuração do Firebase
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // Para redirecionar para o checkout
import { signOut } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Products.css";

function Products() {
    const [produtos, setProdutos] = useState([]);
    const { addToCart, cart } = useContext(CartContext); // Obtém o estado do carrinho
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Produtos"));
                const produtosData = [];
                querySnapshot.forEach((doc) => {
                    produtosData.push({ id: doc.id, ...doc.data() });
                });
                setProdutos(produtosData);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchProdutos();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Faz o logout do Firebase
            navigate("/login"); // Redireciona para a página de login
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    return (
        <div className="main-content">
            {/* Menu Superior */}
            <header className="products-header-bar d-flex justify-content-between align-items-center p-3">
    <h4 style={{ color: "black", margin: 0 }}>Produtos</h4>
    <div className="d-flex align-items-center">
        <div className="cart-icon me-3" onClick={() => navigate("/Checkout")}>
            <i className="bi bi-cart-fill"></i> {/* Ícone de carrinho */}
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>
        <div className="logout-icon" onClick={handleLogout} style={{ cursor: "pointer" }}>
            <i className="bi bi-box-arrow-right"></i> {/* Ícone de logout */}
        </div>
    </div>
</header>

            {/* Lista de Produtos */}
            <div className="products">
                {produtos.map((produto) => (
                    <div className="item" key={produto.id}>
                        <img src={produto.imagem} alt={produto.produto} />
                        <p>{produto.produto}</p>
                        <p>Valor: R$ {produto.valor.toFixed(2)}</p>
                        <button  style={{
    backgroundColor: "rgba(255, 215, 0)",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
  }} className="btn btn-primary btn-comprar" onClick={() => addToCart(produto)}>Comprar</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;