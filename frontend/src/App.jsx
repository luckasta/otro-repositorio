
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Admin from './componentes/admin';
import Inicio from './paginas/Inicio';
import Productos from './paginas/Productos';
import Promociones from './paginas/Promociones';
import Contacto from './paginas/Contactos';
import Categoria from './paginas/Categoria';


function App() {
    return (
        <BrowserRouter>

            <header>
                <nav>
                    <h1>Dulce Tentación</h1>

                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/productos">Productos</Link></li>
                        <li><Link to="/promociones">Promociones</Link></li>
                        <li><Link to="/contactos">Contactos</Link></li>
                        <li><Link to="/administracion">Administración</Link></li>
                    </ul>
                </nav>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/productos/:tipo" element={<Categoria />} />
                    <Route path="/promociones" element={<Promociones />} />
                    <Route path="/contactos" element={<Contacto />} />
                    <Route path="/administracion" element={<Admin />} />
                </Routes>
            </main>

            <footer className="footer">
                <div className="footer-contenido">

                    <div className="footer-marca">
                        <h2>Dulce Tentación</h2>
                        <p>
                            Creamos momentos especiales con postres únicos,
                            diseños originales y mucho sabor.
                        </p>
                    </div>

                    <div className="footer-enlaces">
                        <h3>Explora</h3>
                        <Link to="/">Inicio</Link>
                        <Link to="/productos">Productos</Link>
                        <Link to="/promociones">Promociones</Link>
                        <Link to="/contactos">Contactos</Link>
                    </div>

                    <div className="footer-contactos">
                        <h3>¿Tienes una idea?</h3>
                        <p>¡Nos encantará ayudarte a hacerla realidad!</p>

                        <a href="https://wa.me/573332536448" target="_blank" rel="noreferrer">
                            Escríbenos por WhatsApp
                        </a>
                    </div>

                </div>

                <div className="footer-final">
                    <p>© 2026 Dulce Tentación. Todos los derechos reservados.</p>
                </div>
            </footer>

        </BrowserRouter>
    );
}

export default App;
