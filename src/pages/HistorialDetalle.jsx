import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function HistorialDetalle() {

  const { id } = useParams();

  const [detalle, setDetalle] = useState(null);

  useEffect(() => {

    const cargarDetalle = async () => {

      try {

        const response = await api.get(
          `/historial/detalle/${id}`
        );

        setDetalle(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

    cargarDetalle();

  }, [id]);

  if (!detalle) {

    return (
      <p>Cargando conversación...</p>
    );

  }

  return (

    <div className="detalle-page">

      <div className="detalle-header">

        <h1>
          Conversación guardada
        </h1>

        <Link to="/historial">
          <button>
            ⬅ Volver
          </button>
        </Link>

      </div>

      <div className="detalle-card">

        <div className="mensaje-user">

          <h3>
            Consulta del usuario
          </h3>

          <div className="detalle-texto">
            {detalle.consulta}
          </div>

        </div>

        <div className="mensaje-bot">

          <h3>
            Respuesta de la IA
          </h3>

          <div className="detalle-texto">
            {detalle.respuesta}
          </div>

        </div>

      </div>

    </div>

  );

}

export default HistorialDetalle;