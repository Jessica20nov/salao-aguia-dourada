import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Importa o Firebase Authentication e Firestore
import "./Cadastro.css";

function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    endereco: {
      rua: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.endereco) {
      setForm({
        ...form,
        endereco: { ...form.endereco, [name]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.senha
      );

      // Salva os dados adicionais no Firestore
      await setDoc(doc(db, "Clientes", userCredential.user.uid), {
        nome: form.nome,
        sobrenome: form.sobrenome,
        email: form.email,
        endereco: form.endereco,
        isAdmin: false, // Define o usuário como cliente padrão
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/login"); // Redireciona para a página de login
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro</h2>
      <form onSubmit={handleCadastro}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Sobrenome:</label>
          <input
            type="text"
            name="sobrenome"
            value={form.sobrenome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Rua:</label>
          <input
            type="text"
            name="rua"
            value={form.endereco.rua}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Bairro:</label>
          <input
            type="text"
            name="bairro"
            value={form.endereco.bairro}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Cidade:</label>
          <input
            type="text"
            name="cidade"
            value={form.endereco.cidade}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Estado:</label>
          <input
            type="text"
            name="estado"
            value={form.endereco.estado}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Cadastrar
        </button>
        <button
        type="button"
        className="btn btn-voltar"
        onClick={() => navigate("/login")} // Redireciona para a página de Gestão
      >
        <i className="bi bi-arrow-left"></i> Voltar
      </button>
      </form>
    </div>
  );
}

export default Cadastro;