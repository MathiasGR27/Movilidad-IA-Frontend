import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===========================
   ICONOS PERSONALIZADOS
=========================== */

const iconoOrigen = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const iconoDestino = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const iconoTransbordo = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [35, 57],
  iconAnchor: [17, 57]
});

/* ===========================
   AJUSTAR VISTA
=========================== */

function AjustarVista({ origen, destino }) {
  const map = useMap();

  useEffect(() => {
    if (origen && destino) {
      const bounds = [
        [origen.lat, origen.lon],
        [destino.lat, destino.lon]
      ];

      map.fitBounds(bounds, {
        padding: [60, 60]
      });
    }
  }, [origen, destino, map]);

  return null;
}

/* ===========================
   MAPA
=========================== */

function Mapa({
  origen,
  destino,
  rutaRecomendada
}) {
  const centro = [
    -0.25305,
    -79.17597
  ];

  const transbordosInfo = JSON.parse(
    localStorage.getItem("transbordosInfo") || "[]"
  );

  return (
    <MapContainer
      center={centro}
      zoom={13}
      className="mapa"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AjustarVista
        origen={origen}
        destino={destino}
      />

      {/* ===========================
          RUTA PRINCIPAL
      =========================== */}

      {rutaRecomendada && (
        <GeoJSON
          key={JSON.stringify(rutaRecomendada)}
          data={rutaRecomendada}
          style={(feature) => ({
            color: feature?.properties?.color || "blue",
            weight: 7,
            opacity: 0.95
          })}
        />
      )}

      {/* ===========================
          CAMINATA DE TRANSBORDO
      =========================== */}

      {Array.isArray(transbordosInfo) &&
        transbordosInfo.map(
          (transbordo, index) => (
            <Polyline
              key={`caminar-${index}`}
              positions={[
                [
                  transbordo.lat_salida,
                  transbordo.lon_salida
                ],
                [
                  transbordo.lat_llegada,
                  transbordo.lon_llegada
                ]
              ]}
              pathOptions={{
                color: "#ff0000",
                weight: 6,
                opacity: 1,
                dashArray: "12,8"
              }}
            />
          )
        )}

      {/* ===========================
          MARCADORES TRANSBORDO
      =========================== */}

      {Array.isArray(transbordosInfo) &&
        transbordosInfo.map(
          (transbordo, index) => (
            <Marker
              key={`transbordo-${index}`}
              icon={iconoTransbordo}
              position={[
                transbordo.lat,
                transbordo.lon
              ]}
            >
              <Popup>
                <b>🔄 Punto de Transbordo</b>

                <br />
                <br />

                <b>Bájate de:</b>

                <br />

                {transbordo.linea_origen}

                <br />
                <br />

                <b>Sube a:</b>

                <br />

                {transbordo.linea_destino}

                <br />
                <br />

                <b>Parada salida:</b>

                <br />

                {transbordo.parada_salida}

                <br />
                <br />

                <b>Parada llegada:</b>

                <br />

                {transbordo.parada_llegada}

                <br />
                <br />

                <b>Caminar:</b>

                <br />

                {transbordo.distancia} metros
              </Popup>
            </Marker>
          )
        )}

      {/* ===========================
          ORIGEN
      =========================== */}

      {origen && (
        <Marker
          icon={iconoOrigen}
          position={[
            origen.lat,
            origen.lon
          ]}
        >
          <Popup>
            <b>📍 Origen</b>

            <br />

            {origen.nombre}
          </Popup>
        </Marker>
      )}

      {/* ===========================
          DESTINO
      =========================== */}

      {destino && (
        <Marker
          icon={iconoDestino}
          position={[
            destino.lat,
            destino.lon
          ]}
        >
          <Popup>
            <b>🎯 Destino</b>

            <br />

            {destino.nombre}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Mapa;