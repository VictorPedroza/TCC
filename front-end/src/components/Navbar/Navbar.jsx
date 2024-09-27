import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import "./Navbar.css";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav>
            <div className="head-nav">
                <Link to='/' className='title'>Biblioteca RLT</Link>
                <button className='menu-mobile' onClick={() => setMenuOpen(!menuOpen)}>
                    <IoMenu size={60} />
                </button>
            </div>
            <ul className={menuOpen ? "open" : ""}>
                <li>
                    <NavLink to='/'>Início</NavLink>
                </li>
                <li>
                    <NavLink to='/Livros'>Livros</NavLink>
                </li>
                <li>
                    <NavLink to='/Eventos'>Eventos</NavLink>
                </li>
                <li>
                    <NavLink to='/Perfil'>Perfil</NavLink>
                </li>
            </ul>
        </nav>

    )
} 