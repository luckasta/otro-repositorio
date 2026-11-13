
function Contacto() {

    const enviarWhatsApp = async (event) => {
        event.preventDefault();

        const formulario = event.currentTarget;
        const datos = new FormData(formulario);

        const nombre = datos.get('nombre');
        const correo = datos.get('correo');
        const producto = datos.get('producto');
        const mensaje = datos.get('mensaje');

        const pedido = {
            nombre,
            correo,
            producto,
            mensaje
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

            const texto = `¡Hola! Quiero realizar un pedido en Dulce Tentación.

Nombre: ${nombre}
Correo: ${correo}
Producto: ${producto}
Detalles: ${mensaje}`;

            const url = `https://wa.me/573332536448?text=${encodeURIComponent(texto)}`;

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

                <div className="campo">
                    <label htmlFor="producto">¿Qué producto te interesa?</label>
                    <select id="producto" name="producto" required>
                        <option value="">Selecciona una opción</option>
                        <option value="tortas">Tortas</option>
                        <option value="cupcakes">Cupcakes</option>
                        <option value="postres">Postres</option>
                        <option value="galletas">Galletas</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div className="campo">
                    <label htmlFor="mensaje">Cuéntanos tu idea</label>
                    <textarea id="mensaje" name="mensaje" rows="5" placeholder="Describe tu pedido o idea..." required></textarea>
                </div>

                <button type="submit">Enviar mensaje</button>
            </form>
        </section>
    );
}

export default Contacto;
