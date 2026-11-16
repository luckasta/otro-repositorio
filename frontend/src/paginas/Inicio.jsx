

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Inicio() {
    return (
        <>
            <section className="pagina-inicio" id="inicio">
                <h2>La creatividad también se puede saborear</h2>

                <p>
                    Creamos momentos especiales con postres únicos,
                    diseños originales y mucho sabor.
                </p>
                
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
        </>
    );
}

export default Inicio;
