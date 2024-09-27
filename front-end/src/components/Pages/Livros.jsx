import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';

function Home() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch("http://localhost:8088/Livros")
      .then(res => res.json())
      .then(data => {
        setData(data);
      })
      .catch(err => console.error("Erro ao buscar dados:", err));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter(livro =>
    livro.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livro.categoria.toLowerCase().includes(searchTerm.toLowerCase())||
    livro.editora.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <div className="conteiner">
        <h1>Livros</h1>
        <input
          type="text"
          placeholder="Pesquisar livros..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      <div className="card">
        <Card categoria={data}></Card>
      </div>
    </main>
  );
}

export default Home;
