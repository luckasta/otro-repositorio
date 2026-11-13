

import { Link } from 'react-router-dom';

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

    <Link to="/promociones" className="creacion-card">
        <img
            src="/imagenes/portadadetortas.jpg"
            alt="Tortas personalizadas"
        />
        <h3>Tortas</h3>
        <span>Descubrir promociones</span>
    </Link>

    <Link to="/promociones" className="creacion-card">
        <img
            src="/imagenes/portadadecupcake.jpg"
            alt="Cupcakes creativos"
        />
        <h3>Cupcakes</h3>
        <span>Descubrir promociones</span>
    </Link>

    <Link to="/promociones" className="creacion-card">
        <img
            src="/imagenes/portadadepostres.png"
            alt="Postres variados"
        />
        <h3>Postres</h3>
        <span>Descubrir promociones</span>
    </Link>

    <Link to="/promociones" className="creacion-card">
        <img
            src="/imagenes/portadadegalletas.jpg"
            alt="Galletas decoradas"
        />
        <h3>Galletas</h3>
        <span>Descubrir promociones</span>
    </Link>

</div>

            </section>
        </>
    );
}

export default Inicio;
