import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

function HistorialDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState(null);

  // =====================================
  // CARGAR DETALLE DEL HISTORIAL
  // =====================================
  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const response = await api.get(`/historial/detalle/${id}`);
        setDetalle(response.data);
      } catch (error) {
        console.error("Error cargando detalle:", error);
      }
    };

    cargarDetalle();
  }, [id]);

  // =====================================
  // ABRIR RUTA EN MAPA
  // =====================================
  const verMapa = () => {
    if (!detalle) {
      return;
    }

    // Ruta dibujada
    localStorage.setItem(
      "rutaRecomendada",
      JSON.stringify(detalle.tramo_geojson || null)
    );

    // Segmentos de buses
    localStorage.setItem(
      "segmentosRuta",
      JSON.stringify(detalle.segmentos || [])
    );

    // Caminata inicial
    localStorage.setItem(
      "caminataInicio",
      JSON.stringify(detalle.caminata_inicio || null)
    );

    // Caminata final
    localStorage.setItem(
      "caminataFin",
      JSON.stringify(detalle.caminata_fin || null)
    );

    // Información de transbordos
    localStorage.setItem(
      "transbordosInfo",
      JSON.stringify(detalle.transbordos_info || [])
    );

    // Origen
    localStorage.setItem(
      "origen",
      JSON.stringify({ nombre: detalle.origen })
    );

    // Destino
    localStorage.setItem(
      "destino",
      JSON.stringify({ nombre: detalle.destino })
    );

    console.log("Ruta cargada desde historial:", detalle);

    navigate("/mapa");
  };

  // =====================================
  // CARGANDO
  // =====================================
  if (!detalle) {
    return <p>Cargando conversación...</p>;
  }

  return (
    <div className="detalle-page">
      <div className="detalle-header">
        <h1>Conversación guardada</h1>

        <Link to="/historial">
          <button className="volver-btn">Volver</button>
        </Link>
      </div>

      <div className="detalle-card">
        {/* MENSAJE USUARIO */}
        <div className="mensaje-user">
          <h3>Consulta del usuario</h3>
          <div className="detalle-texto">{detalle.consulta}</div>
        </div>

        {/* RESPUESTA IA */}
        <div className="mensaje-bot">
          <h3>Respuesta de la IA</h3>
          <div className="detalle-texto">{detalle.respuesta}</div>

          {(detalle.tramo_geojson || detalle.segmentos) && (
            <button className="mapa-btn" onClick={verMapa}>
               Ver ruta en mapa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistorialDetalle;