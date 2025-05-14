import './pages/App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import Sobre from './pages/Sobre';
import Gestao from './pages/Gestao';
import AdicionarProduto from "./pages/AdicionarProdutos";
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import { CartProvider } from './context/CartContext';
import Cadastro from './pages/Cadastro';
import FinalizarCompra from './pages/FinalizarCompra';

function App() {
  return (
    <CartProvider>
  <BrowserRouter basename='/salao-aguia-dourada/'>
    <div>
      <header className="header-bar">
        <h1>Salão</h1>
        <h1>Águia Dourada</h1>
    </header>
    </div>
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Sobre" element={<Sobre />} />
          <Route path="/Gestao" element={<ProtectedRoute adminOnly={true}><Gestao /></ProtectedRoute>} />
          <Route path="/adicionar-produto" element={<AdicionarProduto />} />
          <Route path="/FinalizarCompra" element={<FinalizarCompra/>} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>
  </CartProvider>
  );
}

export default App;
