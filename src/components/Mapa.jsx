import {
  useEffect
} from "react";

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
   ICONOS
=========================== */

const crearIcono = (
  color,
  tamano = [25, 41]
) => {
  return new L.Icon({
    iconUrl:
      `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,

    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize:
      tamano,

    iconAnchor: [
      Math.round(
        tamano[0] / 2
      ),
      tamano[1]
    ],

    popupAnchor: [
      1,
      -34
    ],

    shadowSize: [
      41,
      41
    ]
  });
};


const iconoOrigen =
  crearIcono("green");

const iconoDestino =
  crearIcono("red");

const iconoParada =
  crearIcono("blue");

const iconoTransbordo =
  crearIcono(
    "yellow",
    [30, 49]
  );


/* ===========================
   OBTENER POSICIÓN
=========================== */

const obtenerPosicion = (
  punto
) => {
  if (!punto) {
    return null;
  }

  if (
    Array.isArray(punto) &&
    punto.length >= 2
  ) {
    const primero = Number(
      punto[0]
    );

    const segundo = Number(
      punto[1]
    );

    if (
      !Number.isFinite(
        primero
      )
      ||
      !Number.isFinite(
        segundo
      )
    ) {
      return null;
    }

    /*
     * GeoJSON:
     * [longitud, latitud]
     */
    if (
      Math.abs(primero) > 20
      &&
      Math.abs(segundo) <= 20
    ) {
      return [
        segundo,
        primero
      ];
    }

    return [
      primero,
      segundo
    ];
  }

  const coordenadas =
    punto.coordenadas
    ||
    punto.ubicacion
    ||
    punto.position
    ||
    punto;

  const latitud = Number(
    coordenadas.lat
    ??
    coordenadas.latitude
    ??
    coordenadas.latitud
  );

  const longitud = Number(
    coordenadas.lon
    ??
    coordenadas.lng
    ??
    coordenadas.longitude
    ??
    coordenadas.longitud
  );

  if (
    !Number.isFinite(
      latitud
    )
    ||
    !Number.isFinite(
      longitud
    )
  ) {
    return null;
  }

  return [
    latitud,
    longitud
  ];
};


/* ===========================
   PUNTOS DE CAMINATA
=========================== */

const obtenerOrigenCaminata = (
  caminataInicio
) => {
  return obtenerPosicion(
    caminataInicio?.origen
    ||
    caminataInicio
      ?.origen_coordenadas
    ||
    caminataInicio
      ?.punto_origen
  );
};


const obtenerPrimeraParada = (
  caminataInicio
) => {
  return obtenerPosicion(
    caminataInicio?.parada
    ||
    caminataInicio
      ?.parada_coordenadas
    ||
    caminataInicio
      ?.primera_parada
    ||
    caminataInicio
      ?.primera_parada_coordenadas
  );
};


const obtenerUltimaParada = (
  caminataFin
) => {
  return obtenerPosicion(
    caminataFin?.parada
    ||
    caminataFin
      ?.parada_coordenadas
    ||
    caminataFin
      ?.ultima_parada
    ||
    caminataFin
      ?.ultima_parada_coordenadas
  );
};


const obtenerDestinoCaminata = (
  caminataFin
) => {
  return obtenerPosicion(
    caminataFin?.destino
    ||
    caminataFin
      ?.destino_coordenadas
    ||
    caminataFin
      ?.punto_destino
  );
};


/* ===========================
   AJUSTAR VISTA
=========================== */

function AjustarVista({
  origen,
  destino,
  caminataInicio,
  caminataFin,
  transbordosInfo
}) {
  const map = useMap();

  useEffect(() => {
    const puntos = [];

    const posiblesPuntos = [
      obtenerPosicion(
        origen
      ),

      obtenerOrigenCaminata(
        caminataInicio
      ),

      obtenerPrimeraParada(
        caminataInicio
      ),

      obtenerUltimaParada(
        caminataFin
      ),

      obtenerDestinoCaminata(
        caminataFin
      ),

      obtenerPosicion(
        destino
      )
    ];

    posiblesPuntos.forEach(
      (punto) => {
        if (punto) {
          puntos.push(
            punto
          );
        }
      }
    );

    if (
      Array.isArray(
        transbordosInfo
      )
    ) {
      transbordosInfo.forEach(
        (transbordo) => {
          const salida =
            obtenerPosicion({
              lat:
                transbordo
                  ?.lat_salida,

              lon:
                transbordo
                  ?.lon_salida
            });

          const llegada =
            obtenerPosicion({
              lat:
                transbordo
                  ?.lat_llegada,

              lon:
                transbordo
                  ?.lon_llegada
            });

          if (salida) {
            puntos.push(
              salida
            );
          }

          if (llegada) {
            puntos.push(
              llegada
            );
          }
        }
      );
    }

    if (
      puntos.length >= 2
    ) {
      map.fitBounds(
        puntos,
        {
          padding:
            [60, 60],

          maxZoom:
            16
        }
      );

    } else if (
      puntos.length === 1
    ) {
      map.setView(
        puntos[0],
        16
      );
    }

    setTimeout(
      () => {
        map.invalidateSize();
      },
      200
    );

  }, [
    origen,
    destino,
    caminataInicio,
    caminataFin,
    transbordosInfo,
    map
  ]);

  return null;
}


/* ===========================
   MAPA
=========================== */

function Mapa({
  origen,
  destino,
  rutaRecomendada,
  caminataInicio,
  caminataFin,
  transbordosInfo: transbordosProp
}) {
  const centro = [
    -0.25305,
    -79.17597
  ];

  let transbordosGuardados = [];

  try {
    const valor =
      localStorage.getItem(
        "transbordosInfo"
      );

    transbordosGuardados =
      valor
        ? JSON.parse(valor)
        : [];

  } catch (error) {
    console.error(
      "Error leyendo transbordos:",
      error
    );
  }

  const transbordosInfo =
    Array.isArray(
      transbordosProp
    )
      ? transbordosProp
      : Array.isArray(
          transbordosGuardados
        )
        ? transbordosGuardados
        : [];

  const origenPosicion =
    obtenerPosicion(
      origen
    );

  const destinoPosicion =
    obtenerPosicion(
      destino
    );

  const origenCaminata =
    obtenerOrigenCaminata(
      caminataInicio
    );

  const primeraParada =
    obtenerPrimeraParada(
      caminataInicio
    );

  const ultimaParada =
    obtenerUltimaParada(
      caminataFin
    );

  const destinoCaminata =
    obtenerDestinoCaminata(
      caminataFin
    );

  return (
    <MapContainer
      center={centro}
      zoom={13}
      className="mapa"
      scrollWheelZoom={
        true
      }
    >
      <TileLayer
        attribution={
          "&copy; OpenStreetMap contributors"
        }
        url={
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />

      <AjustarVista
        origen={
          origen
        }
        destino={
          destino
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

      {/* CAMINATA INICIAL */}

      {origenCaminata &&
        primeraParada && (
          <Polyline
            positions={[
              origenCaminata,
              primeraParada
            ]}
            pathOptions={{
              color:
                "#198754",

              weight:
                7,

              opacity:
                1,

              dashArray:
                "1 13",

              lineCap:
                "round"
            }}
          />
        )}

      {/* RUTA PRINCIPAL */}

      {rutaRecomendada &&
        Array.isArray(
          rutaRecomendada
            ?.features
        ) &&
        rutaRecomendada
          .features
          .length > 0 && (
          <GeoJSON
            key={
              JSON.stringify(
                rutaRecomendada
              )
            }
            data={
              rutaRecomendada
            }
            style={
              (feature) => ({
                color:
                  feature
                    ?.properties
                    ?.color
                  ||
                  "#2474b5",

                weight:
                  7,

                opacity:
                  0.95,

                lineCap:
                  "round",

                lineJoin:
                  "round"
              })
            }
          />
        )}

      {/* CAMINATAS DE TRANSBORDO */}

      {transbordosInfo.map(
        (
          transbordo,
          index
        ) => {
          const salida =
            obtenerPosicion({
              lat:
                transbordo
                  ?.lat_salida,

              lon:
                transbordo
                  ?.lon_salida
            });

          const llegada =
            obtenerPosicion({
              lat:
                transbordo
                  ?.lat_llegada,

              lon:
                transbordo
                  ?.lon_llegada
            });

          if (
            !salida ||
            !llegada
          ) {
            return null;
          }

          return (
            <Polyline
              key={
                `transbordo-linea-${index}`
              }
              positions={[
                salida,
                llegada
              ]}
              pathOptions={{
                color:
                  "#f59e0b",

                weight:
                  6,

                opacity:
                  1,

                dashArray:
                  "1 11",

                lineCap:
                  "round"
              }}
            />
          );
        }
      )}

      {/* CAMINATA FINAL */}

      {ultimaParada &&
        destinoCaminata && (
          <Polyline
            positions={[
              ultimaParada,
              destinoCaminata
            ]}
            pathOptions={{
              color:
                "#198754",

              weight:
                7,

              opacity:
                1,

              dashArray:
                "1 13",

              lineCap:
                "round"
            }}
          />
        )}

      {/* MARCADOR ORIGEN */}

      {origenPosicion && (
        <Marker
          icon={
            iconoOrigen
          }
          position={
            origenPosicion
          }
        >
          <Popup>
            <b>Origen</b>

            <br />

            {origen?.nombre
              ||
              origen
                ?.display_name
              ||
              "Punto de origen"}
          </Popup>
        </Marker>
      )}

      {/* PRIMERA PARADA */}

      {primeraParada && (
        <Marker
          icon={
            iconoParada
          }
          position={
            primeraParada
          }
        >
          <Popup>
            <b>
              Primera parada
            </b>

            <br />

            {caminataInicio
              ?.parada
              ?.nombre
              ||
              caminataInicio
                ?.nombre_parada
              ||
              caminataInicio
                ?.parada_nombre
              ||
              "Parada donde debes subir"}
          </Popup>
        </Marker>
      )}

      {/* ÚLTIMA PARADA */}

      {ultimaParada && (
        <Marker
          icon={
            iconoParada
          }
          position={
            ultimaParada
          }
        >
          <Popup>
            <b>
              Última parada
            </b>

            <br />

            {caminataFin
              ?.parada
              ?.nombre
              ||
              caminataFin
                ?.nombre_parada
              ||
              caminataFin
                ?.parada_nombre
              ||
              "Parada donde debes bajar"}
          </Popup>
        </Marker>
      )}

      {/* MARCADORES DE TRANSBORDO */}

      {transbordosInfo.map(
        (
          transbordo,
          index
        ) => {
          const posicion =
            obtenerPosicion({
              lat:
                transbordo
                  ?.lat
                ??
                transbordo
                  ?.lat_salida,

              lon:
                transbordo
                  ?.lon
                ??
                transbordo
                  ?.lon_salida
            });

          if (!posicion) {
            return null;
          }

          return (
            <Marker
              key={
                `transbordo-marcador-${index}`
              }
              icon={
                iconoTransbordo
              }
              position={
                posicion
              }
            >
              <Popup>
                <b>
                  Punto de transbordo
                </b>

                <br />
                <br />

                <b>
                  Bájate de:
                </b>

                <br />

                {transbordo
                  ?.linea_origen
                  ||
                  "Línea anterior"}

                <br />
                <br />

                <b>
                  Sube a:
                </b>

                <br />

                {transbordo
                  ?.linea_destino
                  ||
                  "Línea siguiente"}

                <br />
                <br />

                <b>
                  Distancia caminando:
                </b>

                <br />

                {transbordo
                  ?.distancia
                  ??
                  transbordo
                    ?.distancia_m
                  ??
                  0}{" "}
                metros
              </Popup>
            </Marker>
          );
        }
      )}

      {/* DESTINO */}

      {destinoPosicion && (
        <Marker
          icon={
            iconoDestino
          }
          position={
            destinoPosicion
          }
        >
          <Popup>
            <b>Destino</b>

            <br />

            {destino?.nombre
              ||
              destino
                ?.display_name
              ||
              "Punto de destino"}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Mapa;