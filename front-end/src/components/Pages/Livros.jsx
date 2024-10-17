import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './Livros.css';

function Livros() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(15); // Inicia com 15 livros para desktop

  // Detecta o tamanho da tela e ajusta a quantidade de livros por página
  useEffect(() => {
    const updateBooksPerPage = () => {
      if (window.innerWidth < 768) {
        setBooksPerPage(6); // Celulares
      } else if (window.innerWidth < 1024) {
        setBooksPerPage(9); // Tablets
      } else {
        setBooksPerPage(15); // Desktops
      }
    };

    // Chama a função uma vez ao montar o componente
    updateBooksPerPage();

    // Adiciona um listener para detectar mudanças no tamanho da janela
    window.addEventListener('resize', updateBooksPerPage);

    // Remove o listener ao desmontar o componente
    return () => {
      window.removeEventListener('resize', updateBooksPerPage);
    };
  }, []);

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
    setCurrentPage(1); // Resetar para a primeira página ao fazer uma nova busca
  };

  const filteredBooks = data.filter(book =>
    book.Nome && book.Nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBooks = searchTerm ? filteredBooks : data;
  const totalPages = Math.ceil(totalBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = totalBooks.slice(startIndex, startIndex + booksPerPage);

  // Lógica de exibição das páginas na paginação
  const getPageNumbers = () => {
    const maxVisiblePages = 3; // Máximo de páginas visíveis
    let startPage = Math.max(currentPage - 1, 1);
    let endPage = Math.min(currentPage + 1, totalPages);

    // Garante que sempre mostre 3 páginas quando possível
    if (currentPage === 1 && totalPages > 1) {
      endPage = Math.min(3, totalPages);
    } else if (currentPage === totalPages && totalPages > 1) {
      startPage = Math.max(totalPages - 2, 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

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
        <Card categoria={currentBooks}></Card>
      </div>
      <ul className="pagination">
        <li>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>
        {getPageNumbers().map(page => (
          <li key={page}>
            <button
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </main>
  );
}

export default Livros;
