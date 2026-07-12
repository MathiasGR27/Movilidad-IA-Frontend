import {
  useEffect,
  useRef,
  useState
} from "react";

import api from "../services/api";

import {
  FaBus,
  FaWalking,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaFlagCheckered,
  FaChevronRight,
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaLocationArrow
} from "react-icons/fa";


/* ==========================================
   RESPUESTA VISUAL DE LA RUTA
========================================== */

function RespuestaRuta({ datos }) {
  const segmentos = Array.isArray(
    datos?.segmentos
  )
    ? datos.segmentos
    : [];

  const transbordos =
    datos?.transbordos || 0;

  const coloresGeoJSON =
    datos?.tramo_geojson
      ?.features
      ?.map(
        (feature) =>
          feature
            ?.properties
            ?.color
      ) || [];

  const obtenerColor = (
    segmento,
    index
  ) => {
    return (
      segmento?.color ||
      coloresGeoJSON[index] ||
      "#2474b5"
    );
  };

  return (
    <div className="route-response-card">

      {/* ENCABEZADO */}

      <div className="route-response-header">
        <div className="route-main-icon">
          <FaBus />
        </div>

        <div className="route-header-info">
          <strong>
            {datos?.origen_texto ||
              "Origen"}

            {" → "}

            {datos?.destino_texto ||
              "Destino"}
          </strong>

          <span>
            {segmentos.length}{" "}

            {segmentos.length === 1
              ? "línea"
              : "líneas"}

            {" · "}

            {transbordos}{" "}

            {transbordos === 1
              ? "transbordo"
              : "transbordos"}
          </span>
        </div>
      </div>

      {/* RESUMEN DE PASOS */}

      <div className="route-steps-summary">
        <div className="route-mini-step">
          <FaWalking />

          <span>
            Caminar
          </span>
        </div>

        <FaChevronRight
          className="route-arrow"
        />

        {segmentos.map(
          (segmento, index) => {
            const color =
              obtenerColor(
                segmento,
                index
              );

            return (
              <div
                className="route-segment-group"
                key={
                  `resumen-${segmento.linea}-${index}`
                }
              >
                <div className="route-mini-step">
                  <FaBus />

                  <span
                    className="route-line-badge"
                    style={{
                      backgroundColor:
                        color
                    }}
                  >
                    {segmento.linea ||
                      "Línea"}
                  </span>
                </div>

                {index <
                  segmentos.length - 1 && (
                  <>
                    <FaChevronRight
                      className="route-arrow"
                    />

                    <div className="route-mini-step transfer">
                      <FaExchangeAlt />
                    </div>

                    <FaChevronRight
                      className="route-arrow"
                    />
                  </>
                )}
              </div>
            );
          }
        )}

        <FaChevronRight
          className="route-arrow"
        />

        <div className="route-mini-step">
          <FaWalking />

          <span>
            Llegar
          </span>
        </div>
      </div>

      {/* PUNTO DE SALIDA */}

      <div className="route-location route-origin">
        <FaMapMarkerAlt />

        <div>
          <span>
            Punto de salida
          </span>

          <strong>
            {segmentos[0]?.inicio ||
              datos?.origen_texto ||
              "Origen no disponible"}
          </strong>
        </div>
      </div>

      {/* DETALLE DE SEGMENTOS */}

      <div className="route-segment-details">
        {segmentos.map(
          (segmento, index) => {
            const color =
              obtenerColor(
                segmento,
                index
              );

            return (
              <div
                className="route-segment-wrapper"
                key={
                  `detalle-${segmento.linea}-${index}`
                }
              >
                <div className="route-detail-row">
                  <div
                    className="route-color-line"
                    style={{
                      backgroundColor:
                        color
                    }}
                  />

                  <div
                    className="route-detail-icon-box"
                    style={{
                      backgroundColor:
                        `${color}20`,

                      color
                    }}
                  >
                    <FaBus />
                  </div>

                  <div className="route-detail-text">
                    <strong>
                      {segmento.linea ||
                        "Línea no disponible"}
                    </strong>

                    <span>
                      <b>Desde:</b>{" "}

                      {segmento.inicio ||
                        "Parada no disponible"}
                    </span>

                    <span>
                      <b>Hasta:</b>{" "}

                      {segmento.fin ||
                        "Parada no disponible"}
                    </span>
                  </div>
                </div>

                {index <
                  segmentos.length - 1 && (
                  <div className="route-transfer-row">
                    <div className="route-transfer-icon">
                      <FaExchangeAlt />
                    </div>

                    <div>
                      <strong>
                        Realiza un transbordo
                      </strong>

                      <span>
                        Cambia a la siguiente
                        línea indicada.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* DESTINO */}

      <div className="route-location route-destination">
        <FaFlagCheckered />

        <div>
          <span>
            Destino
          </span>

          <strong>
            {datos?.destino_texto ||
              "Destino no disponible"}
          </strong>
        </div>
      </div>

      {/* TOTAL DE TRANSBORDOS */}

      <div className="route-summary-footer">
        <FaExchangeAlt />

        <span>
          Total de transbordos:
        </span>

        <strong>
          {transbordos}
        </strong>
      </div>
    </div>
  );
}


/* ==========================================
   COMPONENTE CHATBOT
========================================== */

function ChatBot({
  setOrigen,
  setDestino,
  setRutaRecomendada,
  setSegmentosRuta,
  setCaminataInicio,
  setCaminataFin,
  onConsultaGuardada
}) {
  /* ======================================
     USUARIO
  ====================================== */

  const usuario = (() => {
    try {
      const usuarioGuardado =
        localStorage.getItem(
          "usuario"
        );

      return usuarioGuardado
        ? JSON.parse(
            usuarioGuardado
          )
        : null;
    } catch {
      return null;
    }
  })();

  /* ======================================
     EVITAR CONVERSACIONES DUPLICADAS
  ====================================== */

  const creandoConversacionRef =
    useRef(null);

  /* ======================================
     ESTADOS
  ====================================== */

  const [
    mensaje,
    setMensaje
  ] = useState("");

  const [
    enviando,
    setEnviando
  ] = useState(false);

  const [
    usandoUbicacion,
    setUsandoUbicacion
  ] = useState(false);

  const [
    ubicacionActual,
    setUbicacionActual
  ] = useState(() => {
    try {
      const ubicacionGuardada =
        localStorage.getItem(
          "ubicacionActual"
        );

      return ubicacionGuardada
        ? JSON.parse(
            ubicacionGuardada
          )
        : null;
    } catch (error) {
      console.error(
        "Error leyendo ubicación:",
        error
      );

      return null;
    }
  });

  const [
    ,
    setConversacionId
  ] = useState(() => {
    const idGuardado =
      localStorage.getItem(
        "conversacion_id"
      );

    const idConvertido =
      Number(idGuardado);

    return Number.isFinite(
      idConvertido
    ) &&
    idConvertido > 0
      ? idConvertido
      : null;
  });

  const [
    mensajes,
    setMensajes
  ] = useState(() => {
    try {
      const guardados =
        localStorage.getItem(
          "mensajes_chat"
        );

      const lista =
        guardados
          ? JSON.parse(
              guardados
            )
          : null;

      return Array.isArray(lista)
        ? lista
        : [
            {
              tipo: "bot",
              texto:
                "Hola, ¿a dónde quieres ir?"
            }
          ];
    } catch {
      return [
        {
          tipo: "bot",
          texto:
            "Hola, ¿a dónde quieres ir?"
        }
      ];
    }
  });

  /* ======================================
     GUARDAR MENSAJES LOCALMENTE
  ====================================== */

  useEffect(() => {
    localStorage.setItem(
      "mensajes_chat",
      JSON.stringify(
        mensajes
      )
    );
  }, [mensajes]);

  /* ======================================
     OBTENER O CREAR CONVERSACIÓN

     IMPORTANTE:
     Solo se ejecuta al enviar el primer
     mensaje, no al cargar el Home.
  ====================================== */

  const obtenerOCrearConversacion =
    async () => {
      if (!usuario?.id) {
        throw new Error(
          "No existe un usuario autenticado"
        );
      }

      /*
       * Primero se revisa nuevamente
       * localStorage, porque Home puede
       * haber cambiado la conversación.
       */
      const idGuardado =
        Number(
          localStorage.getItem(
            "conversacion_id"
          )
        );

      if (
        Number.isFinite(idGuardado) &&
        idGuardado > 0
      ) {
        setConversacionId(
          idGuardado
        );

        return idGuardado;
      }

      /*
       * Si ya hay una petición de creación
       * ejecutándose, se espera esa misma.
       */
      if (
        creandoConversacionRef.current
      ) {
        return await
          creandoConversacionRef.current;
      }

      creandoConversacionRef.current =
        (async () => {
          const response =
            await api.post(
              "/conversaciones",
              {
                usuario_id:
                  usuario.id
              }
            );

          const nuevoId = Number(
            response.data.id
          );

          if (
            !Number.isFinite(
              nuevoId
            ) ||
            nuevoId <= 0
          ) {
            throw new Error(
              "El servidor no devolvió un ID de conversación válido"
            );
          }

          localStorage.setItem(
            "conversacion_id",
            String(
              nuevoId
            )
          );

          setConversacionId(
            nuevoId
          );

          return nuevoId;
        })();

      try {
        return await
          creandoConversacionRef.current;
      } finally {
        creandoConversacionRef.current =
          null;
      }
    };

  /*
   * NO DEBES TENER EL useEffect QUE
   * CREABA LA CONVERSACIÓN AL CARGAR.
   *
   * Fue eliminado intencionalmente.
   */

  /* ======================================
     OBTENER UBICACIÓN ACTUAL
  ====================================== */

  const obtenerUbicacionActual =
    () => {
      if (
        !navigator.geolocation
      ) {
        setMensajes(
          (anteriores) => [
            ...anteriores,
            {
              tipo: "bot",
              texto:
                "Tu navegador no permite obtener la ubicación."
            }
          ]
        );

        return;
      }

      setUsandoUbicacion(
        true
      );

      navigator.geolocation
        .getCurrentPosition(
          (posicion) => {
            const nuevaUbicacion = {
              lat:
                posicion.coords
                  .latitude,

              lon:
                posicion.coords
                  .longitude,

              precision:
                posicion.coords
                  .accuracy,

              nombre:
                "Mi ubicación actual"
            };

            console.log(
              "Ubicación obtenida:",
              nuevaUbicacion
            );

            setUbicacionActual(
              nuevaUbicacion
            );

            setOrigen(
              nuevaUbicacion
            );

            localStorage.setItem(
              "ubicacionActual",
              JSON.stringify(
                nuevaUbicacion
              )
            );

            localStorage.setItem(
              "origen",
              JSON.stringify(
                nuevaUbicacion
              )
            );

            setMensajes(
              (anteriores) => [
                ...anteriores,
                {
                  tipo: "bot",
                  texto:
                    "Ubicación obtenida correctamente. Ahora escribe solamente el destino."
                }
              ]
            );

            setUsandoUbicacion(
              false
            );
          },

          (error) => {
            let textoError =
              "No se pudo obtener tu ubicación.";

            if (error.code === 1) {
              textoError =
                "Debes permitir el acceso a tu ubicación.";
            }

            if (error.code === 2) {
              textoError =
                "La ubicación del dispositivo no está disponible.";
            }

            if (error.code === 3) {
              textoError =
                "La solicitud de ubicación tardó demasiado.";
            }

            setMensajes(
              (anteriores) => [
                ...anteriores,
                {
                  tipo: "bot",
                  texto:
                    textoError
                }
              ]
            );

            setUsandoUbicacion(
              false
            );
          },

          {
            enableHighAccuracy:
              true,

            timeout:
              15000,

            maximumAge:
              0
          }
        );
    };

  /* ======================================
     DESACTIVAR UBICACIÓN
  ====================================== */

  const desactivarUbicacion =
    () => {
      setUbicacionActual(
        null
      );

      localStorage.removeItem(
        "ubicacionActual"
      );

      setMensajes(
        (anteriores) => [
          ...anteriores,
          {
            tipo: "bot",
            texto:
              "La ubicación actual fue desactivada. Escribe nuevamente el origen y el destino."
          }
        ]
      );
    };

  /* ======================================
     ENVIAR MENSAJE
  ====================================== */

  const enviarMensaje =
    async () => {
      const texto =
        mensaje.trim();

      if (
        !texto ||
        enviando
      ) {
        return;
      }

      if (!usuario?.id) {
        setMensajes(
          (anteriores) => [
            ...anteriores,
            {
              tipo: "bot",
              texto:
                "No existe un usuario autenticado."
            }
          ]
        );

        return;
      }

      setEnviando(true);
      setMensaje("");

      setMensajes(
        (anteriores) => [
          ...anteriores,
          {
            tipo: "user",
            texto
          }
        ]
      );

      try {
        /*
         * Aquí recién se crea la conversación
         * cuando el usuario envía el mensaje.
         */
        const idConversacion =
          await obtenerOCrearConversacion();

        const response =
          await api.post(
            "/chat",
            {
              mensaje:
                texto,

              conversacion_id:
                idConversacion,

              usuario_id:
                usuario.id,

              ubicacion_actual:
                ubicacionActual
            }
          );

        const segmentos =
          Array.isArray(
            response.data.segmentos
          )
            ? response.data.segmentos
            : [];

        const caminataInicial =
          response.data
            .caminata_inicio ||
          null;

        const caminataFinal =
          response.data
            .caminata_fin ||
          null;

        const transbordosInfo =
          Array.isArray(
            response.data
              .transbordos_info
          )
            ? response.data
                .transbordos_info
            : [];

        /* ==============================
           ACTUALIZAR MAPA
        ============================== */

        setOrigen(
          response.data.origen
        );

        setDestino(
          response.data.destino
        );

        setRutaRecomendada(
          response.data
            .tramo_geojson
        );

        setSegmentosRuta(
          segmentos
        );

        setCaminataInicio(
          caminataInicial
        );

        setCaminataFin(
          caminataFinal
        );

        /* ==============================
           GUARDAR DATOS DEL MAPA
        ============================== */

        localStorage.setItem(
          "origen",
          JSON.stringify(
            response.data.origen
          )
        );

        localStorage.setItem(
          "destino",
          JSON.stringify(
            response.data.destino
          )
        );

        localStorage.setItem(
          "rutaRecomendada",
          JSON.stringify(
            response.data
              .tramo_geojson
          )
        );

        localStorage.setItem(
          "segmentosRuta",
          JSON.stringify(
            segmentos
          )
        );

        localStorage.setItem(
          "caminataInicio",
          JSON.stringify(
            caminataInicial
          )
        );

        localStorage.setItem(
          "caminataFin",
          JSON.stringify(
            caminataFinal
          )
        );

        localStorage.setItem(
          "transbordosInfo",
          JSON.stringify(
            transbordosInfo
          )
        );

        /* ==============================
           MENSAJE VISUAL DEL BOT
        ============================== */

        const mensajeBot = {
          tipo:
            "bot",

          texto:
            response.data.respuesta,

          tipoRespuesta:
            "ruta",

          datosRuta: {
            origen_texto:
              response.data
                .origen_texto,

            destino_texto:
              response.data
                .destino_texto,

            segmentos,

            transbordos:
              response.data
                .transbordos ||
              0,

            tramo_geojson:
              response.data
                .tramo_geojson,

            caminata_inicio:
              caminataInicial,

            caminata_fin:
              caminataFinal,

            transbordos_info:
              transbordosInfo
          }
        };

        setMensajes(
          (anteriores) => [
            ...anteriores,
            mensajeBot
          ]
        );

        /*
         * Actualiza la lista lateral
         * después de guardar la consulta.
         */
        if (
          typeof onConsultaGuardada
          ===
          "function"
        ) {
          await onConsultaGuardada();
        }
      } catch (error) {
        console.error(
          "Error en chatbot:",
          error.response?.data ||
            error
        );

        const textoError =
          error.response
            ?.data
            ?.respuesta
          ||
          error.response
            ?.data
            ?.mensaje
          ||
          "Ocurrió un error al procesar tu consulta.";

        setMensajes(
          (anteriores) => [
            ...anteriores,
            {
              tipo: "bot",
              texto:
                textoError
            }
          ]
        );
      } finally {
        setEnviando(false);
      }
    };

  /* ======================================
     INTERFAZ
  ====================================== */

  return (
    <div className="chat-section">

      {/* ENCABEZADO */}

      <div className="chat-header">
        <h3>
          Asistente de rutas
        </h3>

        {ubicacionActual && (
          <button
            type="button"
            className="location-active-button"
            onClick={
              desactivarUbicacion
            }
            title="Desactivar ubicación actual"
          >
            <FaLocationArrow />

            <span>
              Ubicación activa
            </span>
          </button>
        )}
      </div>

      {/* MENSAJES */}

      <div className="chat-messages">
        {mensajes.map(
          (item, index) => (
            <div
              key={
                `${item.tipo}-${index}`
              }
              className={
                `message-row ${item.tipo}`
              }
            >
              {item.tipo ===
                "bot" && (
                <div className="avatar">
                  <FaRobot />
                </div>
              )}

              {item.tipoRespuesta ===
                "ruta" &&
              item.datosRuta ? (
                <RespuestaRuta
                  datos={
                    item.datosRuta
                  }
                />
              ) : (
                <div className="bubble">
                  {item.texto}
                </div>
              )}

              {item.tipo ===
                "user" && (
                <div className="avatar user-avatar">
                  <FaUser />
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* ENTRADA */}

      <div className="input-box">
        <button
          type="button"
          onClick={
            obtenerUbicacionActual
          }
          disabled={
            usandoUbicacion ||
            enviando
          }
          className={
            ubicacionActual
              ? "location-button active"
              : "location-button"
          }
          title={
            ubicacionActual
              ? "Actualizar ubicación"
              : "Usar mi ubicación actual"
          }
        >
          {usandoUbicacion
            ? "..."
            : <FaLocationArrow />}
        </button>

        <input
          value={
            mensaje
          }
          onChange={
            (event) =>
              setMensaje(
                event.target.value
              )
          }
          onKeyDown={
            (event) => {
              if (
                event.key ===
                  "Enter"
                &&
                !event.shiftKey
              ) {
                event.preventDefault();

                enviarMensaje();
              }
            }
          }
          placeholder={
            ubicacionActual
              ? "Ej: quiero ir hasta Ciudad Verde"
              : "Ej: quiero ir desde el Shopping hasta Ciudad Verde"
          }
          disabled={
            enviando
          }
        />

        <button
          type="button"
          onClick={
            enviarMensaje
          }
          disabled={
            enviando ||
            !mensaje.trim()
          }
          title="Enviar mensaje"
        >
          {enviando
            ? "..."
            : <FaPaperPlane />}
        </button>
      </div>
    </div>
  );
}

export default ChatBot;