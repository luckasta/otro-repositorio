

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Inicio() {
    const imagenes = [
    '/imagenes/imagen%20principal.png',
    '/imagenes/imagenportada2.jpeg',
    '/imagenes/imagenportada3.jpeg'
];
    const [imagenActual, setImagenActual] = useState(0);

    useEffect(() => {
    const intervalo = setInterval(() => {
        setImagenActual((actual) => (actual + 1) % imagenes.length);
    }, 5000);

    return () => clearInterval(intervalo);
}, []);
    


    return (
        <>
        <div className="fondo-inicio">
        
           <section
    className="pagina-inicio"id="inicio"
>
    <img
        key={imagenActual}
        className="carrusel-fondo"
        src={imagenes[imagenActual]}
        alt=""
    />

    <h2>La creatividad también se puede saborear</h2>

    <p>
        Creamos momentos especiales con postres únicos,
        diseños originales y mucho sabor.
    </p>

    <div className="carrusel-indicadores">
        {imagenes.map((imagen, index) => (
            <span
                key={index}
                className={imagenActual === index ? 'indicador activo' : 'indicador'}
            ></span>
        ))}
    </div>
</section>

            <section className="creaciones-inicio">
                <h2>Algunas de nuestras creaciones</h2>

                <p>
                    Descubre todo lo que podemos crear para hacer
                    tus momentos aún más especiales.
                </p>

                
<div className="creaciones-grid">

    <Link to="/combos" className="creacion-card">
        <img
            src="/imagenes/combos.png"
            alt="Combos de Dulce Tentación"
        />
        <h3>Nuestros combos</h3>
        <span>Descubre nuestras opciones</span>
    </Link>

    <Link to="/nosotros" className="creacion-card">
        <img
            src="/imagenes/nosotros.png"
            alt="Nuestra historia"
        />
        <h3>Conoce nuestra historia</h3>
        <span>Descubre quiénes somos</span>
    </Link>

</div>

            </section>

        </div>    
        </>
    );
}

export default Inicio;
