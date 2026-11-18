
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function AsesoraIA() {
    const navigate = useNavigate();
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(false);
    const mensajesRef = useRef(null);
    const solicitudActual = useRef(0);

useEffect(() => {
    if (mensajesRef.current) {
        mensajesRef.current.scrollTop =
            mensajesRef.current.scrollHeight;
    }
}, [historial, cargando]);

const nuevaConversacion = () => {
    solicitudActual.current += 1;
    setHistorial([]);
    setMensaje('');
    setCargando(false);
};
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

    {historial.map((elemento, indice) => (
        <div
            key={indice}
            className={`mensaje-chat ${elemento.role}`}
        >
            <p>{elemento.content}</p>
        </div>
    ))}

    {cargando && (
        <div className="mensaje-chat assistant">
            <p>Estoy preparando tu respuesta... 💜</p>
        </div>
    )}

</div>

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
