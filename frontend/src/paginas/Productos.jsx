
import { Link } from 'react-router-dom';
function Productos() {
    return (
        <section id="Productos">
            <h2>Nuestras creaciones</h2>

            <p>
                Descubre un mundo de sabores, colores y creatividad.
            </p>

            <div className="catalogo-contenedor">

                <article className="producto">
                    <img className="producto-imagen" src="/imagenes/portadadetortas.jpg" alt="Tortas creativas" />
                    <h3>Tortas</h3>
                    <p>
                        Tortas únicas con diseños originales para
                        celebrar momentos especiales.
                    </p>
                    <Link to="/productos/tortas" className="boton-producto">
                        Ver productos
                    </Link>
                </article>

                <article className="producto">
                    <img className="producto-imagen" src="/imagenes/portadadecupcake.jpg" alt="Cupcakes decorados" />
                    <h3>Cupcakes</h3>
                    <p>
                        Pequeñas creaciones llenas de sabor,
                        color y decoración.
                    </p>
                    <Link to="/productos/cupcakes" className="boton-producto">
                        Ver productos
                    </Link>
                </article>

                <article className="producto">
                    <img className="producto-imagen" src="/imagenes/portadadepostres.png" alt="Postres personalizados" />
                    <h3>Postres</h3>
                    <p>
                        Postres diseñados para darle un toque
                        especial a cada ocasión.
                    </p>
                    <Link to="/productos/postres" className="boton-producto">
                        Ver productos
                    </Link>
                </article>

                <article className="producto">
                    <img className="producto-imagen" src="/imagenes/portadadegalletas.jpg" alt="Galletas creativas" />
                    <h3>Galletas</h3>
                    <p>
                        Galletas con formas, colores y decoraciones
                        originales para disfrutar y compartir.
                    </p>
                    <Link to="/productos/galletas" className="boton-producto">
                        Ver productos
                    </Link>
                </article>

            </div>
        </section>
    );
}

export default Productos;
