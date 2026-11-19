
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API_URL from '../config';

const BASE_URL = import.meta.env.BASE_URL;

function Categoria() {
    const { tipo } = useParams();
    console.log('Categoría seleccionada:', tipo);

    const [precios, setPrecios] = useState({
    tortas: 0,
    cupcakes: 0,
    postres: 0,
    galletas: 0
    });

    const [cargandoPrecios, setCargandoPrecios] = useState(true);

    useEffect(() => {
    const cargarPrecios = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/api/precios`);

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error('No se pudieron cargar los precios');
            }

            setPrecios({
                tortas: datos.tortas ?? 0,
                cupcakes: datos.cupcakes ?? 0,
                postres: datos.postres ?? 0,
                galletas: datos.galletas ?? 0
            });

        } catch (error) {
            console.error('Error al cargar los precios:', error);
        } finally {
            setCargandoPrecios(false);
        }
    };

    cargarPrecios();
}, []);

    const categorias = {
        tortas: {
            titulo: 'Tortas creativas y personalizadas',
            descripcion: 'Cada torta es una creación única. Elige la temática, los colores, los sabores y los detalles. ¡Nosotros hacemos realidad tu idea!',
            imagenes: [
    `${BASE_URL}imagenes/tortas1.jpg`,
    `${BASE_URL}imagenes/tortas2.jpg`,
    `${BASE_URL}imagenes/tortas3.jpg`,
    `${BASE_URL}imagenes/tortas4.jpeg`
]
        },

         cupcakes: {
            titulo: 'Cupcakes creativos y personalizados',
            descripcion: 'Pequeñas creaciones llenas de sabor. Personaliza sus colores, sabores y decoración para cualquier ocasión.',
            imagenes: [
               `${BASE_URL}imagenes/cupcake1.jpg`,
    `${BASE_URL}imagenes/cupcake2.jpg`,
    `${BASE_URL}imagenes/cupcake33.jpg`,
    `${BASE_URL}imagenes/cupcake4.jpg`
]
        },

        postres: {
            titulo: 'Postres deliciosos y personalizados',
            descripcion: 'Descubre nuestros postres, preparados con dedicación y perfectos para compartir o disfrutar en cualquier ocasión.',
            imagenes: [
    `${BASE_URL}imagenes/postres1.jpg`,
    `${BASE_URL}imagenes/postres2.jpg`,
    `${BASE_URL}imagenes/postres3.jpg`,
    `${BASE_URL}imagenes/postres4.jpg`
]
        },
        galletas: {
            titulo: 'Galletas creativas y personalizadas',
            descripcion: 'Galletas deliciosas y llenas de creatividad, ideales para regalar, celebrar y compartir. Personaliza sus diseños y decoración.',
            imagenes: [
                `${BASE_URL}imagenes/galletas1.jpg`,
    `${BASE_URL}imagenes/galletas2.jpg`,
    `${BASE_URL}imagenes/galletas3.jpg`,
    `${BASE_URL}imagenes/galletas4.jpg`
]
        }


    };

    const categoria = categorias[tipo];

    if (!categoria) {
        return <h2>Esta categoría todavía no está disponible.</h2>;
    }

    return (
        <section className="pagina-categoria">

            <h2>{categoria.titulo}</h2>

            <p>{categoria.descripcion}</p>

            <div className="galeria-productos">
                {categoria.imagenes.map((imagen, indice) => (
                    <article className="tarjeta-galeria" key={imagen}>
                        <img
                            src={imagen}
                            alt={`Ejemplo de torta personalizada ${indice + 1}`}
                        />
                    </article>
                ))}
            </div>

            <div className="informacion-precio">
                <h3>
                    {tipo === 'tortas' && '¡Una torta hecha para ti!'}
                    {tipo === 'cupcakes' && '¡Cupcakes diseñados para ti!'}
                    {tipo === 'galletas' && '¡Galletas hechas a tu gusto!'}
                    {tipo === 'postres' && '¡Postres para cada ocasión!'}
                </h3>

                <p>
                    {tipo === 'tortas' && 'El precio depende del tamaño, sabor y nivel de decoración.'}
                    {tipo === 'cupcakes' && 'Personaliza tus cupcakes con tus sabores, colores y decoraciones favoritas.'}
                    {tipo === 'galletas' && 'Elige las formas, sabores y diseños que más te gusten.'}
                    {tipo === 'postres' && 'Personaliza tus postres según el sabor, la presentación y la cantidad.'}
                </p>

                <h2>
    {cargandoPrecios
        ? 'Cargando precio...'
        : `Desde ${Number(precios[tipo]).toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        })}`
    }
</h2>
<p className="aviso-precio">
    El precio puede aumentar o disminuir dependiendo del diseño y/o la cantidad de unidades que se requieran.
</p>
                <Link
                    to="/contactos"
                    state={{
                        personalizar: true,
                        producto: tipo
                    }}
                    className="boton-producto"
                >
                    Quiero personalizar
                </Link>
            </div>

        </section>
    );
}

export default Categoria;
