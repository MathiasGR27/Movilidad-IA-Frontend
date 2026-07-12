import { Link } from "react-router-dom";
import Mapa from "../components/Mapa";

function MapaPage() {
  const leerLocalStorage = (
    clave,
    valorPredeterminado
  ) => {
    try {
      const valor =
        localStorage.getItem(clave);

      return valor
        ? JSON.parse(valor)
        : valorPredeterminado;
    } catch (error) {
      console.error(
        `Error leyendo ${clave}:`,
        error
      );

      return valorPredeterminado;
    }
  };

  const origen =
    leerLocalStorage(
      "origen",
      null
    );

  const destino =
    leerLocalStorage(
      "destino",
      null
    );

  const rutaRecomendada =
    leerLocalStorage(
      "rutaRecomendada",
      null
    );

  const segmentosRuta =
    leerLocalStorage(
      "segmentosRuta",
      []
    );

  const caminataInicio =
    leerLocalStorage(
      "caminataInicio",
      null
    );

  const caminataFin =
    leerLocalStorage(
      "caminataFin",
      null
    );

  const transbordosInfo =
    leerLocalStorage(
      "transbordosInfo",
      []
    );

  return (
    <div className="mapa-page">
      <div className="mapa-header">
        <Link to="/">
          <button
            type="button"
            className="volver-btn"
          >
            Volver
          </button>
        </Link>
      </div>

      <div className="mapa-full">
        <Mapa
          origen={origen}
          destino={destino}
          rutaRecomendada={
            rutaRecomendada
          }
          segmentos={
            segmentosRuta
          }
          caminataInicio={
            caminataInicio
          }
          caminataFin={
            caminataFin
          }
          transbordosInfo={
            transbordosInfo
          }
        />
      </div>
    </div>
  );
}

export default MapaPage;