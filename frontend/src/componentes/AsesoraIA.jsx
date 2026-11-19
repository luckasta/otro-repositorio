// Importar las herramientas de React para controlar estados,
// referencias y efectos dentro del componente.
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

// Componente encargado de mostrar y gestionar el chat de la asesora virtual.
function AsesoraIA() {

    // Permitir la navegación hacia el formulario de contacto desde el chat.
    const navigate = useNavigate();
    // Controlar la apertura del chat, los mensajes, el historial y el estado de carga.
// Las referencias permiten desplazar los mensajes y controlar las solicitudes activas.
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(false);
    const mensajesRef = useRef(null);
    const solicitudActual = useRef(0);

// Desplazar automáticamente el área de conversación hasta el último mensaje
// cada vez que cambia el historial o el estado de carga.
useEffect(() => {
    if (mensajesRef.current) {
        mensajesRef.current.scrollTop =
            mensajesRef.current.scrollHeight;
    }
}, [historial, cargando]);

// Reiniciar la conversación y limpiar los mensajes escritos.
// También se invalida cualquier solicitud anterior que siga pendiente.
const nuevaConversacion = () => {
    solicitudActual.current += 1;
    setHistorial([]);
    setMensaje('');
    setCargando(false);
};

// Enviar el mensaje del usuario al backend para obtener una respuesta de la IA.
// Se actualiza el historial y se controlan los estados de carga y posibles errores.
const enviarMensaje = async (event) => {
    event.preventDefault();

    if (!mensaje.trim() || cargando) {
        return;
    }

    const nuevoMensaje = {
        role: 'user',
        content: mensaje.trim()
    };

    const nuevoHistorial = [...historial, nuevoMensaje];

    setHistorial(nuevoHistorial);
    setMensaje('');
    setCargando(true);

    const solicitud = ++solicitudActual.current;

    try {
        const respuesta = await fetch(`${API_URL}/api/ia/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mensaje: nuevoMensaje.content,
                historial
            })
        });

        const datos = await respuesta.json();

        if (solicitud !== solicitudActual.current) {
    return;
}

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'No se pudo obtener una respuesta');
        }

        setHistorial([
            ...nuevoHistorial,
            {
                role: 'assistant',
                content: datos.respuesta
            }
        ]);

    } catch (error) {
        if (solicitud !== solicitudActual.current) {
    return;
}
        console.error('Error al comunicarse con la asesora:', error);

        setHistorial([
            ...nuevoHistorial,
            {
                role: 'assistant',
                content: 'Lo siento, no pude responder en este momento. Inténtalo nuevamente. 💜'
            }
        ]);

    } finally {
        if (solicitud === solicitudActual.current) {
    setCargando(false);
}
    }
};

// Construir la ventana de chat, mostrar los mensajes y ofrecer
// opciones para iniciar una nueva conversación o continuar con un pedido.
    return (
        <div className="asesora-ia">
            <button
                className="boton-asesora"
                onClick={() => setAbierto(!abierto)}
            >
                ¿Necesitas ayuda? 💜
            </button>

            {abierto && (
                <div className="ventana-asesora">
                    <div className="encabezado-asesora">
    <h3>Asesora virtual</h3>

    <div className="acciones-asesora">
        <button
            type="button"
            onClick={nuevaConversacion}
            title="Nueva conversación"
        >
            ↻
        </button>

        <button
            type="button"
            onClick={() => setAbierto(false)}
            title="Cerrar chat"
        >
            ✕
        </button>
    </div>
</div>

                    
<div className="contenido-asesora" ref={mensajesRef}>

    <div className="mensaje-asesora">
        <p>
            ¡Hola! Bienvenido a Dulce Tentación.
            💜 ¿Qué te gustaría encontrar hoy?
        </p>
    </div>

{/* Recorrer el historial y mostrar los mensajes del usuario y de la asesora. */}
    {historial.map((elemento, indice) => (
        <div
            key={indice}
            className={`mensaje-chat ${elemento.role}`}
        >
            <p>{elemento.content}</p>
        </div>
    ))}

{/* Mostrar un indicador mientras se espera la respuesta de la inteligencia artificial. */}
    {cargando && (
        <div className="mensaje-chat assistant">
            <p>Estoy preparando tu respuesta... 💜</p>
        </div>
    )}

</div>

{/* Formulario para escribir y enviar mensajes a la asesora virtual. */}
<form className="formulario-asesora" onSubmit={enviarMensaje}>
    <input
        type="text"
        placeholder="Escribe tu mensaje..."
        value={mensaje}
        onChange={(event) => setMensaje(event.target.value)}
        maxLength={1000}
        disabled={cargando}
    />

    <button type="submit" disabled={cargando || !mensaje.trim()}>
        Enviar
    </button>
</form>

{/* Permitir que el usuario continúe hacia el formulario de contacto para realizar su pedido. */}
<div className="continuar-pedido">
    <button
        type="button"
        onClick={() => {
            setAbierto(false);
            navigate('/contactos');
        }}
    >
        Continuar con mi pedido
    </button>
</div>


                </div>
            )}
        </div>
    );
}

export default AsesoraIA;
