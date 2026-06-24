import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import ChatBot from "../components/ChatBot";
import Mapa from "../components/Mapa";

import {
  FaBars,
  FaHome,
  FaMapMarkedAlt,
  FaPlus,
  FaCog,
  FaUserCircle
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [conversaciones, setConversaciones] = useState([]);

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

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const cargarConversaciones = async () => {
    try {
      if (!usuario) return [];

      const response = await api.get(
        `/conversaciones/${usuario.id}`
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error cargando conversaciones",
        error
      );
      return [];
    }
  };

  useEffect(() => {
    let cancelado = false;

    cargarConversaciones().then((data) => {
      if (!cancelado) {
        setConversaciones(data);
      }
    });

    return () => {
      cancelado = true;
    };
  }, [usuario]);

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
      const response = await api.post(
        "/conversaciones"
      );

      localStorage.setItem(
        "conversacion_id",
        response.data.id
      );

      localStorage.removeItem("origen");
      localStorage.removeItem("destino");
      localStorage.removeItem("rutaRecomendada");
      localStorage.removeItem("mensajes_chat");
      localStorage.removeItem("transbordosInfo");

      setOrigen(null);
      setDestino(null);
      setRutaRecomendada(null);

      setChatKey((prev) => prev + 1);

      const conversacionesActualizadas =
        await cargarConversaciones();
      setConversaciones(conversacionesActualizadas);
    } catch (error) {
      console.error(
        "Error creando conversación",
        error
      );
    }
  };

  const abrirConversacion = async (conversacionId) => {
    try {
      const response = await api.get(
        `/conversacion/${conversacionId}`
      );

      localStorage.setItem(
        "mensajes_chat",
        JSON.stringify(response.data)
      );

      localStorage.setItem(
        "conversacion_id",
        conversacionId
      );

      localStorage.removeItem("origen");
      localStorage.removeItem("destino");
      localStorage.removeItem("rutaRecomendada");
      localStorage.removeItem("transbordosInfo");

      setOrigen(null);
      setDestino(null);
      setRutaRecomendada(null);

      setChatKey((prev) => prev + 1);
    } catch (error) {
      console.error(
        "Error cargando conversación",
        error
      );
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <button className="logo-button">
          <FaBars />
        </button>

        <div className="nav-icons">
          <button className="nav-btn active">
            <FaHome />
          </button>

          <Link to="/mapa">
            <button className="nav-btn">
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

          <div className="conversation-list">
            <h4>Chats</h4>

            {conversaciones.map((c) => (
              <button
                key={c.id}
                className="conversation-btn"
                onClick={() =>
                  abrirConversacion(c.id)
                }
              >
                <span>Chat #{c.id}</span>
                <small>{c.fecha}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="bottom-buttons">
          <button className="auth-btn">
            <FaCog />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Voamy</h1>

          {usuario ? (
            <div className="profile-menu">
              <button
                className="profile-btn"
                onClick={() =>
                  setPerfilAbierto(!perfilAbierto)
                }
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
                    <button>Ver perfil</button>
                  </Link>

                  <button>Configuración</button>

                  <button
                    className="logout"
                    onClick={cerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="top-auth-actions">
              <Link to="/login">
                <button className="top-auth-btn">
                  Iniciar sesión
                </button>
              </Link>

              <Link to="/register">
                <button className="top-auth-btn">
                  Registrarse
                </button>
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
    </div>
  );
}

export default Home;