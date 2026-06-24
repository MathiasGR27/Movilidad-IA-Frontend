import { useEffect, useState } from "react";
import api from "../services/api";

function ChatBot({ setOrigen, setDestino, setRutaRecomendada }) {
  const [mensaje, setMensaje] = useState("");

  const [mensajes, setMensajes] = useState(() => {
    const guardados = localStorage.getItem("mensajes_chat");

    return guardados
      ? JSON.parse(guardados)
      : [
        {
          tipo: "bot",
          texto: "Hola ¿A dónde quieres ir?"
        }
      ];
  });

  useEffect(() => {

    const crearConversacion = async () => {

      const conversacionActual =
        localStorage.getItem(
          "conversacion_id"
        );

      if (!conversacionActual) {

        try {

          const response =
            await api.post(
              "/conversaciones"
            );

          localStorage.setItem(
            "conversacion_id",
            response.data.id
          );

        } catch (error) {

          console.error(
            "Error creando conversación",
            error
          );

        }

      }

    };

    crearConversacion();

  }, []);

  useEffect(() => {
    localStorage.setItem("mensajes_chat", JSON.stringify(mensajes));
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const mensajeUsuario = {
      tipo: "user",
      texto: mensaje
    };

    setMensajes((prev) => [...prev, mensajeUsuario]);

    try {
      const conversacionId = localStorage.getItem(
        "conversacion_id"
      );

      const res = await api.post("/chat", {

        mensaje,

        conversacion_id: Number(
          conversacionId
        )

      });

      setOrigen(res.data.origen);
      setDestino(res.data.destino);
      setRutaRecomendada(res.data.tramo_geojson);

      localStorage.setItem("origen", JSON.stringify(res.data.origen));
      localStorage.setItem("destino", JSON.stringify(res.data.destino));
      localStorage.setItem("transbordosInfo", JSON.stringify(res.data.transbordos_info || []));
      localStorage.setItem(
        "rutaRecomendada",
        JSON.stringify(res.data.tramo_geojson)
      );

      const mensajeBot = {
        tipo: "bot",
        texto: res.data.respuesta
      };

      setMensajes((prev) => [...prev, mensajeBot]);
      setMensaje("");
    } catch (error) {
      console.error("Error en chatbot:", error);

      setMensajes((prev) => [
        ...prev,
        {
          tipo: "bot",
          texto: "Ocurrió un error al procesar tu consulta. Intenta escribir el origen y destino con más detalle."
        }
      ]);
    }
  };



  return (
    <div className="chat-section">
      <div className="chat-header">
        <h3>Asistente de rutas</h3>
      </div>



      <div className="chat-messages">
        {mensajes.map((item, index) => (
          <div key={index} className={`message-row ${item.tipo}`}>
            {item.tipo === "bot" && <div className="avatar">🤖</div>}

            <div className="bubble">{item.texto}</div>

            {item.tipo === "user" && (
              <div className="avatar user-avatar">👤</div>
            )}
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          placeholder="Ej: quiero ir desde el Shopping hasta Ciudad Verde"
        />

        <button onClick={enviarMensaje}>➤</button>
      </div>
    </div>
  );
}

export default ChatBot;