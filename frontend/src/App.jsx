
import './App.css'
import { useState } from 'react';
import Admin from './componentes/admin';

function App() {
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  
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

if (mostrarAdmin) {
  return (
    <>
      <button onClick={() => setMostrarAdmin(false)}>
        Volver a la página principal
      </button>

      <Admin />
    </>
  );
}

  return (
    
    <>
      <header>
        <nav>
          <h1>Dulce Tentación</h1>

          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#Productos">Productos</a></li>
            <li><a href="#personalizados">Personalizados</a></li>
            <li><a href="#contacto">Contacto</a></li>
            <li>
  <button onClick={() => setMostrarAdmin(true)}>
    Administración
  </button>
</li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="inicio">
          <h2>La creatividad también se puede saborear</h2>

          <p>
            Creamos momentos especiales con postres únicos,
            diseños originales y mucho sabor.
          </p>

          <button>Descubre nuestras creaciones</button>
        </section>
        
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
            </article>

            <article className="producto">
              <img className="producto-imagen" src="/imagenes/portadadecupcake.jpg" alt="Cupcakes decorados" />
              <h3>Cupcakes</h3>
              <p>
                Pequeñas creaciones llenas de sabor,
                color y decoración.
              </p>
            </article>

            <article className="producto">
              <img className="producto-imagen" src="/imagenes/portadadepostres.png" alt="Postres personalizados" />
              <h3>Postres</h3>
              <p>
                Postres diseñados para darle un toque
                especial a cada ocasión.
              </p>
            </article>
            
            <article className="producto">
              <img className="producto-imagen" src="/imagenes/portadadegalletas.jpg" alt="Galletas creativas" />
              <h3>Galletas</h3>
              <p>
                Galletas con formas, colores y decoraciones
                originales para disfrutar y compartir.
              </p>
            </article>


          </div>
        </section>
        
        <section id="contacto">
          <h2>Hablemos de tu próxima creación</h2>

          <p>
            Cuéntanos qué tienes en mente y hagamos
            realidad algo delicioso.
          </p>

          <form className="formulario-contacto" onSubmit={enviarWhatsApp}>

            <div className="campo">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Escribe tu nombre"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="ejemplo@correo.com"
                required
              />
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
              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                placeholder="Describe tu pedido o idea..."
                required
              ></textarea>
            </div>

            <button type="submit">
              Enviar mensaje
            </button>

          </form>
        </section>


      </main>

       <footer className="footer">
        <div className="footer-contenido">
          <div className="footer-marca">
            <h2>Dulce Tentación</h2>
            <p>
              Creamos momentos especiales con postres únicos,
              diseños originales y mucho sabor.
            </p>
          </div>

          <div className="footer-enlaces">
            <h3>Explora</h3>
            <a href="#inicio">Inicio</a>
            <a href="#productos">Productos</a>
            <a href="#contacto">Contacto</a>
          </div>

          <div className="footer-contacto">
            <h3>¿Tienes una idea?</h3>
            <p>¡Nos encantará ayudarte a hacerla realidad!</p>
            <a
              href="https://wa.me/573332536448"
              target="_blank"
              rel="noreferrer"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>

        <div className="footer-final">
          <p>© 2026 Dulce Tentación. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  )
}

export default App