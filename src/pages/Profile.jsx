import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  FaBus, FaRobot, FaUserCircle, FaEnvelope, FaMapMarkerAlt, FaHistory, FaStar, FaUser, FaSignOutAlt
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const usuarioInicial = JSON.parse(
    localStorage.getItem("usuario")
  );

  const [usuario, setUsuario] = useState(
    usuarioInicial
  );

  const [estadisticas, setEstadisticas] = useState({
    viajes_consultados: 0,
    consultas_ia: 0
  });

  const [favoritos, setFavoritos] = useState(0);

  const [modalPerfil, setModalPerfil] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);

  const [formPerfil, setFormPerfil] = useState({
    nombre: usuarioInicial?.nombre || "",
    email: usuarioInicial?.email || ""
  });

  const [formPassword, setFormPassword] = useState({
    password_actual: "",
    password_nueva: ""
  });

  const [modalMensaje, setModalMensaje] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");
  const [tipoModal, setTipoModal] = useState("success");

  const mostrarModalMensaje = (mensaje, tipo = "success") => {
    setMensajeModal(mensaje);
    setTipoModal(tipo);
    setModalMensaje(true);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const perfilRes = await api.get(
          `/perfil/${usuario.id}`
        );

        setUsuario({
          id: perfilRes.data.id,
          nombre: perfilRes.data.nombre,
          email: perfilRes.data.email
        });

        setFormPerfil({
          nombre: perfilRes.data.nombre,
          email: perfilRes.data.email
        });

        setEstadisticas({
          viajes_consultados:
            perfilRes.data.viajes_consultados || 0,

          consultas_ia:
            perfilRes.data.consultas_ia || 0
        });

        const favoritosRes = await api.get(
          `/favoritos/${usuario.id}`
        );

        setFavoritos(
          favoritosRes.data.length
        );
      } catch (error) {
        console.error(
          "Error cargando perfil:",
          error
        );
      }
    };

    if (usuario) {
      cargarDatos();
    }
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

  const actualizarPerfil = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(
        `/perfil/${usuario.id}`,
        formPerfil
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(res.data.usuario)
      );

      setUsuario(res.data.usuario);
      setModalPerfil(false);

      mostrarModalMensaje("Perfil actualizado correctamente");
    } catch (error) {
      mostrarModalMensaje(
        error.response?.data?.error ||
        "No se pudo actualizar el perfil",
        "error"
      );
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();

    try {
      await api.put(

        `/perfil/${usuario.id}/password`,

        {
          password_actual: formPassword.password_actual,
          password_nueva: formPassword.password_nueva
        }

      );


      setFormPassword({
        password_actual: "",
        password_nueva: ""
      });

      setModalPassword(false);

      mostrarModalMensaje("Contraseña actualizada correctamente");
    } catch (error) {
      mostrarModalMensaje(
        error.response?.data?.error ||
        "No se pudo cambiar la contraseña",
        "error"
      );
    }
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

          <p>
            Gestiona tu información personal y preferencias de movilidad.
          </p>
        </div>

        <Link to="/">
          <button className="volver-btn">
            ← Volver al inicio
          </button>
        </Link>
      </header>

      <section className="profile-layout">
        <aside className="profile-card-main">
          <div className="profile-avatar-large">
            <FaUserCircle />
          </div>

          <h2>{usuario.nombre}</h2>

          <p className="profile-role">
            Usuario registrado
          </p>

          <span className="profile-status">
            Activo
          </span>

          <div className="profile-basic-info">
            <div>
              <strong>
                <FaEnvelope />
                &nbsp; Correo
              </strong>

              <span>
                {usuario.email}
              </span>
            </div>

            <div>
              <strong>
                <FaMapMarkerAlt />
                &nbsp; Ciudad
              </strong>

              <span>
                Santo Domingo
              </span>
            </div>

            <div>
              <strong>
                <FaUser />
                &nbsp; ID Usuario
              </strong>

              <span>
                {usuario.id}
              </span>
            </div>
          </div>

          <button
            className="edit-profile-btn"
            onClick={() => setModalPerfil(true)}
          >
            Editar perfil
          </button>

          <Link to="/historial">
            <button className="edit-profile-btn">
              <FaHistory />
              &nbsp;
              Historial de rutas
            </button>
          </Link>
        </aside>

        <main className="profile-details">
          <div className="profile-banner">
            <h3>
              Sistema Inteligente de Movilidad Urbana
            </h3>

            <p>
              Consulta rutas óptimas, administra tus trayectos favoritos
              y recibe recomendaciones inteligentes mediante IA.
            </p>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <FaBus className="stat-icon" />

              <h3>
                {estadisticas.viajes_consultados}
              </h3>

              <p>
                Viajes consultados
              </p>
            </div>

            <div className="stat-card">
              <FaStar className="stat-icon" />

              <h3>
                {favoritos}
              </h3>

              <p>
                Rutas favoritas
              </p>
            </div>

            <div className="stat-card">
              <FaRobot className="stat-icon" />

              <h3>
                {estadisticas.consultas_ia}
              </h3>

              <p>
                Consultas con IA
              </p>
            </div>
          </div>

          <div className="profile-section-card">
            <h3>
              Información personal
            </h3>

            <div className="info-list">
              <div>
                <span>
                  Nombre completo
                </span>

                <strong>
                  {usuario.nombre}
                </strong>
              </div>

              <div>
                <span>
                  Correo electrónico
                </span>

                <strong>
                  {usuario.email}
                </strong>
              </div>

              <div>
                <span>
                  Tipo de usuario
                </span>

                <strong>
                  Ciudadano
                </strong>
              </div>

              <div>
                <span>
                  Última conexión
                </span>

                <strong>
                  Hoy
                </strong>
              </div>
            </div>
          </div>

          <div className="profile-actions-card">
            <h3>
              Acciones de cuenta
            </h3>

            <div className="profile-action-buttons">
              <button
                onClick={() => setModalPassword(true)}
              >
                Cambiar contraseña
              </button>

              <button
                className="danger"
                onClick={cerrarSesion}
              >
                <FaSignOutAlt />
                &nbsp;
                Cerrar sesión
              </button>
            </div>
          </div>
        </main>
      </section>

      {modalPerfil && (
        <div className="modal-overlay">
          <form
            className="modal-card"
            onSubmit={actualizarPerfil}
          >
            <h3>Editar perfil</h3>

            <input
              type="text"
              value={formPerfil.nombre}
              onChange={(e) =>
                setFormPerfil({
                  ...formPerfil,
                  nombre: e.target.value
                })
              }
              placeholder="Nombre"
            />

            <input
              type="email"
              value={formPerfil.email}
              onChange={(e) =>
                setFormPerfil({
                  ...formPerfil,
                  email: e.target.value
                })
              }
              placeholder="Correo"
            />

            <div className="modal-actions">
              <button type="submit">
                Guardar
              </button>

              <button
                type="button"
                className="danger"
                onClick={() => setModalPerfil(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {modalPassword && (
        <div className="modal-overlay">
          <form
            className="modal-card"
            onSubmit={cambiarPassword}
          >
            <h3>Cambiar contraseña</h3>

            <input
              type="password"
              value={formPassword.password_actual}
              onChange={(e) =>
                setFormPassword({
                  ...formPassword,
                  password_actual: e.target.value
                })
              }
              placeholder="Contraseña actual"
            />

            <input
              type="password"
              value={formPassword.password_nueva}
              onChange={(e) =>
                setFormPassword({
                  ...formPassword,
                  password_nueva: e.target.value
                })
              }
              placeholder="Nueva contraseña"
            />

            <div className="modal-actions">
              <button type="submit">
                Cambiar
              </button>

              <button
                type="button"
                className="danger"
                onClick={() => setModalPassword(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      {modalMensaje && (
        <div className="modal-overlay">
          <div className={`modal-card mensaje-modal ${tipoModal}`}>
            <h3>
              {tipoModal === "success"
                ? "Operación exitosa"
                : "Ocurrió un error"}
            </h3>

            <p>{mensajeModal}</p>

            <button
              onClick={() => setModalMensaje(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;