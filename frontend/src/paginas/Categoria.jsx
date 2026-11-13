
import { useParams, Link } from 'react-router-dom';

function Categoria() {
    const { tipo } = useParams();

    const categorias = {
        tortas: {
            titulo: 'Tortas creativas y personalizadas',
            descripcion: 'Cada torta es una creación única. Elige la temática, los colores, los sabores y los detalles. ¡Nosotros hacemos realidad tu idea!',
            imagenes: [
                '/imagenes/tortas1.jpg',
                '/imagenes/tortas2.jpg',
                '/imagenes/tortas3.jpg',
                '/imagenes/tortas4.jpeg'
            ]
        },

         cupcakes: {
            titulo: 'Cupcakes creativos y personalizados',
            descripcion: 'Pequeñas creaciones llenas de sabor. Personaliza sus colores, sabores y decoración para cualquier ocasión.',
            imagenes: [
                '/imagenes/cupcake1.jpg',
                '/imagenes/cupcake2.jpg',
                '/imagenes/cupcake33.jpg',
                '/imagenes/cupcake4.jpg'
            ]
        },

        postres: {
            titulo: 'Postres deliciosos y personalizados',
            descripcion: 'Descubre nuestros postres, preparados con dedicación y perfectos para compartir o disfrutar en cualquier ocasión.',
            imagenes: [
                '/imagenes/postres1.jpg',
                '/imagenes/postres2.jpg',
                '/imagenes/postres3.jpg',
                '/imagenes/postres4.jpg'
            ]
        },
        galletas: {
            titulo: 'Galletas creativas y personalizadas',
            descripcion: 'Galletas deliciosas y llenas de creatividad, ideales para regalar, celebrar y compartir. Personaliza sus diseños y decoración.',
            imagenes: [
                '/imagenes/galletas1.jpg',
                '/imagenes/galletas2.jpg',
                '/imagenes/galletas3.jpg',
                '/imagenes/galletas4.jpg'
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
                <h3>¡Una torta hecha para ti!</h3>

                <p>
                    El precio depende del tamaño, sabor y nivel de decoración.
                </p>

                <h2>Desde $...</h2>

                <Link to="/contacto" className="boton-producto">
                    Quiero crear mi torta
                </Link>
            </div>

        </section>
    );
}

export default Categoria;
