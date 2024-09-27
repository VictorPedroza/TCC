import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../Card/Card';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8088')
      .then(res => {
        if (res.data.Message === 'Success') {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Message);
        }
      })
      .catch(error => {
        setMessage('Erro na requisição: ' + error.message);
      });
  }, []);

  const [Historia, setHistoria] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8088/Historia")
      .then(res => res.json())
      .then(Historia => setHistoria(Historia))
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, []);

  const [Biografias, setBiografias] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8088/Biografias")
      .then(res => res.json())
      .then(Biografias => setBiografias(Biografias))
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, []);

  return (
    <main>
      <header>
        {auth ? (
          <div className='head-home'>
            <h1>Seja Bem-Vindo</h1>
            <span>{name}</span>
          </div>
        ) : (
          <div className='head-home'>
            <div className="chamada">
              <h1>Entre no Mundo</h1>
              <h2>Da Leitura</h2>
            </div>
            <div className="buttons">
              <Link to='/Login'><button className='btn'>Entrar</button></Link>
              <Link to='/Register'><button className='btn btn-secondary'>Registrar-se</button></Link>
            </div>
          </div>
        )}
      </header>
      <div className="card-conteiner">
        <Card categoria={Historia}></Card>
      </div>
    </main>
  );
}

export default Home;
