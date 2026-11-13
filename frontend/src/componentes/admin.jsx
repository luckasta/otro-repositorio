
import { useState } from 'react';
import './admin.css';

function Admin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(localStorage.getItem('tokenAdmin'));
    const [pedidos, setPedidos] = useState([]);
    const [filtro, setFiltro] = useState('Todos');
    const [seccionActiva, setSeccionActiva] = useState('pedidos');
    const [promociones, setPromociones] = useState([]);
    const [cargando, setCargando] = useState(false);
    const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtro === 'Todos') {
        return true;
    }

    return (pedido.estado || 'Pendiente') === filtro;
});

    const cargarPedidos = async (tokenAdmin) => {
        setCargando(true);
        setError('');

        try {
            const respuesta = await fetch(
                'http://localhost:3000/api/admin/pedidos',
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


const cargarPromociones = async (tokenAdmin) => {
    setCargando(true);
    setError('');

    try {
        const respuesta = await fetch(
            'http://localhost:3000/api/admin/promociones',
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

        setPromociones(datos);

    } catch (error) {
        setError(error.message);
    } finally {
        setCargando(false);
    }
};


    const actualizarEstado = async (id, nuevoEstado) => {
    try {
        const respuesta = await fetch(
            `http://localhost:3000/api/admin/pedidos/${id}`,
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

    const iniciarSesion = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const respuesta = await fetch(
                'http://localhost:3000/api/admin/login',
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
            await cargarPromociones(datos.token);

        } catch (error) {
            setError(error.message);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('tokenAdmin');
        setToken(null);
        setPedidos([]);
        setEmail('');
        setPassword('');
        setError('');
    };

    if (token) {
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

                <div className="admin-navegacion">

                <button
                        className={seccionActiva === 'pedidos' ? 'admin-seccion-activa' : ''}
                        onClick={() => setSeccionActiva('pedidos')}
                >
                            Pedidos
                        </button>

                <button
                        className={seccionActiva === 'promociones' ? 'admin-seccion-activa' : ''}
                        onClick={() => setSeccionActiva('promociones')}
                >
                            Promociones
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
</div>

                            </div>
                            
                            <p>
                                <strong>Fecha:</strong>{' '}
                                {pedido.fecha
                                ? new Date(pedido.fecha).toLocaleString('es-CO')
                                : 'Pedido anterior'}
                            </p>

                        </article>
                    ))}
                </div>
                    </>
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

