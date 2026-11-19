// Importar los estilos generales y las herramientas necesarias
// para construir la aplicación y gestionar la navegación.
import './App.css';
import { useEffect } from 'react';
import './fondos.css';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import AsesoraIA from './componentes/AsesoraIA';
import Admin from './componentes/admin';
import Inicio from './paginas/Inicio';
import Productos from './paginas/Productos';
import Contacto from './paginas/Contactos';
import Categoria from './paginas/Categoria';
import Combos from './paginas/Combos';
import Nosotros from './paginas/Nosotros';

    // Componente principal que contiene la estructura general del sitio web.
function App() {

        // Configurar las imágenes de fondo utilizando la ruta base del proyecto.
    // Esto permite que los recursos se carguen correctamente al publicar la página.
    useEffect(() => {
    const base = import.meta.env.BASE_URL;

    document.documentElement.style.setProperty(
        '--fondo-encabezado',
        `url("${base}imagenes/otrapruebafondo.jpg")`
    );

    document.documentElement.style.setProperty(
        '--fondo-patron',
        `url("${base}imagenes/imagendepruebapatron.png")`
    );

    document.documentElement.style.setProperty(
        '--fondo-flor',
        `url("${base}imagenes/imagendepruebaflor.png")`
    );
}, []);

    // Definir la estructura visual y las rutas de navegación de la aplicación.
    return (
       <HashRouter>

        {/* Mostrar la asesora virtual en las diferentes secciones del sitio. */}
           <AsesoraIA />

{/* Encabezado con el logotipo y el menú principal de navegación. */}
           <header>
               <nav>
                  <div className="marca">

    <Link to="/" className="logo-marca">
        <img
            src={`${import.meta.env.BASE_URL}imagenes/logo-grande2.png`}
            alt="Dulce Tentación - Repostería creativa"
        />
    </Link>

    <p className="eslogan">
        Pequeños detalles, grandes momentos
    </p>

    <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/combos">Combos</Link></li>
        <li><Link to="/contactos">Contactos</Link></li>
        <li><Link to="/nosotros">Nosotros</Link></li>
        <li><Link to="/administracion">Administración</Link></li>
    </ul>

</div>
                   
               </nav>
           </header>

            <main>

                {/* Definir las rutas que permiten navegar entre las páginas del emprendimiento. */}
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/productos/:tipo" element={<Categoria />} />
                    <Route path="/contactos" element={<Contacto />} />
                    <Route path="/administracion" element={<Admin />} />
                    <Route path="/combos" element={<Combos />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                </Routes>
            </main>

{/* Pie de página con información del emprendimiento y enlaces de contacto. */}
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
                        <Link to="/combos">Combos</Link>
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

                <div className="footer-aviso">
                    <p>
                        <strong>Aviso sobre el uso de imágenes:</strong>
                        Las imágenes presentadas en este sitio web se utilizan
                        con fines ilustrativos y educativos, como parte de un
                        proyecto académico. Su finalidad es servir como
                        referencia visual de los productos y diseños de
                        repostería. Las imágenes pertenecen a sus respectivos
                        autores y titulares de derechos.
                    </p>
                </div>

                <div className="footer-final">
                    <p>© 2026 Dulce Tentación. Todos los derechos reservados.</p>
                </div>
            </footer>

        </HashRouter>
    );
}

export default App;
