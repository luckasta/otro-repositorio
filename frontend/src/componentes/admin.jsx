// Importar las herramientas de React, los estilos del panel administrativo
// y la dirección del backend para realizar las solicitudes a la API.
import { useState } from 'react';
import './admin.css';
import API_URL from '../config';

// Obtener la ruta base del proyecto para construir correctamente
// las rutas de las imágenes cuando el sitio está publicado.
const BASE_URL = import.meta.env.BASE_URL;

// Componente principal del panel administrativo.
// Permite gestionar los pedidos, combos y precios de los productos.
function Admin() {
    // Estados para controlar las credenciales, la sesión administrativa,
// los pedidos, los precios, los combos y la información de la interfaz.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(localStorage.getItem('tokenAdmin'));
    const [pedidos, setPedidos] = useState([]);
    const [precios, setPrecios] = useState({
    tortas: 0,
    cupcakes: 0,
    postres: 0,
    galletas: 0
    });
    const [cargandoPrecios, setCargandoPrecios] = useState(false);
    const [guardandoPrecios, setGuardandoPrecios] = useState(false);
    const [filtro, setFiltro] = useState('Todos');
    const [seccionActiva, setSeccionActiva] = useState('pedidos');
    const [combos, setCombos] = useState([]);
    const [nuevoCombo, setNuevoCombo] = useState({
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: '',
    activa: true
});
    const [comboEditando, setComboEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    // Filtrar los pedidos según el estado seleccionado en el panel.
// Si se selecciona "Todos", se muestran todos los pedidos registrados.
    const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtro === 'Todos') {
        return true;
    }

    return (pedido.estado || 'Pendiente') === filtro;
});

// Consultar los pedidos registrados en la base de datos.
// Se utiliza el token de administrador para autorizar la solicitud.
    const cargarPedidos = async (tokenAdmin) => {
        setCargando(true);
        setError('');

        try {
            const respuesta = await fetch(
    `${API_URL}/api/admin/pedidos`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenAdmin}`
                    }
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje);
            }

            setPedidos(datos);

        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

// Registrar un nuevo combo mediante una solicitud POST al backend.
// Después de guardarlo, limpiar el formulario y actualizar la lista.
const cargarCombos = async (tokenAdmin) => {
    setCargando(true);
    setError('');

    try {
       const respuesta = await fetch(`${API_URL}/api/admin/combos`, {
            headers: {
                Authorization: `Bearer ${tokenAdmin}`
            }
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje);
        }

        setCombos(datos);

    } catch (error) {
        setError(error.message);
    } finally {
        setCargando(false);
    }
};

const guardarCombo = async (event) => {
    event.preventDefault();

    try {

        const respuesta = await fetch(`${API_URL}/api/admin/combos`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(nuevoCombo)
});

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje);
        }

        alert('¡Combo registrado correctamente!');

        setNuevoCombo({
            nombre: '',
            descripcion: '',
            imagen: '',
            precio: '',
            activa: true
        });

        cargarCombos(token);

    } catch (error) {
        console.error('Error al guardar combo:', error);
        alert(error.message);
    }
};

// Modificar la información de un combo existente mediante una solicitud PATCH.
// Al finalizar, limpiar el formulario y actualizar la lista de combos.
const actualizarCombo = async (event) => {
    event.preventDefault();

    try {
        const respuesta = await fetch(
            `${API_URL}/api/admin/combos/${comboEditando._id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(nuevoCombo)
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje);
        }

        alert('¡Combo actualizado correctamente!');

        setComboEditando(null);

        setNuevoCombo({
            nombre: '',
            descripcion: '',
            imagen: '',
            precio: '',
            activa: true
        });

        cargarCombos(token);

    } catch (error) {
        console.error('Error al actualizar combo:', error);
        alert(error.message);
    }
};

const editarCombo = (combo) => {
    setComboEditando(combo);

    setNuevoCombo({
        nombre: combo.nombre,
        descripcion: combo.descripcion,
        imagen: combo.imagen || '',
        precio: combo.precio,
        activa: combo.activa
    });
};

// Solicitar confirmación y eliminar el combo seleccionado del sistema.
const eliminarCombo = async (id) => {
    const confirmar = window.confirm(
        '¿Estás seguro de que deseas eliminar este combo?'
    );

    if (!confirmar) return;

    try {
        const respuesta = await fetch(
           `${API_URL}/api/admin/combos/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje);
        }

        alert('Combo eliminado correctamente');

        cargarCombos(token);

    } catch (error) {
        console.error('Error al eliminar combo:', error);
        alert(error.message);
    }
};

// Consultar los precios actuales de los productos desde el backend
// y actualizar los valores mostrados en el panel.
const cargarPrecios = async () => {
    setCargandoPrecios(true);
    setError('');

    try {
       const respuesta = await fetch(`${API_URL}/api/precios`);

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje);
        }

        setPrecios({
            tortas: datos.tortas ?? 0,
            cupcakes: datos.cupcakes ?? 0,
            postres: datos.postres ?? 0,
            galletas: datos.galletas ?? 0
        });

    } catch (error) {
        setError(error.message);
    } finally {
        setCargandoPrecios(false);
    }
};

// Enviar los nuevos precios al backend para actualizar los valores
// almacenados. Se convierten a números antes de enviarlos.
const guardarPrecios = async () => {
    setGuardandoPrecios(true);
    setError('');

    try {
        const tokenAdmin = localStorage.getItem('tokenAdmin');

        const respuesta = await fetch(`${API_URL}/api/admin/precios`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenAdmin}`
            },
            body: JSON.stringify({
                tortas: Number(precios.tortas),
                cupcakes: Number(precios.cupcakes),
                postres: Number(precios.postres),
                galletas: Number(precios.galletas)
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje);
        }

        setPrecios(datos.precios);
        setError('');
        alert('¡Precios actualizados correctamente!');

    } catch (error) {
        setError(error.message);
    } finally {
        setGuardandoPrecios(false);
    }
};

// Cambiar el estado de un pedido y volver a consultar la lista
// para mostrar la información actualizada.
    const actualizarEstado = async (id, nuevoEstado) => {
    try {
        const respuesta = await fetch(
            `${API_URL}/api/admin/pedidos/${id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    estado: nuevoEstado
                })
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje);
        }

        await cargarPedidos(token);

    } catch (error) {
        setError(error.message);
    }
};

// Solicitar confirmación y eliminar un pedido del sistema.
// Después de eliminarlo, actualizar la lista de pedidos.
const eliminarPedido = async (id) => {
    const confirmar = window.confirm(
        '¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.'
    );

    if (!confirmar) return;

    try {
        const respuesta = await fetch(
            `${API_URL}/api/admin/pedidos/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje);
        }

        alert('Pedido eliminado correctamente');

        await cargarPedidos(token);

    } catch (error) {
        console.error('Error al eliminar pedido:', error);
        setError(error.message);
    }
};

// Enviar las credenciales del administrador al backend para verificar su identidad.
// Si son correctas, guardar el token de autenticación e ingresar al panel.
    const iniciarSesion = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const respuesta = await fetch(
                `${API_URL}/api/admin/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje);
            }

            localStorage.setItem('tokenAdmin', datos.token);
            setToken(datos.token);

            await cargarPedidos(datos.token);
            await cargarCombos(datos.token);

        } catch (error) {
            setError(error.message);
        }
    };

    // Cerrar la sesión administrativa, eliminar el token almacenado
// y limpiar los datos de la interfaz.
    const cerrarSesion = () => {
        localStorage.removeItem('tokenAdmin');
        setToken(null);
        setPedidos([]);
        setEmail('');
        setPassword('');
        setError('');
    };

    // Verificar si existe un token de autenticación para mostrar
// el panel administrativo o, en caso contrario, el formulario de acceso.
    if (token) {

        // Construir la interfaz principal del panel administrativo,
// incluyendo la navegación entre las secciones de gestión.
        return (
            <section className="admin-panel">

            <header className="admin-header">
                <div>
                    <h1>Dulce Tentación</h1>
                    <p>Panel de administración</p>
                </div>

                <button onClick={cerrarSesion}>
                    Cerrar sesión
                </button>
            </header>

            <div className="admin-contenido">

                <div className="admin-bienvenida">
                    <h2>¡Bienvenido!</h2>
                    <p>Aquí puedes gestionar los pedidos de tus clientes.</p>
                </div>

{/* Botones para cambiar entre la gestión de pedidos, combos y precios. */}
                <div className="admin-navegacion">

    <button
        className={`admin-nav-boton ${seccionActiva === 'pedidos' ? 'admin-seccion-activa' : ''}`}
        onClick={() => setSeccionActiva('pedidos')}
    >
        <span className="admin-nav-icono">📦</span>
        <span>Pedidos</span>
    </button>

    <button
        className={`admin-nav-boton ${seccionActiva === 'combos' ? 'admin-seccion-activa' : ''}`}
        onClick={() => setSeccionActiva('combos')}
    >
        <span className="admin-nav-icono">🧁</span>
        <span>Gestión de combos</span>
    </button>

    <button
        className={`admin-nav-boton ${seccionActiva === 'precios' ? 'admin-seccion-activa' : ''}`}
        onClick={() => {
            setSeccionActiva('precios');
            cargarPrecios();
        }}
    >
        <span className="admin-nav-icono">💰</span>
        <span>Precios de productos</span>
    </button>



</div>
                {seccionActiva === 'pedidos' && (
                    <>
                

                <div className="admin-resumen">
                    <div className="admin-resumen-tarjeta">
                        <h3>Total de pedidos</h3>
                        <p>{pedidos.length}</p>
                    </div>
                </div>

                <div className="admin-pedidos-titulo">
                    <h2>Pedidos recibidos</h2>

                    <button onClick={() => cargarPedidos(token)}>
                        Actualizar pedidos
                    </button>
                </div>

                <div className="admin-filtros">
    <button
        className={filtro === 'Todos' ? 'filtro-activo' : ''}
        onClick={() => setFiltro('Todos')}
    >
        Todos
    </button>

    <button
        className={filtro === 'Pendiente' ? 'filtro-activo' : ''}
        onClick={() => setFiltro('Pendiente')}
    >
        Pendientes
    </button>

    <button
        className={filtro === 'En preparación' ? 'filtro-activo' : ''}
        onClick={() => setFiltro('En preparación')}
    >
        En preparación
    </button>

    <button
        className={filtro === 'Entregado' ? 'filtro-activo' : ''}
        onClick={() => setFiltro('Entregado')}
    >
        Entregados
    </button>

    <button
        className={filtro === 'Cancelado' ? 'filtro-activo' : ''}
        onClick={() => setFiltro('Cancelado')}
    >
        Cancelados
    </button>
</div>

                {cargando && <p>Cargando pedidos...</p>}

                {error && <p className="admin-error">{error}</p>}

                {!cargando && !error && pedidos.length === 0 && (
                    <p>Todavía no hay pedidos registrados.</p>
                )}

                <div className="lista-pedidos">
                    {pedidosFiltrados.map((pedido) => (
                        <article className="pedido-card" key={pedido._id}>

                            <h3>{pedido.producto}</h3>

                            <p>
                                <strong>Cliente:</strong> {pedido.nombre}
                            </p>

                            <p>
                                <strong>Correo:</strong> {pedido.correo}
                            </p>
                            {pedido.tematica && (
    <p>
        <strong>Temática:</strong> {pedido.tematica}
    </p>
)}

{pedido.colores && (
    <p>
        <strong>Colores:</strong> {pedido.colores}
    </p>
)}

{pedido.sabor && (
    <p>
        <strong>Sabor:</strong> {pedido.sabor}
    </p>
)}

{pedido.relleno && (
    <p>
        <strong>Relleno:</strong> {pedido.relleno}
    </p>
)}

{pedido.porciones && (
    <p>
        <strong>Porciones:</strong> {pedido.porciones}
    </p>
)}

{pedido.cantidad && (
    <p>
        <strong>Cantidad:</strong> {pedido.cantidad}
    </p>
)}

{pedido.decoracion && (
    <p>
        <strong>Decoración:</strong> {pedido.decoracion}
    </p>
)}

{pedido.forma && (
    <p>
        <strong>Forma:</strong> {pedido.forma}
    </p>
)}

{pedido.tipoPostre && (
    <p>
        <strong>Tipo de postre:</strong> {pedido.tipoPostre}
    </p>
)}

{pedido.presentacion && (
    <p>
        <strong>Presentación:</strong> {pedido.presentacion}
    </p>
)}

                            <p>
                                <strong>Detalles:</strong> {pedido.mensaje}
                            </p>
                            <div className="pedido-estado">
                                <label>Estado del pedido:</label>
                                
<div className="estado-botones">
    <button
        type="button"
        className={pedido.estado === 'Pendiente' ? 'estado-opcion pendiente seleccionado' : 'estado-opcion pendiente'}
        onClick={() => actualizarEstado(pedido._id, 'Pendiente')}
    >
        Pendiente
    </button>

    <button
        type="button"
        className={pedido.estado === 'En preparación' ? 'estado-opcion preparacion seleccionado' : 'estado-opcion preparacion'}
        onClick={() => actualizarEstado(pedido._id, 'En preparación')}
    >
        En preparación
    </button>

    <button
        type="button"
        className={pedido.estado === 'Entregado' ? 'estado-opcion entregado seleccionado' : 'estado-opcion entregado'}
        onClick={() => actualizarEstado(pedido._id, 'Entregado')}
    >
        Entregado
    </button>
{pedido.estado === 'Cancelado' && (
    <span className="estado-opcion cancelado seleccionado">
        Cancelado
    </span>
)}
</div>

                            </div>
                            
                            
<p>
    <strong>Fecha:</strong>{' '}
    {pedido.fecha
        ? new Date(pedido.fecha).toLocaleString('es-CO')
        : 'Pedido anterior'}
</p>

<p>
    <strong>Fecha de entrega:</strong>{' '}
    {pedido.fechaEntrega
        ? new Date(`${pedido.fechaEntrega}T00:00:00`).toLocaleDateString('es-CO')
        : 'No especificada'}
</p>

<p>
    <strong>Hora de entrega:</strong>{' '}
    {pedido.horaEntrega
        ? pedido.horaEntrega.slice(0, 5)
        : 'No especificada'}
</p>


                             <div className="pedido-acciones">

    <button
        type="button"
        className="pedido-cancelar"
        onClick={() => actualizarEstado(pedido._id, 'Cancelado')}
    >
        Cancelar pedido
    </button>

    <button
        type="button"
        className="pedido-eliminar"
        onClick={() => eliminarPedido(pedido._id)}
    >
        Eliminar pedido
    </button>

</div>

                        </article>
                    ))}
                </div>
                    </>
)}

{/* Mostrar el formulario para consultar y actualizar los precios de los productos. */}
{seccionActiva === 'precios' && (
    <section className="admin-precios">

        <div className="admin-precios-titulo">
            <h2>Precios de productos</h2>
            <p>
                Establece el precio mínimo desde el que se ofrecen
                nuestros productos personalizados.
            </p>
        </div>

        {cargandoPrecios ? (
            <p>Cargando precios...</p>
        ) : (
            <form
                className="admin-precios-formulario"
                onSubmit={(event) => {
                    event.preventDefault();
                    guardarPrecios();
                }}
            >

                <div className="admin-precio-campo">
                    <label htmlFor="precio-tortas">Tortas (COP)</label>
                    <input
                        id="precio-tortas"
                        type="text"
                        input="numeric"
                        value={precios.tortas}
                        onChange={(event) =>
                            setPrecios({
                                ...precios,
                                tortas: event.target.value
                            })
                        }
                        required
                    />
                </div>

                <div className="admin-precio-campo">
                    <label htmlFor="precio-cupcakes">Cupcakes (COP)</label>
                    <input
                        id="precio-cupcakes"
                        type="text"
                        input="numeric"
                        value={precios.cupcakes}
                        onChange={(event) =>
                            setPrecios({
                                ...precios,
                                cupcakes: event.target.value
                            })
                        }
                        required
                    />
                </div>

                <div className="admin-precio-campo">
                    <label htmlFor="precio-postres">Postres (COP)</label>
                    <input
                        id="precio-postres"
                        type="text"
                        input="numeric"
                        value={precios.postres}
                        onChange={(event) =>
                            setPrecios({
                                ...precios,
                                postres: event.target.value
                            })
                        }
                        required
                    />
                </div>

                <div className="admin-precio-campo">
                    <label htmlFor="precio-galletas">Galletas (COP)</label>
                    <input
                        id="precio-galletas"
                        type="text"
                        input="numeric"
                        value={precios.galletas}
                        onChange={(event) =>
                            setPrecios({
                                ...precios,
                                galletas: event.target.value
                            })
                        }
                        required
                    />
                </div>

                {error && (
                    <p className="admin-error">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={guardandoPrecios}
                >
                    {guardandoPrecios ? 'Guardando...' : 'Guardar precios'}
                </button>

            </form>
        )}

    </section>
)}

{/* Mostrar el formulario y el listado para crear, editar y eliminar combos. */}
{seccionActiva === 'combos' && (
    <section className="admin-combos">
        <div className="admin-combos-titulo">
            <h2>Administrar combos</h2>
            <p>
                Aquí puedes consultar y gestionar los combos
                disponibles de Dulce Tentación.
            </p>
        </div>
        <form
        className="admin-combos-formulario"
        onSubmit={comboEditando ? actualizarCombo : guardarCombo}
>

    <h3>
    {comboEditando ? 'Editar combo' : 'Agregar un nuevo combo'}
</h3>

    <div className="campo">
        <label htmlFor="nombreCombo">Nombre del combo</label>
        <input
            type="text"
            id="nombreCombo"
            value={nuevoCombo.nombre}
            onChange={(e) => setNuevoCombo({
                ...nuevoCombo,
                nombre: e.target.value
            })}
            required
        />
    </div>

    <div className="campo">
        <label htmlFor="descripcionCombo">Descripción</label>
        <textarea
            id="descripcionCombo"
            value={nuevoCombo.descripcion}
            onChange={(e) => setNuevoCombo({
                ...nuevoCombo,
                descripcion: e.target.value
            })}
            required
        />
    </div>

    <div className="campo">
        <label htmlFor="precioCombo">Precio</label>
        <input
            type="text"
            id="precioCombo"
            min="1"
            value={nuevoCombo.precio}
            onChange={(e) => setNuevoCombo({
                ...nuevoCombo,
                precio: e.target.value
            })}
            required
        />
    </div>
    <div className="campo">
    <label htmlFor="imagenCombo">Imagen del combo</label>
    <input
        type="text"
        id="imagenCombo"
        value={nuevoCombo.imagen}
        onChange={(e) => setNuevoCombo({
            ...nuevoCombo,
            imagen: e.target.value
        })}
        placeholder={`${BASE_URL}imagenes/combo-dulce.jpg`}
    />
</div>

    <button type="submit">
    {comboEditando ? 'Guardar cambios' : 'Guardar combo'}
</button>

{comboEditando && (
    <button
        type="button"
        onClick={() => {
            setComboEditando(null);
            setNuevoCombo({
                nombre: '',
                descripcion: '',
                imagen: '',
                precio: '',
                activa: true
            });
        }}
    >
        Cancelar edición
    </button>
)}

</form>

        {cargando ? (
            <p>Cargando combos...</p>
        ) : combos.length === 0 ? (
            <p>Aún no hay combos registrados.</p>
        ) : (
            <div className="admin-combos-lista">
                {combos.map((combo) => (
                    <article key={combo._id} className="admin-combo-tarjeta">
                        <h3>{combo.nombre}</h3>
                        <p>{combo.descripcion}</p>
                        <p>Precio: ${combo.precio}</p>
                        <p>
                            Estado: {combo.activa ? 'Activo' : 'Inactivo'}
                        </p>
                        <button
                            type="button"
                            onClick={() => editarCombo(combo)}
                        >
                            Editar
                        </button>
                        <button
    type="button"
    onClick={() => eliminarCombo(combo._id)}
>
    Eliminar
</button>
                    </article>
                ))}
            </div>
        )}
    </section>
)}

            </div>
        </section>
    );

}

    return (
        <section className="admin-login">
            <div className="admin-login-contenido">
                <h1>Panel administrativo</h1>
                <p>Ingresa tus credenciales para continuar.</p>

                <form onSubmit={iniciarSesion}>
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Tu correo"
                        required
                    />

                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Tu contraseña"
                        required
                    />

                    <button type="submit">Iniciar sesión</button>
                </form>

                {error && <p className="admin-error">{error}</p>}
            </div>
        </section>
    );
}

export default Admin;

