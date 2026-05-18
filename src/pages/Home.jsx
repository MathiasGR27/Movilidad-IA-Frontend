import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ChatBot from "../components/ChatBot";
import Mapa from "../components/Mapa";

function Home() {
  const navigate = useNavigate();

  const [perfilAbierto, setPerfilAbierto] = useState(false);

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

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("mensajes_chat");
    localStorage.removeItem("origen");
    localStorage.removeItem("destino");
    localStorage.removeItem("rutaRecomendada");

    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <button className="logo-button">☰</button>

        <div className="nav-icons">
          <button className="nav-btn active">🏠</button>

          <Link to="/mapa">
            <button className="nav-btn">🗺️</button>
          </Link>
        </div>

        <div className="bottom-buttons">
          <button className="auth-btn">⚙️</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Voamy</h1>

          {usuario ? (
            <div className="profile-menu">
              <button
                className="profile-btn"
                onClick={() => setPerfilAbierto(!perfilAbierto)}
              >
                👤
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