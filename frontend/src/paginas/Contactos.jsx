import { useLocation } from 'react-router-dom';

function Contacto() {
    const location = useLocation();
    const comboSeleccionado = location.state?.combo || '';
    const personalizar = location.state?.personalizar || false;
    const productoSeleccionado = location.state?.producto || '';
    console.log('Producto seleccionado:', productoSeleccionado);

    const enviarWhatsApp = async (event) => {
        event.preventDefault();

        const formulario = event.currentTarget;
        const datos = new FormData(formulario);

        const nombre = datos.get('nombre');
        const correo = datos.get('correo');
        const producto = datos.get('producto');
        console.log('Producto enviado:', producto);
        const mensaje = datos.get('mensaje');
        const tematica = datos.get('tematica') || '';
        const colores = datos.get('colores') || '';
        const sabor = datos.get('sabor') || '';
        const relleno = datos.get('relleno') || '';
        const porciones = datos.get('porciones') || '';
        const cantidad = datos.get('cantidad') || '';
        const decoracion = datos.get('decoracion') || '';
        const forma = datos.get('forma') || '';
        const tipoPostre = datos.get('tipoPostre') || '';
        const presentacion = datos.get('presentacion') || '';

        const pedido = {
            nombre,
            correo,
            producto,
            mensaje,
            tematica,
            colores,
            sabor,
            relleno,
            porciones,
            cantidad,
            decoracion,
            forma,
            tipoPostre,
            presentacion
        };

        try {
            const respuesta = await fetch('http://localhost:3000/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
            });

            if (!respuesta.ok) {
                throw new Error('No se pudo guardar el pedido');
            }

            let personalizacion = '';

if (producto === 'tortas') {
    personalizacion = `
PERSONALIZACIÓN DE TORTA:
Temática: ${tematica || 'No especificada'}
Colores: ${colores || 'No especificados'}
Sabor: ${sabor || 'No especificado'}
Relleno: ${relleno || 'No especificado'}
Porciones: ${porciones || 'No especificadas'}`;
}

else if (producto === 'cupcakes') {
    personalizacion = `
PERSONALIZACIÓN DE CUPCAKES:
Temática: ${tematica || 'No especificada'}
Colores: ${colores || 'No especificados'}
Sabor: ${sabor || 'No especificado'}
Relleno: ${relleno || 'No especificado'}
Cantidad: ${cantidad || 'No especificada'}
Decoración: ${decoracion || 'No especificada'}`;
}

else if (producto === 'galletas') {
    personalizacion = `
PERSONALIZACIÓN DE GALLETAS:
Temática: ${tematica || 'No especificada'}
Colores: ${colores || 'No especificados'}
Sabor: ${sabor || 'No especificado'}
Cantidad: ${cantidad || 'No especificada'}
Decoración: ${decoracion || 'No especificada'}
Forma: ${forma || 'No especificada'}`;
}

else if (producto === 'postres') {
    personalizacion = `
PERSONALIZACIÓN DE POSTRES:
Tipo de postre: ${tipoPostre || 'No especificado'}
Sabor: ${sabor || 'No especificado'}
Presentación: ${presentacion || 'No especificada'}
Cantidad: ${cantidad || 'No especificada'}
Decoración: ${decoracion || 'No especificada'}`;
}

const texto = `¡Hola! Quiero realizar un pedido en Dulce Tentación.

Nombre: ${nombre}
Correo: ${correo}
Producto: ${producto}
Detalles: ${mensaje}
${personalizacion}`;
          const url = `https://wa.me/573332536448?text=${encodeURIComponent(texto)}`;
          console.log('Mensaje generado:', texto);
          console.log('URL de WhatsApp:', url);
            window.location.href = url;

            formulario.reset();

        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo guardar tu pedido. Inténtalo nuevamente.');
        }
    };

    return (
        <section id="contacto">
            <h2>Hablemos de tu próxima creación</h2>

            <p>
                Cuéntanos qué tienes en mente y hagamos
                realidad algo delicioso.
            </p>

            <form className="formulario-contacto" onSubmit={enviarWhatsApp}>
                <div className="campo">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input type="text" id="nombre" name="nombre" placeholder="Escribe tu nombre" required />
                </div>

                <div className="campo">
                    <label htmlFor="correo">Correo electrónico</label>
                    <input type="email" id="correo" name="correo" placeholder="ejemplo@correo.com" required />
                </div>

                {comboSeleccionado ? (
    <div className="combo-seleccionado">
        <span>Tu selección</span>
        <h3>{comboSeleccionado}</h3>

        <input
            type="hidden"
            name="producto"
            value={comboSeleccionado}
        />
    </div>
) : personalizar ? (
    <div className="combo-seleccionado">
        <span>Producto que deseas personalizar</span>
        <h3>{productoSeleccionado}</h3>

        <input
            type="hidden"
            name="producto"
            value={productoSeleccionado}
        />
    </div>
) : (
    <div className="campo">
        <label htmlFor="producto">
            ¿Qué producto te interesa?
        </label>

        <select id="producto" name="producto" required>
            <option value="">Selecciona una opción</option>
            <option value="tortas">Tortas</option>
            <option value="cupcakes">Cupcakes</option>
            <option value="postres">Postres</option>
            <option value="galletas">Galletas</option>
            <option value="otro">Otro</option>
        </select>
    </div>
)}

{personalizar && productoSeleccionado === 'tortas' && (
    <div className="personalizacion-torta">

        <h3>¡Diseñemos tu torta!</h3>

        <p>Cuéntanos cómo imaginas tu creación.</p>

        <div className="campo">
            <label htmlFor="tematica">¿Qué temática deseas?</label>
            <input
                type="text"
                id="tematica"
                name="tematica"
                placeholder="Ej. cumpleaños, flores, personajes..."
            />
        </div>

        <div className="campo">
            <label htmlFor="colores">¿Qué colores te gustaría utilizar?</label>
            <input
                type="text"
                id="colores"
                name="colores"
                placeholder="Ej. morado, blanco y dorado..."
            />
        </div>

        <div className="campo">
            <label htmlFor="sabor">¿Qué sabor prefieres?</label>
            <select id="sabor" name="sabor">
                <option value="">Selecciona un sabor</option>
                <option value="Vainilla">Vainilla</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Marmoleada">Fresa</option>
                <option value="Otro">Otro</option>
            </select>
        </div>

        <div className="campo">
            <label htmlFor="relleno">¿Qué relleno prefieres?</label>
            <input
                type="text"
                id="relleno"
                name="relleno"
                placeholder="Ej. arequipe, chocolate, frutos rojos..."
            />
        </div>

        <div className="campo">
            <label htmlFor="porciones">¿Para cuántas personas?</label>
            <select id="porciones" name="porciones">
                <option value="">Selecciona las porciones</option>
                <option value="6-10 personas">6 a 10 personas</option>
                <option value="11-15 personas">11 a 15 personas</option>
                <option value="16-20 personas">16 a 20 personas</option>
                <option value="Más de 20 personas">Más de 20 personas</option>
            </select>
        </div>

    </div>
)}

{personalizar && productoSeleccionado === 'cupcakes' && (
    <div className="personalizacion-torta">

        <h3>¡Diseñemos tus cupcakes!</h3>

        <p>Cuéntanos cómo quieres que sean.</p>

        <div className="campo">
            <label htmlFor="tematica">¿Qué temática deseas?</label>
            <input
                type="text"
                id="tematica"
                name="tematica"
                placeholder="Ej. flores, cumpleaños, personajes..."
            />
        </div>

        <div className="campo">
            <label htmlFor="colores">¿Qué colores te gustaría utilizar?</label>
            <input
                type="text"
                id="colores"
                name="colores"
                placeholder="Ej. morado, blanco y dorado..."
            />
        </div>

        <div className="campo">
            <label htmlFor="sabor">¿Qué sabor prefieres?</label>
            <select id="sabor" name="sabor">
                <option value="">Selecciona un sabor</option>
                <option value="Vainilla">Vainilla</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Marmoleado">Fresa</option>
                <option value="Otro">Otro</option>
            </select>
        </div>

        <div className="campo">
            <label htmlFor="relleno">¿Qué relleno prefieres?</label>
            <input
                type="text"
                id="relleno"
                name="relleno"
                placeholder="Ej. arequipe, chocolate..."
            />
        </div>

        <div className="campo">
            <label htmlFor="cantidad">¿Cuántos cupcakes deseas?</label>
            <select id="cantidad" name="cantidad">
                <option value="">Selecciona una cantidad</option>
                <option value="6 unidades">6 unidades</option>
                <option value="12 unidades">12 unidades</option>
                <option value="24 unidades">24 unidades</option>
                <option value="Más de 24 unidades">Más de 24 unidades</option>
            </select>
        </div>

        <div className="campo">
            <label htmlFor="decoracion">¿Qué decoración te gustaría?</label>
            <input
                type="text"
                id="decoracion"
                name="decoracion"
                placeholder="Ej. crema, sprinkles, toppers..."
            />
        </div>

    </div>
)}

{personalizar && productoSeleccionado === 'galletas' && (
    <div className="personalizacion-torta">

        <h3>¡Diseñemos tus galletas!</h3>

        <p>Cuéntanos cómo imaginas tus galletas personalizadas.</p>

        <div className="campo">
            <label htmlFor="tematica">¿Qué temática deseas?</label>
            <input
                type="text"
                id="tematica"
                name="tematica"
                placeholder="Ej. Navidad, cumpleaños, flores..."
            />
        </div>

        <div className="campo">
            <label htmlFor="colores">¿Qué colores te gustaría utilizar?</label>
            <input
                type="text"
                id="colores"
                name="colores"
                placeholder="Ej. morado, amarillo y blanco..."
            />
        </div>

        <div className="campo">
            <label htmlFor="sabor">¿Qué sabor prefieres?</label>
            <select id="sabor" name="sabor">
                <option value="">Selecciona un sabor</option>
                <option value="Vainilla">Vainilla</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Canela">Canela</option>
                <option value="Mantequilla">Mantequilla</option>
                <option value="Otro">Otro</option>
            </select>
        </div>

        <div className="campo">
            <label htmlFor="cantidad">¿Cuántas galletas deseas?</label>
            <select id="cantidad" name="cantidad">
                <option value="">Selecciona una cantidad</option>
                <option value="6 unidades">6 unidades</option>
                <option value="12 unidades">12 unidades</option>
                <option value="24 unidades">24 unidades</option>
                <option value="Más de 24 unidades">Más de 24 unidades</option>
            </select>
        </div>

        <div className="campo">
            <label htmlFor="decoracion">¿Qué decoración deseas?</label>
            <input
                type="text"
                id="decoracion"
                name="decoracion"
                placeholder="Ej. glaseado, chispas, figuras..."
            />
        </div>

        <div className="campo">
            <label htmlFor="forma">¿Qué forma te gustaría?</label>
            <input
                type="text"
                id="forma"
                name="forma"
                placeholder="Ej. corazones, estrellas, círculos..."
            />
        </div>

    </div>
)}

{personalizar && productoSeleccionado === 'postres' && (
    <div className="personalizacion-torta">

        <h3>¡Diseñemos tus postres!</h3>

        <p>Cuéntanos qué delicias te gustaría disfrutar.</p>

        <div className="campo">
            <label htmlFor="tipoPostre">¿Qué tipo de postre deseas?</label>
            <select id="tipoPostre" name="tipoPostre">
                <option value="">Selecciona un postre</option>
                <option value="Cheesecake">Cheesecake</option>
                <option value="Tres leches">Tres leches</option>
                <option value="Brownies">Brownies</option>
                <option value="Mousse">Mousse</option>
                <option value="Postre de frutas">Postre de frutas</option>
                <option value="Otro">Otro</option>
            </select>
        </div>

        <div className="campo">
            <label htmlFor="sabor">¿Qué sabor prefieres?</label>
            <input
                type="text"
                id="sabor"
                name="sabor"
                placeholder="Ej. chocolate, fresa, vainilla..."
            />
        </div>

        <div className="campo">
            <label htmlFor="presentacion">¿Cómo deseas la presentación?</label>
            <select id="presentacion" name="presentacion">
                <option value="">Selecciona una presentación</option>
                <option value="Individual">Porciones individuales</option>
                <option value="Familiar">Tamaño familiar</option>
                <option value="Mesa de postres">Mesa de postres</option>
            </select>
        </div>

        <div className="campo">
            <label htmlFor="cantidad">¿Cuántas porciones deseas?</label>
            <select id="cantidad" name="cantidad">
                <option value="">Selecciona una cantidad</option>
                <option value="6 porciones">6 porciones</option>
                <option value="12 porciones">12 porciones</option>
                <option value="20 porciones">20 porciones</option>
                <option value="Más de 20 porciones">Más de 20 porciones</option>
            </select>
        </div>

        <div className="campo">
            <label htmlFor="decoracion">¿Algún detalle especial?</label>
            <input
                type="text"
                id="decoracion"
                name="decoracion"
                placeholder="Ej. frutas, chocolate, crema..."
            />
        </div>

    </div>
)}

                <div className="campo">
                    <label htmlFor="mensaje">Cuéntanos tu idea</label>
                    <textarea id="mensaje" name="mensaje" rows="5" placeholder="Describe tu pedido o idea..." required></textarea>
                </div>

                <button type="submit">Enviar mensaje</button>
            </form>
                        <div className="contacto-redes">
                <h3>También puedes encontrarnos en</h3>

                <div className="contacto-redes-contenido">

                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                        <h4>Instagram</h4>
                        <p>Síguenos y descubre nuestras creaciones.</p>
                    </a>

                    <a href="mailto:">
                        <h4>Correo electrónico</h4>
                        <p>Escríbenos para resolver tus dudas.</p>
                    </a>

                </div>
            </div>
        </section>
    );
}

export default Contacto;
