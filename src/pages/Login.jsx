import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import "./Login.css";
import { Link } from "react-router-dom"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/gestao"); // Redireciona para a página de gestão após login bem-sucedido
    } catch (err) {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-entrar">
          Entrar
        </button>
      </form>

      <p className="cadastro-link">
        Não tem uma conta? <Link to="/salao-aguia-dourada/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default Login;
