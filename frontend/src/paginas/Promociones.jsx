
import { Link } from 'react-router-dom';

function Promociones() {
    return (
        <section id="promociones" className="pagina-promociones">
            <h2>Promociones especiales</h2>

            <p>
                ¡Endulza tus momentos favoritos con nuestras
                ofertas y promociones!
            </p>

            <div className="promociones-contenido">

                <article className="tarjeta-promocion">
                    <h3>Momentos especiales</h3>
                    <p>
                        Sorprende a esa persona especial con
                        una creación dulce y personalizada.
                    </p>
                    <Link to="/productos">
                        Descubrir productos
                    </Link>
                </article>

                <article className="tarjeta-promocion">
                    <h3>Comparte algo delicioso</h3>
                    <p>
                        Encuentra opciones ideales para compartir
                        en reuniones y celebraciones.
                    </p>
                    <Link to="/productos">
                        Ver productos
                    </Link>
                </article>

                <article className="tarjeta-promocion">
                    <h3>Diseños personalizados</h3>
                    <p>
                        ¡Cuéntanos tu idea y creemos algo único
                        para tu ocasión especial!
                    </p>
                    <Link to="/contactos">
                        Personalizar pedido
                    </Link>
                </article>

            </div>
        </section>
    );
}

export default Promociones;

