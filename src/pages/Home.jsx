import {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import ChatBot from "../components/ChatBot";
import Mapa from "../components/Mapa";
import TutorialVoomy from "../components/TutorialVoomy";

import "../App.css";

import {
  FaHome,
  FaMapMarkedAlt,
  FaPlus,
  FaUserCircle,
  FaTrash,
  FaBars,
  FaBus,
  FaRoute,
  FaExchangeAlt,
  FaInfoCircle
} from "react-icons/fa";


function Home() {
  const navigate = useNavigate();

  /* ======================================
     USUARIO GUARDADO
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
    } catch (error) {
      console.error(
        "Error leyendo usuario:",
        error
      );

      return null;
    }
  })();

  /* ======================================
     ESTADOS GENERALES
  ====================================== */

  const [
    sidebarOpen,
    setSidebarOpen
  ] = useState(false);

  const [
    perfilAbierto,
    setPerfilAbierto
  ] = useState(false);

  const [
    chatKey,
    setChatKey
  ] = useState(0);

  const [
    conversaciones,
    setConversaciones
  ] = useState([]);

  /* ======================================
     MODAL DE INFORMACIÓN
  ====================================== */

  const [
    modalInformacion,
    setModalInformacion
  ] = useState(false);

  /* ======================================
     TUTORIAL GUIADO (SPOTLIGHT)
  ====================================== */

  const [
    mostrarTutorial,
    setMostrarTutorial
  ] = useState(() => {
    try {
      return !localStorage.getItem(
        "tutorialVoomy"
      );
    } catch {
      return false;
    }
  });

  /* ======================================
     MODAL PARA ELIMINAR CHAT
  ====================================== */

  const [
    modalEliminar,
    setModalEliminar
  ] = useState({
    abierto: false,
    idChat: null
  });

  /* ======================================
     ESTADO DEL ORIGEN
  ====================================== */

  const [
    origen,
    setOrigen
  ] = useState(() => {
    try {
      const data =
        localStorage.getItem(
          "origen"
        );

      return data
        ? JSON.parse(data)
        : null;
    } catch {
      return null;
    }
  });

  /* ======================================
     ESTADO DEL DESTINO
  ====================================== */

  const [
    destino,
    setDestino
  ] = useState(() => {
    try {
      const data =
        localStorage.getItem(
          "destino"
        );

      return data
        ? JSON.parse(data)
        : null;
    } catch {
      return null;
    }
  });

  /* ======================================
     RUTA RECOMENDADA
  ====================================== */

  const [
    rutaRecomendada,
    setRutaRecomendada
  ] = useState(() => {
    try {
      const data =
        localStorage.getItem(
          "rutaRecomendada"
        );

      return data
        ? JSON.parse(data)
        : null;
    } catch {
      return null;
    }
  });

  /* ======================================
     SEGMENTOS DE LA RUTA
  ====================================== */

  const [
    segmentosRuta,
    setSegmentosRuta
  ] = useState(() => {
    try {
      const data =
        localStorage.getItem(
          "segmentosRuta"
        );

      return data
        ? JSON.parse(data)
        : [];
    } catch {
      return [];
    }
  });

  /* ======================================
     CAMINATA INICIAL
  ====================================== */

  const [
    caminataInicio,
    setCaminataInicio
  ] = useState(() => {
    try {
      const data =
        localStorage.getItem(
          "caminataInicio"
        );

      return data
        ? JSON.parse(data)
        : null;
    } catch {
      return null;
    }
  });

  /* ======================================
     CAMINATA FINAL
  ====================================== */

  const [
    caminataFin,
    setCaminataFin
  ] = useState(() => {
    try {
      const data =
        localStorage.getItem(
          "caminataFin"
        );

      return data
        ? JSON.parse(data)
        : null;
    } catch {
      return null;
    }
  });

  /* ======================================
     MOSTRAR INFORMACIÓN LA PRIMERA VEZ
  ====================================== */

  useEffect(() => {
    if (!usuario?.id) {
      return;
    }

    const claveInformacion =
      `voomy_informacion_vista_${usuario.id}`;

    const informacionVista =
      localStorage.getItem(
        claveInformacion
      );

    if (!informacionVista) {
      // defer state update to avoid sync setState in effect causing cascading renders
      const t = setTimeout(() => setModalInformacion(true), 0);
      return () => clearTimeout(t);
    }
  }, [usuario?.id]);

  /* ======================================
     CERRAR MODAL DE INFORMACIÓN
  ====================================== */

  const cerrarModalInformacion =
    () => {
      if (usuario?.id) {
        const claveInformacion =
          `voomy_informacion_vista_${usuario.id}`;

        localStorage.setItem(
          claveInformacion,
          "true"
        );
      }

      setModalInformacion(false);
    };

  /* ======================================
     ABRIR MODAL DE INFORMACIÓN
  ====================================== */

  const abrirModalInformacion =
    () => {
      setModalInformacion(true);
      setSidebarOpen(false);
    };

  /* ======================================
     CERRAR TUTORIAL GUIADO
  ====================================== */

  const cerrarTutorial = () => {
    try {
      localStorage.setItem(
        "tutorialVoomy",
        "true"
      );
    } catch (error) {
      console.error(
        "Error guardando estado del tutorial:",
        error
      );
    }

    setMostrarTutorial(false);
  };

  /* ======================================
     CARGAR CONVERSACIONES
  ====================================== */

  const cargarConversaciones =
    useCallback(async () => {
      if (!usuario?.id) {
        setConversaciones([]);

        return [];
      }

      try {
        const response = await api.get(
          `/conversaciones/${usuario.id}`
        );

        const lista = Array.isArray(
          response.data
        )
          ? response.data
          : [];

        setConversaciones(lista);

        return lista;
      } catch (error) {
        console.error(
          "Error cargando conversaciones:",
          error.response?.data ||
            error
        );

        setConversaciones([]);

        return [];
      }
    }, [usuario?.id]);

  useEffect(() => {
    // avoid calling setState synchronously within an effect
    const t = setTimeout(() => {
      cargarConversaciones();
    }, 0);

    return () => clearTimeout(t);
  }, [cargarConversaciones]);

  /* ======================================
     LIMPIAR INFORMACIÓN DE LA RUTA
  ====================================== */

  const limpiarRuta = () => {
    localStorage.removeItem(
      "mensajes_chat"
    );

    localStorage.removeItem(
      "origen"
    );

    localStorage.removeItem(
      "destino"
    );

    localStorage.removeItem(
      "rutaRecomendada"
    );

    localStorage.removeItem(
      "transbordosInfo"
    );

    localStorage.removeItem(
      "segmentosRuta"
    );

    localStorage.removeItem(
      "caminataInicio"
    );

    localStorage.removeItem(
      "caminataFin"
    );

    setOrigen(null);
    setDestino(null);
    setRutaRecomendada(null);
    setSegmentosRuta([]);
    setCaminataInicio(null);
    setCaminataFin(null);
  };

  /* ======================================
     CERRAR SESIÓN
  ====================================== */

  const cerrarSesion = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "usuario"
    );

    localStorage.removeItem(
      "conversacion_id"
    );

    limpiarRuta();

    navigate("/login");
  };

  /* ======================================
     CREAR NUEVA CONVERSACIÓN
  ====================================== */

  const nuevaConversacion =
    async () => {
      if (!usuario?.id) {
        navigate("/login");

        return;
      }

      try {
        const response =
          await api.post(
            "/conversaciones",
            {
              usuario_id:
                usuario.id
            }
          );

        const nuevaId = Number(
          response.data.id
        );

        localStorage.setItem(
          "conversacion_id",
          String(nuevaId)
        );

        limpiarRuta();

        setChatKey(
          (prev) => prev + 1
        );

        await cargarConversaciones();

        setSidebarOpen(false);
      } catch (error) {
        console.error(
          "Error creando conversación:",
          error.response?.data ||
            error
        );
      }
    };

  /* ======================================
     ABRIR UNA CONVERSACIÓN
  ====================================== */

 const abrirConversacion =
async (
  conversacionId
) => {

  try {

    const response =
      await api.get(
        `/conversacion/${conversacionId}`
      );


    const mensajes =
      response.data;


    localStorage.setItem(
      "mensajes_chat",
      JSON.stringify(
        mensajes
      )
    );


    localStorage.setItem(
      "conversacion_id",
      String(
        conversacionId
      )
    );


    /*
    =================================
    BUSCAR ÚLTIMA RUTA DEL CHAT
    =================================
    */

    const mensajeRuta =
      mensajes.find(
        (mensaje) =>
          mensaje.tipo === "bot" &&
          mensaje.tipoRespuesta === "ruta"
      );


    if (
      mensajeRuta &&
      mensajeRuta.datosRuta
    ) {

      const datos =
        mensajeRuta.datosRuta;


      /*
      ===============================
      RECUPERAR DATOS DEL MAPA
      ===============================
      */


      setOrigen({
        nombre:
          datos.origen_texto
      });


      setDestino({
        nombre:
          datos.destino_texto
      });


      setRutaRecomendada(
        datos.tramo_geojson
      );


      setSegmentosRuta(
        datos.segmentos || []
      );


      setCaminataInicio(
        datos.caminata_inicio
      );


      setCaminataFin(
        datos.caminata_fin
      );


      /*
      ===============================
      GUARDAR TAMBIÉN EN LOCALSTORAGE
      ===============================
      */


      localStorage.setItem(
        "origen",
        JSON.stringify({
          nombre:
            datos.origen_texto
        })
      );


      localStorage.setItem(
        "destino",
        JSON.stringify({
          nombre:
            datos.destino_texto
        })
      );


      localStorage.setItem(
        "rutaRecomendada",
        JSON.stringify(
          datos.tramo_geojson
        )
      );


      localStorage.setItem(
        "segmentosRuta",
        JSON.stringify(
          datos.segmentos || []
        )
      );


      localStorage.setItem(
        "caminataInicio",
        JSON.stringify(
          datos.caminata_inicio
        )
      );


      localStorage.setItem(
        "caminataFin",
        JSON.stringify(
          datos.caminata_fin
        )
      );


      localStorage.setItem(
        "transbordosInfo",
        JSON.stringify(
          datos.transbordos_info || []
        )
      );


    } else {


      // Si no tiene ruta limpiamos mapa

      limpiarRuta();

    }


    setChatKey(
      (prev)=>prev+1
    );


    setSidebarOpen(
      false
    );


  } catch(error){

    console.error(
      "Error cargando conversación:",
      error.response?.data ||
      error
    );

  }

};

  /* ======================================
     SOLICITAR ELIMINACIÓN
  ====================================== */

  const solicitarEliminarChat = (
    idChat
  ) => {
    setModalEliminar({
      abierto: true,
      idChat
    });
  };

  /* ======================================
     CONFIRMAR ELIMINACIÓN
  ====================================== */

  const confirmarEliminarChat =
    async () => {
      const idChat =
        modalEliminar.idChat;

      if (!idChat) {
        return;
      }

      try {
        await api.delete(
          `/conversaciones/${idChat}`
        );

        setConversaciones(
          (prev) =>
            prev.filter(
              (conversacion) =>
                conversacion.id !==
                idChat
            )
        );

        const conversacionActual =
          Number(
            localStorage.getItem(
              "conversacion_id"
            )
          );

        if (
          conversacionActual ===
          idChat
        ) {
          localStorage.removeItem(
            "conversacion_id"
          );

          limpiarRuta();

          setChatKey(
            (prev) => prev + 1
          );
        }

        setModalEliminar({
          abierto: false,
          idChat: null
        });
      } catch (error) {
        console.error(
          "Error eliminando conversación:",
          error.response?.data ||
            error
        );
      }
    };

  return (
    <div className="layout">

      {/* ==================================
          FONDO OSCURO DEL SIDEBAR
      ================================== */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ==================================
          MENÚ LATERAL
      ================================== */}
<aside
  data-tutorial="tutorial-sidebar"
  className={
    `sidebar ${
      sidebarOpen
        ? "show-sidebar"
        : ""
    }`
  }
>
  <div className="sidebar-menu">

    {/* INICIO */}

    <button
      type="button"
      className="sidebar-item active"
      title="Inicio"
      onClick={() =>
        setSidebarOpen(false)
      }
    >
      <FaHome />

      <span>
        Principal
      </span>
    </button>

    {/* MAPA COMPLETO */}

    <Link
      to="/mapa"
      className="sidebar-link"
    >
      <button
        type="button"
        className="sidebar-item"
        title="Ver mapa completo"
      >
        <FaMapMarkedAlt />

        <span>
          Mapa
        </span>
      </button>
    </Link>

    {/* INFORMACIÓN */}

    <button
      type="button"
      className="sidebar-item"
      title="Información de Voomy"
      onClick={
        abrirModalInformacion
      }
    >
      <FaInfoCircle />

      <span>
        Información
      </span>
    </button>

    {/* NUEVA CONVERSACIÓN */}

    <button
      type="button"
      className="sidebar-item"
      onClick={
        nuevaConversacion
      }
      title="Nueva conversación"
    >
      <FaPlus />

      <span>
        Crear chat
      </span>
    </button>

  </div>

        {/* LISTA DE CONVERSACIONES */}

        <div className="conversation-list">
          <h4>
            Chats
          </h4>

          {conversaciones.length ===
          0 ? (
            <p className="conversation-empty">
              No existen conversaciones.
            </p>
          ) : (
            conversaciones.map(
              (conversacion) => (
                <div
                  key={
                    conversacion.id
                  }
                  className="conversation-btn"
                  onClick={() =>
                    abrirConversacion(
                      conversacion.id
                    )
                  }
                >
                  <div className="conversation-text">
                    <span>
                      {conversacion.titulo
                        ?.length > 25
                        ? `${conversacion.titulo.substring(
                            0,
                            25
                          )}...`
                        : conversacion.titulo ||
                          "Nueva conversación"}
                    </span>

                    <small>
                      {conversacion.fecha}
                    </small>
                  </div>

                  <button
                    type="button"
                    className="delete-chat"
                    title="Eliminar conversación"
                    onClick={(
                      event
                    ) => {
                      event.stopPropagation();

                      solicitarEliminarChat(
                        conversacion.id
                      );
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              )
            )
          )}
        </div>
      </aside>

      {/* ==================================
          CONTENIDO PRINCIPAL
      ================================== */}

      <main className="main-content">

        {/* BARRA SUPERIOR */}

        <header className="topbar">

          <button
            type="button"
            className="logo-button"
            onClick={() =>
              setSidebarOpen(
                (prev) => !prev
              )
            }
            title="Menú"
          >
            <FaBars />
          </button>

          <h1>
            Voomy
          </h1>

          {usuario ? (
            <div className="profile-menu">

              <button
                data-tutorial="tutorial-perfil"
                type="button"
                className="profile-btn"
                onClick={() =>
                  setPerfilAbierto(
                    (prev) => !prev
                  )
                }
              >
                <FaUserCircle />
              </button>

              {perfilAbierto && (
                <div className="profile-dropdown">

                  <div className="profile-info">
                    <strong>
                      {usuario.nombre}
                    </strong>

                    <span>
                      {usuario.email}
                    </span>
                  </div>

                  <Link to="/profile">
                    <button
                      type="button"
                      onClick={() =>
                        setPerfilAbierto(
                          false
                        )
                      }
                    >
                      Ver perfil
                    </button>
                  </Link>

                  <button
                    type="button"
                    className="logout"
                    onClick={
                      cerrarSesion
                    }
                  >
                    Cerrar sesión
                  </button>

                </div>
              )}
            </div>
          ) : (
            <div className="top-auth-actions">

              <Link to="/login">
                <button
                  type="button"
                  className="top-auth-btn"
                >
                  Iniciar sesión
                </button>
              </Link>

              <Link to="/register">
                <button
                  type="button"
                  className="top-auth-btn"
                >
                  Registrarse
                </button>
              </Link>

            </div>
          )}
        </header>

        {/* ==================================
            CHATBOT Y MAPA
        ================================== */}

        <section className="content">

          <div
            data-tutorial="tutorial-chat"
            className="chat-tutorial-wrapper"
          >
            <ChatBot
              key={
                chatKey
              }
              setOrigen={
                setOrigen
              }
              setDestino={
                setDestino
              }
              setRutaRecomendada={
                setRutaRecomendada
              }
              setSegmentosRuta={
                setSegmentosRuta
              }
              setCaminataInicio={
                setCaminataInicio
              }
              setCaminataFin={
                setCaminataFin
              }
              onConsultaGuardada={
                cargarConversaciones
              }
            />
          </div>

          <div
            data-tutorial="tutorial-mapa"
            className="map-card"
          >
            <Mapa
              origen={
                origen
              }
              destino={
                destino
              }
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
            />
          </div>

        </section>
      </main>

      {/* ==================================
          MODAL DE INFORMACIÓN
      ================================== */}

      {modalInformacion && (
        <div
          className="modal-overlay"
          onClick={
            cerrarModalInformacion
          }
        >
          <div
            className="information-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className={
                "information-modal-close"
              }
              onClick={
                cerrarModalInformacion
              }
              aria-label={
                "Cerrar información"
              }
            >
              ×
            </button>

            <div className="information-modal-icon">
              <FaBus />
            </div>

            <span className="information-modal-label">
              Movilidad inteligente
            </span>

            <h2>
              Bienvenido a Voomy
            </h2>

            <p className="information-modal-description">
              Voomy es una aplicación
              desarrollada exclusivamente
              para consultar las rutas del
              transporte público urbano de
              Santo Domingo de los Tsáchilas.
            </p>

            <div className="information-modal-options">

              <div className="information-option">
                <FaRoute />

                <div>
                  <strong>
                    Consulta de rutas
                  </strong>

                  <span>
                    Ingresa tu origen y
                    destino para obtener una
                    ruta de transporte
                    recomendada.
                  </span>
                </div>
              </div>

              <div className="information-option">
                <FaExchangeAlt />

                <div>
                  <strong>
                    Transbordos recomendados
                  </strong>

                  <span>
                    El sistema indica las
                    líneas que debes utilizar
                    y los puntos donde debes
                    cambiar de bus.
                  </span>
                </div>
              </div>

              <div className="information-option">
                <FaMapMarkedAlt />

                <div>
                  <strong>
                    Visualización en el mapa
                  </strong>

                  <span>
                    Observa el recorrido,
                    las caminatas, las paradas
                    de subida y los puntos de
                    llegada.
                  </span>
                </div>
              </div>

            </div>

            <div className="information-modal-note">
              <FaInfoCircle />

              <span>
                La información presentada
                corresponde únicamente al
                transporte público urbano de
                Santo Domingo.
              </span>
            </div>

            <button
              type="button"
              className={
                "information-modal-button"
              }
              onClick={
                cerrarModalInformacion
              }
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* ==================================
          MODAL PARA ELIMINAR CHAT
      ================================== */}

      {modalEliminar.abierto && (
        <div className="modal-overlay">
          <div className="modal-content-box">

            <h3>
              ¿Eliminar conversación?
            </h3>

            <p>
              Esta acción no se puede
              deshacer y perderás todo el
              historial de este chat.
            </p>

            <div className="modal-actions">

              <button
                type="button"
                className="btn-cancelar"
                onClick={() =>
                  setModalEliminar({
                    abierto: false,
                    idChat: null
                  })
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-eliminar"
                onClick={
                  confirmarEliminarChat
                }
              >
                Eliminar
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ==================================
          TUTORIAL GUIADO (SPOTLIGHT)
          Se muestra solo una vez, después
          del modal de información.
      ================================== */}

      {mostrarTutorial &&
        !modalInformacion && (
          <TutorialVoomy
            cerrar={cerrarTutorial}
          />
        )}

    </div>
  );
}

export default Home;