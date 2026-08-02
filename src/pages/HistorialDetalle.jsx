import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaRobot,
  FaArrowLeft,
  FaMapMarkedAlt,
} from "react-icons/fa";

import api from "../services/api";

function HistorialDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // CARGAR DETALLE DEL HISTORIAL
  // =====================================
  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setCargando(true);
        setError("");

        const response = await api.get(`/historial/detalle/${id}`);
        setDetalle(response.data);
      } catch (error) {
        console.error("Error cargando detalle:", error);

        setError(
          error.response?.data?.mensaje ||
            "No fue posible cargar la conversación."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [id]);

  // =====================================
  // ABRIR RUTA EN MAPA
  // =====================================
  const verMapa = () => {
    if (!detalle) return;

    localStorage.setItem(
      "rutaRecomendada",
      JSON.stringify(detalle.tramo_geojson || null)
    );

    localStorage.setItem(
      "segmentosRuta",
      JSON.stringify(detalle.segmentos || [])
    );

    localStorage.setItem(
      "caminataInicio",
      JSON.stringify(detalle.caminata_inicio || null)
    );

    localStorage.setItem(
      "caminataFin",
      JSON.stringify(detalle.caminata_fin || null)
    );

    localStorage.setItem(
      "transbordosInfo",
      JSON.stringify(detalle.transbordos_info || [])
    );

    localStorage.setItem(
      "origen",
      JSON.stringify({
        nombre: detalle.origen || "Origen",
      })
    );

    localStorage.setItem(
      "destino",
      JSON.stringify({
        nombre: detalle.destino || "Destino",
      })
    );

    console.log("Ruta cargada desde historial:", detalle);

    navigate("/mapa");
  };

  // =====================================
  // ESTADOS DE CARGA Y ERROR
  // =====================================
  if (cargando) {
    return (
      <div className="detalle-page historial-detalle-state">
        <div className="detalle-loader"></div>
        <p>Cargando conversación...</p>
      </div>
    );
  }

  if (error || !detalle) {
    return (
      <div className="detalle-page historial-detalle-state">
        <h2>No se pudo cargar la conversación</h2>
        <p>{error}</p>

        <Link to="/historial">
          <button className="volver-btn">
            <FaArrowLeft />
            Volver al historial
          </button>
        </Link>
      </div>
    );
  }

  const existeRuta =
    detalle.tramo_geojson ||
    detalle.segmentos?.length > 0 ||
    detalle.caminata_inicio ||
    detalle.caminata_fin;

  return (
    <div className="detalle-page">
      <div className="detalle-header">
        <div>
          <span className="detalle-eyebrow">Historial de rutas</span>
          <h1>Conversación guardada</h1>
          <p>Consulta los mensajes y vuelve a visualizar el recorrido.</p>
        </div>

        <Link to="/historial" className="detalle-back-link">
          <button className="volver-btn">
            <FaArrowLeft />
            Volver
          </button>
        </Link>
      </div>

      <div className="detalle-chat-card">
        <div className="detalle-chat-header">
          <div className="detalle-chat-status">
            <span className="detalle-status-dot"></span>

            <div>
              <strong>ChatBus</strong>
              <span>Conversación almacenada</span>
            </div>
          </div>
        </div>

        <div className="detalle-chat-messages">
          {/* MENSAJE DEL USUARIO */}
          <div className="message-row user detalle-message-row">
            <div className="bubble detalle-user-bubble">
              <span className="detalle-message-author">Tú</span>

              <div className="detalle-texto">
                {detalle.consulta}
              </div>
            </div>

            <div className="avatar user-avatar">
              <FaUser />
            </div>
          </div>

          {/* RESPUESTA DEL ASISTENTE */}
          <div className="message-row bot detalle-message-row">
            <div className="avatar detalle-bot-avatar">
              <FaRobot />
            </div>

            <div className="bubble detalle-bot-bubble">
              <span className="detalle-message-author">
                Asistente ChatBus
              </span>

              <div className="detalle-texto">
                {detalle.respuesta}
              </div>

              {existeRuta && (
                <button
                  type="button"
                  className="detalle-map-button"
                  onClick={verMapa}
                >
                  <FaMapMarkedAlt />
                  Ver ruta en el mapa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistorialDetalle;