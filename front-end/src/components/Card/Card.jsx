import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.css';

export default function Card({ categoria }) {
  const navigate = useNavigate();

  const handleCardClick = (livro) => {
    navigate(`/livro/${livro.id}`, { state: { livro } });
  };

  return (
    <div className="livros-container">
      <div className="card-container">
        {categoria.map((livro, index) => (
          <div 
            key={index} 
            className="livro-card"
            onClick={() => handleCardClick(livro)}
          >
            <img className="img" src={livro.imagem} alt={livro.Nome} />
            <div className="text">
              <p>{livro.Nome}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
