
import { Link } from 'react-router-dom';

function Combos() {
    return (
        <section className="pagina-combos">

            <h2>Nuestros combos especiales</h2>

            <p>
                Encuentra el detalle perfecto para sorprender
                y compartir momentos especiales.
            </p>

            <div className="combos-grid">

                <article className="combo-tarjeta">
                    <img src="/imagenes/combo-dulce.jpg" alt="Combo Dulce" />
                    <h3>Combo Dulce</h3>
                    <p>Cupcakes y galletas decoradas para disfrutar de algo delicioso.</p>
                    <span>Precio: $ Por definir</span>
                    <Link
                        to="/contactos"
                        state={{ combo: 'Combo Dulce' }}
                        className="boton-elegir-combo"
                    >
                        Elegir este combo
                    </Link>
                </article>

                <article className="combo-tarjeta">
                    <img src="/imagenes/combo-celebracion.jpg" alt="Combo Celebración" />
                    <h3>Combo Celebración</h3>
                    <p>Una mini torta acompañada de deliciosos cupcakes.</p>
                    <span>Precio: $ Por definir</span>
                    <Link
                        to="/contactos"
                        state={{ combo: 'Combo Celebración' }}
                        className="boton-elegir-combo"
                    >
                        Elegir este combo
                    </Link>                    
                </article>

                <article className="combo-tarjeta">
                    <img src="/imagenes/combo-galletitas.jpg" alt="Combo Galletitas" />
                    <h3>Combo Galletitas</h3>
                    <p>Una selección de galletas decoradas con diseños especiales.</p>
                    <span>Precio: $ Por definir</span>
                    <Link
                        to="/contactos"
                        state={{ combo: 'Combo Galletitas' }}
                        className="boton-elegir-combo"
                    >
                        Elegir este combo
                    </Link>                    
                </article>

                <article className="combo-tarjeta">
                    <img src="/imagenes/combo-especial.jpg" alt="Combo Especial" />
                    <h3>Combo Especial</h3>
                    <p>Una variedad de pequeños postres para compartir.</p>
                    <span>Precio: $ Por definir</span>
                    <Link
                        to="/contactos"
                        state={{ combo: 'Combo Especial' }}
                        className="boton-elegir-combo"
                    >
                        Elegir este combo
                    </Link>
                </article>

            </div>

            <div className="combo-personalizado">
                <h2>¿Tienes otra idea en mente?</h2>
                <p>Nosotros te ayudamos a crear un pedido personalizado.</p>
                <Link to="/contactos">Crear mi pedido personalizado</Link>
            </div>

        </section>
    );
}

export default Combos;
