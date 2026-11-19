
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API_URL from '../config';

const BASE_URL = import.meta.env.BASE_URL;

function Combos() {
    const [combos, setCombos] = useState([]);
const [cargando, setCargando] = useState(true);

useEffect(() => {
    const cargarCombos = async () => {
        try {
           const respuesta = await fetch(`${API_URL}/api/combos`);
            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error('No se pudieron cargar los combos');
            }

            setCombos(datos);

        } catch (error) {
            console.error('Error al cargar los combos:', error);
        } finally {
            setCargando(false);
        }
    };

    cargarCombos();
}, []);
    return (
        <section className="pagina-combos">

            <div className="combos-encabezado">

            <h2>Nuestros combos especiales</h2>

            <p>
                Encuentra el detalle perfecto para sorprender
                y compartir momentos especiales.
            </p>
            </div>

            <div className="combos-grid">

                <article className="combo-tarjeta">
                   <img src={`${BASE_URL}imagenes/combo dulce.jpeg`} alt="Combo Dulce" />
                    <h3>Combo Dulce</h3>
                    <p>Cupcakes y galletas decoradas para disfrutar de algo delicioso.</p>
                    <span>Precio: $90.000 </span>
                    <p className="aviso-precio">
    El precio puede aumentar o disminuir dependiendo del diseño y/o la cantidad de unidades que se requieran.
</p>
                    <Link
                        to="/contactos"
                        state={{ combo: 'Combo Dulce' }}
                        className="boton-elegir-combo"
                    >
                        Elegir este combo
                    </Link>
                </article>

                <article className="combo-tarjeta">
                   <img src={`${BASE_URL}imagenes/combo celebracion.jpeg`} alt="Combo Celebración" />
                    <h3>Combo Celebración</h3>
                    <p>Una mini torta acompañada de deliciosos cupcakes.</p>
                    <span>Precio: $130.000</span>
                    <p className="aviso-precio">
    El precio puede aumentar o disminuir dependiendo del diseño y/o la cantidad de unidades que se requieran.
</p>
                    <Link
                        to="/contactos"
                        state={{ combo: 'Combo Celebración' }}
                        className="boton-elegir-combo"
                    >
                        Elegir este combo
                    </Link>                    
                </article>

                <article className="combo-tarjeta">
                   <img src={`${BASE_URL}imagenes/combo galletas.jpeg`} alt="Combo Galletitas" />
                    <h3>Combo Galletitas</h3>
                    <p>Una selección de galletas decoradas con diseños especiales.</p>
                    <span>Precio: $50.000</span>
                    <p className="aviso-precio">
    El precio puede aumentar o disminuir dependiendo del diseño y/o la cantidad de unidades que se requieran.
</p>
                    <Link
                        to="/contactos"
                        state={{ combo: 'Combo Galletitas' }}
                        className="boton-elegir-combo"
                    >
                        Elegir este combo
                    </Link>                    
                </article>

                <article className="combo-tarjeta">
                    <img src={`${BASE_URL}imagenes/combo especial.jpeg`} alt="Combo Especial" />
                    <h3>Combo Especial</h3>
                    <p>Una variedad de pequeños postres para compartir.</p>
                    <span>Precio: $75.000</span>
                    <p className="aviso-precio">
    El precio puede aumentar o disminuir dependiendo del diseño y/o la cantidad de unidades que se requieran.
</p>
                    <Link
                        to="/contactos"
                        state={{ combo: 'Combo Especial' }}
                        className="boton-elegir-combo"
                    >
                        Elegir este combo
                    </Link>
                </article>
                {combos
    .filter((combo) => ![
        'Combo Dulce',
        'Combo Celebración',
        'Combo Galletitas',
        'Combo Especial'
    ].includes(combo.nombre))
    .map((combo) => (
    <article className="combo-tarjeta" key={combo._id}>

        {combo.imagen && (
    <img
        src={
            combo.imagen.startsWith('/imagenes/')
                ? `${BASE_URL}${combo.imagen.substring(1)}`
                : combo.imagen
        }
        alt={combo.nombre}
    />
)}

        <h3>{combo.nombre}</h3>

        <p>{combo.descripcion}</p>

        <span>
            Precio: ${Number(combo.precio).toLocaleString('es-CO')}
        </span>

        <Link
            to="/contactos"
            state={{ combo: combo.nombre }}
            className="boton-elegir-combo"
        >
            Elegir este combo
        </Link>

    </article>
))}

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
