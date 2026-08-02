import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* =================================
   ICONOS
================================= */

const crearIcono = (color, tamano = [25, 41]) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: tamano,
    iconAnchor: [Math.round(tamano[0] / 2), tamano[1]],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const iconoOrigen = crearIcono("green");
const iconoDestino = crearIcono("red");
const iconoParada = crearIcono("blue");
const iconoTransbordo = crearIcono("yellow", [30, 49]);

/* =================================
   POSICIONES
================================= */

const obtenerPosicion = (punto) => {
  if (!punto) return null;

  if (Array.isArray(punto)) {
    const primero = Number(punto[0]);
    const segundo = Number(punto[1]);

    if (!Number.isFinite(primero) || !Number.isFinite(segundo)) {
      return null;
    }

    // GeoJSON [lon, lat]
    if (Math.abs(primero) > 20 && Math.abs(segundo) <= 20) {
      return [segundo, primero];
    }

    return [primero, segundo];
  }

  const datos =
    punto.coordenadas || punto.ubicacion || punto.position || punto;

  const lat = Number(datos.lat ?? datos.latitude ?? datos.latitud);
  const lon = Number(datos.lon ?? datos.lng ?? datos.longitude ?? datos.longitud);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return [lat, lon];
};

/* =================================
   CAMINATAS
================================= */

const obtenerCoordenadasCaminata = (caminata) => {
  const coordenadas = caminata?.geojson?.coordinates;

  if (!Array.isArray(coordenadas) || coordenadas.length === 0) {
    return [];
  }

  return coordenadas;
};

const convertirGeoJSONAPosicion = (coordenada) => {
  if (!Array.isArray(coordenada) || coordenada.length < 2) {
    return null;
  }

  const lon = Number(coordenada[0]);
  const lat = Number(coordenada[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return [lat, lon];
};

const obtenerOrigenCaminata = (caminataInicio) => {
  const posicionGuardada = obtenerPosicion(
    caminataInicio?.origen ||
      caminataInicio?.origen_coordenadas ||
      caminataInicio?.punto_origen
  );

  if (posicionGuardada) {
    return posicionGuardada;
  }

  const coordenadas = obtenerCoordenadasCaminata(caminataInicio);

  return convertirGeoJSONAPosicion(coordenadas[0]);
};

const obtenerPrimeraParada = (caminataInicio) => {
  const posicionGuardada = obtenerPosicion(
    caminataInicio?.parada ||
      caminataInicio?.parada_coordenadas ||
      caminataInicio?.primera_parada ||
      caminataInicio?.primera_parada_coordenadas
  );

  if (posicionGuardada) {
    return posicionGuardada;
  }

  const coordenadas = obtenerCoordenadasCaminata(caminataInicio);

  return convertirGeoJSONAPosicion(
    coordenadas[coordenadas.length - 1]
  );
};

const obtenerUltimaParada = (caminataFin) => {
  const posicionGuardada = obtenerPosicion(
    caminataFin?.parada ||
      caminataFin?.parada_coordenadas ||
      caminataFin?.ultima_parada ||
      caminataFin?.ultima_parada_coordenadas
  );

  if (posicionGuardada) {
    return posicionGuardada;
  }

  const coordenadas = obtenerCoordenadasCaminata(caminataFin);

  return convertirGeoJSONAPosicion(coordenadas[0]);
};

const obtenerDestinoCaminata = (caminataFin) => {
  const posicionGuardada = obtenerPosicion(
    caminataFin?.destino ||
      caminataFin?.destino_coordenadas ||
      caminataFin?.punto_destino
  );

  if (posicionGuardada) {
    return posicionGuardada;
  }

  const coordenadas = obtenerCoordenadasCaminata(caminataFin);

  return convertirGeoJSONAPosicion(
    coordenadas[coordenadas.length - 1]
  );
};

/* =================================
   LEER GEOJSON DE CAMINATA REAL
================================= */

const obtenerRutaCaminata = (caminata) => {
  if (
    !caminata ||
    !caminata.geojson ||
    !Array.isArray(caminata.geojson.coordinates)
  ) {
    return [];
  }

  return caminata.geojson.coordinates.map((punto) => [punto[1], punto[0]]);
};

/* =================================
   AJUSTAR VISTA DEL MAPA
================================= */

function AjustarVista({
  origen,
  destino,
  caminataInicio,
  caminataFin,
  transbordosInfo,
}) {
  const map = useMap();

  useEffect(() => {
    const puntos = [];

    const posiciones = [
      obtenerPosicion(origen),
      obtenerOrigenCaminata(caminataInicio),
      obtenerPrimeraParada(caminataInicio),
      obtenerUltimaParada(caminataFin),
      obtenerDestinoCaminata(caminataFin),
      obtenerPosicion(destino),
    ];

    posiciones.forEach((punto) => {
      if (punto) puntos.push(punto);
    });

    if (puntos.length >= 2) {
      map.fitBounds(puntos, {
        padding: [60, 60],
        maxZoom: 16,
      });
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [origen, destino, caminataInicio, caminataFin, transbordosInfo, map]);

  return null;
}

/* =================================
   COMPONENTE MAPA
================================= */

function Mapa({
  origen,
  destino,
  rutaRecomendada,
  caminataInicio,
  caminataFin,
  transbordosInfo: transbordosProp,
}) {
  const centro = [-0.25305, -79.17597];

  let transbordosGuardados = [];

  try {
    const valor = localStorage.getItem("transbordosInfo");
    transbordosGuardados = valor ? JSON.parse(valor) : [];
  } catch (error) {
    console.error("Error leyendo transbordos", error);
  }

  const transbordosInfo = Array.isArray(transbordosProp)
    ? transbordosProp
    : transbordosGuardados;

  const origenPosicion = obtenerPosicion(origen);
  const destinoPosicion = obtenerPosicion(destino);
  const primeraParada = obtenerPrimeraParada(caminataInicio);
  const ultimaParada = obtenerUltimaParada(caminataFin);

  const rutaCaminataInicio = obtenerRutaCaminata(caminataInicio);
  const rutaCaminataFin = obtenerRutaCaminata(caminataFin);

  return (
    <MapContainer
      center={centro}
      zoom={13}
      className="mapa"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AjustarVista
        origen={origen}
        destino={destino}
        caminataInicio={caminataInicio}
        caminataFin={caminataFin}
        transbordosInfo={transbordosInfo}
      />

      {/* CAMINATA INICIAL REAL */}
      {rutaCaminataInicio.length > 1 && (
        <Polyline
          positions={rutaCaminataInicio}
          pathOptions={{
            color: "#198754",
            weight: 6,
            opacity: 1,
            dashArray: "10 10",
            lineCap: "round",
          }}
        />
      )}

      {/* RUTA DE BUSES */}
      {rutaRecomendada &&
        rutaRecomendada.features &&
        rutaRecomendada.features.length > 0 && (
          <GeoJSON
            key={JSON.stringify(rutaRecomendada)}
            data={rutaRecomendada}
            style={(feature) => ({
              color: feature?.properties?.color || "#2474b5",
              weight: 7,
              opacity: 0.95,
              lineCap: "round",
              lineJoin: "round",
            })}
          />
        )}

      {/* CAMINATA FINAL REAL */}
      {rutaCaminataFin.length > 1 && (
        <Polyline
          positions={rutaCaminataFin}
          pathOptions={{
            color: "#198754",
            weight: 6,
            opacity: 1,
            dashArray: "10 10",
            lineCap: "round",
          }}
        />
      )}

      {/* MARCADOR ORIGEN */}
      {origenPosicion && (
        <Marker position={origenPosicion} icon={iconoOrigen}>
          <Popup>
            <b>Origen</b>
            <br />
            {origen?.nombre || "Punto inicial"}
          </Popup>
        </Marker>
      )}

      {/* PARADA SUBIDA */}
      {primeraParada && (
        <Marker position={primeraParada} icon={iconoParada}>
          <Popup>
            <b>Parada donde subir</b>
            <br />
            {caminataInicio?.parada?.nombre || "Primera parada"}
          </Popup>
        </Marker>
      )}

      {/* PARADA BAJADA */}
      {ultimaParada && (
        <Marker position={ultimaParada} icon={iconoParada}>
          <Popup>
            <b>Parada donde bajar</b>
            <br />
            {caminataFin?.parada?.nombre || "Última parada"}
          </Popup>
        </Marker>
      )}

      {/* TRANSBORDOS */}
      {transbordosInfo.map((transbordo, index) => {
        const posicion = obtenerPosicion({
          lat: transbordo.lat,
          lon: transbordo.lon,
        });

        if (!posicion) return null;

        return (
          <Marker key={index} position={posicion} icon={iconoTransbordo}>
            <Popup>
              <b>Transbordo</b>
              <br />
              {transbordo.linea_origen}
              <br />
              ↓
              <br />
              {transbordo.linea_destino}
            </Popup>
          </Marker>
        );
      })}

      {/* DESTINO */}
      {destinoPosicion && (
        <Marker position={destinoPosicion} icon={iconoDestino}>
          <Popup>
            <b>Destino</b>
            <br />
            {destino?.nombre || "Punto final"}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Mapa;