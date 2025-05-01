import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from "chart.js";
import { collection, getDocs, deleteDoc, doc, updateDoc} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./AdicionarProdutos"
import "./Gestao.css";

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Gestao() {
  const [chartData, setChartData] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null); // Estado para o produto sendo editado
  const [form, setForm] = useState({ produto: "", valor: "", quantidadeVendida: "", quantidadeEstoque: "" });
    const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Produtos"));
      const labels = [];
      const data = [];
      const listaProdutos = [];

      querySnapshot.forEach((docItem) => {
        const { produto, quantidadeVendida, valor, quantidadeEstoque } = docItem.data();

        if (produto && !isNaN(quantidadeVendida)) {
          labels.push(produto);
          data.push(quantidadeVendida);
          listaProdutos.push({
            id: docItem.id,
            produto,
            quantidadeVendida,
            valor,
            quantidadeEstoque
          });
        }
      });

      setProdutos(listaProdutos);

      const formattedChartData = {
        labels,
        datasets: [
          {
            label: "Quantidade Vendida",
            data,
            backgroundColor: "#333",
            borderColor: "rgba(0,0,0,1)",
            borderWidth: 1
          }
        ]
      };

      setChartData(formattedChartData);
    } catch (error) {
      console.error("Erro ao buscar dados do Firestore:", error);
    }
  };

  const removerProduto = async (id) => {
    const confirmar = window.confirm("Deseja realmente remover este produto?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "Produtos", id));
      fetchData();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  const handleEditar = (item) => {
    setProdutoEditando(item.id);
    setForm({
      produto: item.produto,
      valor: item.valor,
      quantidadeVendida: item.quantidadeVendida,
      quantidadeEstoque: item.quantidadeEstoque
    });
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "Produtos", produtoEditando), {
        produto: form.produto,
        valor: parseFloat(form.valor),
        quantidadeVendida: parseInt(form.quantidadeVendida),
        quantidadeEstoque: parseInt(form.quantidadeEstoque)
      });
      setProdutoEditando(null);
      setForm({ produto: "", valor: "", quantidadeVendida: "", quantidadeEstoque: "" });
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  const handleCancelarEdicao = () => {
    setProdutoEditando(null);
    setForm({ produto: "", valor: "", quantidadeVendida: "", quantidadeEstoque: "" });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Produtos"
      }
    }
  };

  return (
    <div className="main-content">
      <h2>Gestão de Vendas</h2>
      <p>Aqui você pode acompanhar as vendas do salão.</p>

      <div style={{ height: "250px", width: "500px" }}>
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>Carregando dados...</p>
        )}
      </div>
      <br />
      <br />
      <br />
      <h5>Gestão de Produtos</h5>
      <button
  className="btn btn-add-product"
  onClick={() => navigate("/adicionar-produto")}
>
  <i className="bi bi-plus-circle"></i> Adicionar Produto
</button> 
      <br />
      <ul className="list-group">
        {produtos.map((item) => (
          <li key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center">
            {produtoEditando === item.id ? (
              <form onSubmit={handleSalvarEdicao} className="w-100 d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  value={form.produto}
                  onChange={(e) => setForm({ ...form, produto: e.target.value })}
                  required
                />
                <input
                  type="number"
                  className="form-control"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                  required
                />
                <input
                  type="number"
                  className="form-control"
                  value={form.quantidadeVendida}
                  onChange={(e) =>
                    setForm({ ...form, quantidadeVendida: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  className="form-control"
                  value={form.quantidadeEstoque}
                  onChange={(e) =>
                    setForm({ ...form, quantidadeEstoque: e.target.value })
                  }
                  required
                />
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-lg"></i>
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancelarEdicao}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </form>
            ) : (
              <>
                <div>
                  <strong>{item.produto}</strong> — Vendido: {item.quantidadeVendida} — Estoque: {item.quantidadeEstoque} — Valor: R$ {item.valor.toFixed(2)}
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEditar(item)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removerProduto(item.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Gestao;
