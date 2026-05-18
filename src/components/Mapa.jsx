import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

function Mapa({ origen, destino, rutaRecomendada }) {
  const centro = [-0.25305, -79.17597];

  return (
    <MapContainer center={centro} zoom={13} className="mapa">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AjustarVista origen={origen} destino={destino} />

      {rutaRecomendada && (
        <GeoJSON
          key={JSON.stringify(rutaRecomendada)}
          data={rutaRecomendada}
          style={{
            color: "blue",
            weight: 7,
            opacity: 0.95
          }}
        />
      )}

      {origen && (
        <Marker position={[origen.lat, origen.lon]}>
          <Popup>
            Origen <br />
            {origen.nombre}
          </Popup>
        </Marker>
      )}

      {destino && (
        <Marker position={[destino.lat, destino.lon]}>
          <Popup>
            Destino <br />
            {destino.nombre}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Mapa;