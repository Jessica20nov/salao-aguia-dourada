import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom'; 

function AdicionarProduto() {
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");
  const [quantidadeVendida, setQuantidadeVendida] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [imagem, setImagem] = useState(""); // Novo estado para a URL da imagem
  const navigate = useNavigate();

  // Função para adicionar o produto ao Firestore
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!produto || !valor || !quantidadeVendida || !quantidadeEstoque || !imagem) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await addDoc(collection(db, "Produtos"), {
        produto,
        valor: parseFloat(valor),
        quantidadeVendida: parseInt(quantidadeVendida, 10),
        quantidadeEstoque: parseInt(quantidadeEstoque, 10),
        imagem, // Adiciona a URL da imagem ao Firestore
      });

      alert("Produto adicionado com sucesso!");
      setProduto("");
      setValor("");
      setQuantidadeVendida("");
      setQuantidadeEstoque("");
      setImagem(""); // Limpa o campo da imagem
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  return (
    <form onSubmit={handleAddProduct}>
      <div>
        <label>Produto:</label>
        <input
          type="text"
          className="form-control"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Valor:</label>
        <input
          type="number"
          className="form-control"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Quantidade Vendida:</label>
        <input
          type="number"
          className="form-control"
          value={quantidadeVendida}
          onChange={(e) => setQuantidadeVendida(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Quantidade em Estoque:</label>
        <input
          type="number"
          className="form-control"
          value={quantidadeEstoque}
          onChange={(e) => setQuantidadeEstoque(e.target.value)}
          required
        />
      </div>
      <div>
        <label>URL da Imagem:</label>
        <input
          type="text"
          className="form-control"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
          required
        />
      </div>
      <br />
      <button type="submit" className="btn btn-secondary">Adicionar Produto</button>
      <button type="button" className="btn btn-secondary"
        onClick={() => navigate("/gestao")} // Redireciona para a página de Gestão
      >
        Voltar
      </button>
    </form>
  );
}

export default AdicionarProduto;