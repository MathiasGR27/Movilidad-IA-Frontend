import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (!usuario) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div>
          <h1>Perfil de usuario</h1>
          <p>Gestiona tu información personal y preferencias de movilidad.</p>
        </div>

        <Link to="/">
          <button className="volver-btn">⬅ Volver al inicio</button>
        </Link>
      </header>

      <section className="profile-layout">
        <aside className="profile-card-main">
          <div className="profile-avatar-large">👤</div>

          <h2>{usuario.nombre}</h2>
          <p className="profile-role">Usuario registrado</p>

          <span className="profile-status">Activo</span>

          <div className="profile-basic-info">
            <div>
              <strong>Correo</strong>
              <span>{usuario.email}</span>
            </div>

            <div>
              <strong>Ciudad</strong>
              <span>Santo Domingo</span>
            </div>

            <div>
              <strong>ID de usuario</strong>
              <span>{usuario.id}</span>
            </div>
          </div>

          <button className="edit-profile-btn">Editar perfil</button>
        </aside>

        <main className="profile-details">
          <div className="profile-banner">
            <h3>Movilidad inteligente</h3>
            <p>
              Consulta rutas urbanas, guarda trayectos favoritos y recibe
              recomendaciones asistidas por IA.
            </p>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <span>🚌</span>
              <h3>0</h3>
              <p>Viajes consultados</p>
            </div>

            <div className="stat-card">
              <span>⭐</span>
              <h3>0</h3>
              <p>Rutas favoritas</p>
            </div>

            <div className="stat-card">
              <span>🤖</span>
              <h3>0</h3>
              <p>Consultas con IA</p>
            </div>
          </div>

          <div className="profile-section-card">
            <h3>Información personal</h3>

            <div className="info-list">
              <div>
                <span>Nombre completo</span>
                <strong>{usuario.nombre}</strong>
              </div>

              <div>
                <span>Correo electrónico</span>
                <strong>{usuario.email}</strong>
              </div>

              <div>
                <span>Tipo de usuario</span>
                <strong>Ciudadano</strong>
              </div>

              <div>
                <span>Última conexión</span>
                <strong>Hoy</strong>
              </div>
            </div>
          </div>

          <div className="profile-actions-card">
            <h3>Acciones de cuenta</h3>

            <div className="profile-action-buttons">
              <button>Cambiar contraseña</button>
              <button>Preferencias de rutas</button>
              <button className="danger" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Profile;