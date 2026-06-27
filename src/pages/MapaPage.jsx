import { Link } from "react-router-dom";
import Mapa from "../components/Mapa";

function MapaPage() {
  const origen = JSON.parse(localStorage.getItem("origen"));
  const destino = JSON.parse(localStorage.getItem("destino"));
  const rutaRecomendada = JSON.parse(localStorage.getItem("rutaRecomendada"));

  return (
    <div className="mapa-page">
      <div className="mapa-header">
        <Link to="/">
          <button className="volver-btn"> Volver</button>
        </Link>
      </div>

      <div className="mapa-full">
        <Mapa
          origen={origen}
          destino={destino}
          rutaRecomendada={rutaRecomendada}
        />
      </div>
    </div>
  );
}

export default MapaPage;