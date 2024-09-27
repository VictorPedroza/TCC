import React from 'react';
import './Card.css';

export default function Card({ categoria }) {
  return (
    <div className="livros-container">
      <div className="card-container">
        {categoria.map((livro, index) => (
          <div 
            key={index} 
            className="livro-card"
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
