import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Perfil.css';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8088/User")
      .then(res => {
        if (res.data.Status === "Success") {
          setUser(res.data.user);
        } else {
          setError("Erro ao carregar dados do usuário");
        }
      })
      .catch(err => {
        setError("Erro na requisição: " + err.message);
      });
  }, []);

  const handleLogout = () => {
    axios.get("http://localhost:8088/Logout")
      .then(res => {
        if (res.data.Status === "Success") {
          window.location.reload(true);
        } else {
          alert("Erro ao sair");
        }
      })
      .catch(err => console.log(err));
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="perfil-main">
      <h1>Perfil do Usuário</h1>
      <div className="accordion">
        <div className="accordion-item">
          <div className="accordion-button" onClick={() => toggleAccordion(0)}>
            <h2>Informações do Usuário</h2>
          </div>
          {activeIndex === 0 && (
            <div className="accordion-content">
              {user ? (
                <>
                  <p>ID: {user.ID}</p>
                  <p>Nome: {user.Nome}</p>
                  <p>Email: {user.Email}</p>
                  <p>Senha: {user.Senha}</p>
                </>
              ) : (
                <p>Login não realizado!</p>
              )}
            </div>
          )}
        </div>
        <div className="accordion-item">
          <div className="accordion-button" onClick={() => toggleAccordion(1)}>
            <h2>Registro de Livros Alugados</h2>
          </div>
          {activeIndex === 1 && (
            <div className="accordion-content">
              <p>Futuro registro de livros alugados.</p>
            </div>
          )}
        </div>
        <div className="accordion-item">
          <div className="accordion-button" onClick={() => toggleAccordion(2)}>
            <h2>Futuros Eventos</h2>
          </div>
          {activeIndex === 2 && (
            <div className="accordion-content">
              <p>Futuros eventos que participou/participa.</p>
            </div>
          )}
        </div>
      </div>
      {user ? (
        <button onClick={handleLogout} className=" btn sair">Sair</button>
      ) : (
        <button onClick={() => navigate('/login')} className="btn">Login</button>
      )}
    </main>
  );
}
