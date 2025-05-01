import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase"; // Importa a configuração do Firebase
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // Para redirecionar para o checkout
import { signOut, onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Products.css";

function Products() {
    const [produtos, setProdutos] = useState([]);
    const [user, setUser] = useState(null);
    const { addToCart, cart } = useContext(CartContext); // Obtém o estado do carrinho
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica o estado de autenticação
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Atualiza o estado com o cliente logado
        });

        return () => unsubscribe(); // Limpa o listener ao desmontar o componente
    }, []);

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
            <header className="products-header-bar">
  <h4>
    <i className="bi bi-box-seam"></i> Produtos
  </h4>
  <div className="d-flex align-items-center">
    <div className="cart-icon me-3" onClick={() => navigate("/Checkout")}>
      <i className="bi bi-cart-fill"></i>
      {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
    </div>
    {user && ( // Exibe o ícone de logout apenas se o cliente estiver logado
                        <div className="logout-icon" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right"></i>
                        </div>
                    )}
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
    backgroundColor: "#333",
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