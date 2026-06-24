import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Historial() {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const [historial, setHistorial] = useState([]);

  const cargarHistorial = async () => {

    try {

      const response = await api.get(
        `/historial/${usuario.id}`
      );

      setHistorial(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const response = await api.get(`/historial/${usuario.id}`);
        if (mounted) setHistorial(response.data);
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [usuario.id]);

  const agregarFavorito = async (id) => {

    try {

      await api.put(
        `/favorito/${id}`
      );

      await cargarHistorial();

      alert(
        "Ruta agregada a favoritos"
      );

    } catch (error) {

      console.error(
        "Error agregando favorito:",
        error
      );

      alert(
        "No se pudo agregar a favoritos"
      );

    }

  };

  return (

    <div className="historial-page">

      <div className="historial-header">

        <h1>
          Historial de rutas
        </h1>

        <Link to="/">
          <button>
            ⬅ Volver
          </button>
        </Link>

      </div>

      {historial.length === 0 ? (

        <p>
          No existen rutas consultadas.
        </p>

      ) : (

        <table className="historial-table">

          <thead>

            <tr>
              <th>Fecha</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Transbordos</th>
              <th>Favorito</th>
              <th>Detalle</th>
            </tr>

          </thead>

          <tbody>

            {historial.map((ruta) => (

              <tr key={ruta.id}>

                <td>{ruta.fecha}</td>

                <td>{ruta.origen}</td>

                <td>{ruta.destino}</td>

                <td>{ruta.transbordos}</td>

                <td>

                  {ruta.es_favorito ? (

                    <span
                      className="favorito-activo"
                    >
                      ⭐ Guardada
                    </span>

                  ) : (

                    <button
                      className="favorito-btn"
                      onClick={() =>
                        agregarFavorito(
                          ruta.id
                        )
                      }
                    >
                      ⭐ Agregar
                    </button>

                  )
                  }

                </td>

                <td>
                    <Link
                        to={`/historial/detalle/${ruta.id}`}
                    >
                        <button>
                        Ver
                        </button>
                    </Link>

                    </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default Historial;