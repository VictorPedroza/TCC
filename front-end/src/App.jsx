import { Navbar } from './components/Navbar/Navbar'; 
import { Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Livros from './components/Pages/Livros';
import Eventos from './components/Pages/Eventos';
import AdminRedirect from './components/AdminRedirect';
import Perfil from './components/Pages/Perfil';
import LivroDetalhes from './components/Card/LivroDetalhes';
import './App.css';
import Login from './components/Pages/Login';
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Livros' element={<Livros />} />
        <Route path="/livro/:id" element={<LivroDetalhes />} />
        <Route path='/Eventos' element={<Eventos />} />
        <Route path='/Perfil' element={<Perfil />} />
        <Route path='/admin' element={<AdminRedirect />} />
        <Route path='/Login' element={<Login />}></Route>
      </Routes>
    </div>
  )
}

export default App;
