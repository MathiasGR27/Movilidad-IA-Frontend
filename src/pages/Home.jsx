import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import ChatBot from "../components/ChatBot";
import Mapa from "../components/Mapa";

import {
  FaHome,
  FaMapMarkedAlt,
  FaPlus,
  FaUserCircle,
  FaTrash,
  FaBars,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [conversaciones, setConversaciones] = useState([]);
  const [modalEliminar, setModalEliminar] = useState({ abierto: false, idChat: null });

  const [origen, setOrigen] = useState(() => {
    const data = localStorage.getItem("origen");
    return data ? JSON.parse(data) : null;
  });

  const [destino, setDestino] = useState(() => {
    const data = localStorage.getItem("destino");
    return data ? JSON.parse(data) : null;
  });

  const [rutaRecomendada, setRutaRecomendada] = useState(() => {
    const data = localStorage.getItem("rutaRecomendada");
    return data ? JSON.parse(data) : null;
  });

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cargarConversaciones = async () => {
    try {
      if (!usuario) return [];
      const response = await api.get(`/conversaciones/${usuario.id}`);
      return response.data;
    } catch (error) {
      console.error("Error cargando conversaciones", error);
      return [];
    }
  };

  useEffect(() => {
    let cancelado = false;
    cargarConversaciones().then((data) => {
      if (!cancelado) setConversaciones(data);
    });
    return () => { cancelado = true; };
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("mensajes_chat");
    localStorage.removeItem("origen");
    localStorage.removeItem("destino");
    localStorage.removeItem("rutaRecomendada");
    localStorage.removeItem("conversacion_id");
    localStorage.removeItem("transbordosInfo");
    navigate("/login");
  };

  const nuevaConversacion = async () => {
    try {
      const response = await api.post("/conversaciones");
      localStorage.setItem("conversacion_id", response.data.id);
      localStorage.removeItem("origen");
      localStorage.removeItem("destino");
      localStorage.removeItem("rutaRecomendada");
      localStorage.removeItem("mensajes_chat");
      localStorage.removeItem("transbordosInfo");
      setOrigen(null);
      setDestino(null);
      setRutaRecomendada(null);
      setChatKey((prev) => prev + 1);
      const actualizadas = await cargarConversaciones();
      setConversaciones(actualizadas);
    } catch (error) {
      console.error("Error creando conversación", error);
    }
  };

  const abrirConversacion = async (conversacionId) => {
    try {
      const response = await api.get(`/conversacion/${conversacionId}`);
      localStorage.setItem("mensajes_chat", JSON.stringify(response.data));
      localStorage.setItem("conversacion_id", conversacionId);
      localStorage.removeItem("origen");
      localStorage.removeItem("destino");
      localStorage.removeItem("rutaRecomendada");
      localStorage.removeItem("transbordosInfo");
      setOrigen(null);
      setDestino(null);
      setRutaRecomendada(null);
      setChatKey((prev) => prev + 1);
      setSidebarOpen(false); // Cierra sidebar en móvil al abrir un chat
    } catch (error) {
      console.error("Error cargando conversación", error);
    }
  };

  const solicitarEliminarChat = (id) => {
    setModalEliminar({ abierto: true, idChat: id });
  };

  const confirmarEliminarChat = async () => {
    const id = modalEliminar.idChat;
    try {
      await api.delete(`/conversaciones/${id}`);
      setConversaciones(conversaciones.filter((c) => c.id !== id));
      setModalEliminar({ abierto: false, idChat: null });
    } catch (error) {
      console.error("Error eliminando conversación", error);
    }
  };

  return (
    <div className="layout">

      {/* Overlay oscuro para móvil (cierra sidebar al hacer clic fuera) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "show-sidebar" : ""}`}>

        {/* Íconos de navegación */}
        <div className="nav-icons">
          <button className="nav-btn active" title="Inicio">
            <FaHome />
          </button>

          <Link to="/mapa">
            <button className="nav-btn" title="Ver mapa completo">
              <FaMapMarkedAlt />
            </button>
          </Link>

          <button
            className="nav-btn"
            onClick={nuevaConversacion}
            title="Nueva conversación"
          >
            <FaPlus />
          </button>
        </div>

        {/* Lista de conversaciones */}
        <div className="conversation-list">
          <h4>Chats</h4>

          {conversaciones.map((c) => (
            <div
              key={c.id}
              className="conversation-btn"
              onClick={() => abrirConversacion(c.id)}
            >
              <div className="conversation-text">
                <span>
                  {c.titulo?.length > 25
                    ? c.titulo.substring(0, 25) + "..."
                    : c.titulo || "Nueva conversación"}
                </span>
                <small>{c.fecha}</small>
              </div>

              <button
                className="delete-chat"
                title="Eliminar conversación"
                onClick={(e) => {
                  e.stopPropagation();
                  solicitarEliminarChat(c.id);
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

      </aside>

      <main className="main-content">
        <header className="topbar">
          {/* Botón hamburguesa */}
          <button
            className="logo-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Menú"
          >
            <FaBars />
          </button>

          <h1>Voomy</h1>

          {usuario ? (
            <div className="profile-menu">
              <button
                className="profile-btn"
                onClick={() => setPerfilAbierto(!perfilAbierto)}
              >
                <FaUserCircle />
              </button>

              {perfilAbierto && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <strong>{usuario.nombre}</strong>
                    <span>{usuario.email}</span>
                  </div>

                  <Link to="/profile">
                    <button onClick={() => setPerfilAbierto(false)}>
                      Ver perfil
                    </button>
                  </Link>

                  <button className="logout" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="top-auth-actions">
              <Link to="/login">
                <button className="top-auth-btn">Iniciar sesión</button>
              </Link>
              <Link to="/register">
                <button className="top-auth-btn">Registrarse</button>
              </Link>
            </div>
          )}
        </header>

        <section className="content">
          <ChatBot
            key={chatKey}
            setOrigen={setOrigen}
            setDestino={setDestino}
            setRutaRecomendada={setRutaRecomendada}
          />

          <div className="map-card">
            <Mapa
              origen={origen}
              destino={destino}
              rutaRecomendada={rutaRecomendada}
            />
          </div>
        </section>
      </main>

      {/* Modal de confirmación de eliminación */}
      {modalEliminar.abierto && (
        <div className="modal-overlay">
          <div className="modal-content-box">
            <h3>¿Eliminar conversación?</h3>
            <p>Esta acción no se puede deshacer y perderás todo el historial de este chat.</p>
            <div className="modal-actions">
              <button
                className="btn-cancelar"
                onClick={() => setModalEliminar({ abierto: false, idChat: null })}
              >
                Cancelar
              </button>
              <button className="btn-eliminar" onClick={confirmarEliminarChat}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;