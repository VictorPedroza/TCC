import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8088/Login', values)
        .then(res => {
            if (res.data.Status === "Success") {
                navigate('/');
            } else {
                alert(res.data.Message);
            }
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input 
                        type="email" 
                        placeholder="Digite seu Email" 
                        name="email" 
                        autoComplete="off"
                        onChange={e => setValues({ ...values, email: e.target.value })} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password"><strong>Senha</strong></label>
                    <input 
                        type="password" 
                        placeholder="Digite sua Senha" 
                        name="password"
                        onChange={e => setValues({ ...values, password: e.target.value })} 
                        required 
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
                <p className="terms">Aceito todos os termos e políticas!</p>
            </form>
        </div>
    );
}
