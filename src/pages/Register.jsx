import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import logo from "../assets/voomy-logo.png";
import mascota from "../assets/voomy-monster.png";
import fondoLogin from "../assets/login-background.jpg";

import {
  FaUserPlus,
  FaHeart,
  FaHistory,
  FaBolt,
  FaMapMarkedAlt,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";


function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });

    if (mensaje) {
      setMensaje("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (enviando) {
      return;
    }

    setEnviando(true);
    setMensaje("");

    try {
      await api.post("/auth/register", form);

      navigate("/login");
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
        "Error al registrar usuario"
      );
    } finally {
      setEnviando(false);
    }
  };


  return (
    <main className="login-page">

      {/* ==================================
          PANEL INFORMATIVO
      ================================== */}

      <section
        className="login-information-panel"
        style={{
          backgroundImage: `url(${fondoLogin})`
        }}
      >
        <div className="login-information-overlay" />

        <div className="login-information-content">

          <div className="login-brand">
            <img
              src={logo}
              alt="Logo de Voomy"
            />

            <span>
              Movilidad inteligente
            </span>
          </div>

          <div className="login-hero-content">

            <div className="login-hero-icon">
              <FaUserPlus />
            </div>

            <h1>
              Crea tu cuenta y viaja
              de forma más inteligente
            </h1>

            <p>
              Regístrate en Voomy para guardar tus
              rutas favoritas, revisar tu historial
              y consultar el transporte público
              urbano de Santo Domingo de los
              Tsáchilas desde cualquier dispositivo.
            </p>

            <div className="login-benefits">

              <div className="login-benefit-item">
                <div className="login-benefit-icon">
                  <FaHeart />
                </div>

                <div>
                  <strong>
                    Rutas favoritas
                  </strong>

                  <span>
                    Guarda las rutas que más usas
                    para acceder a ellas más rápido.
                  </span>
                </div>
              </div>

              <div className="login-benefit-item">
                <div className="login-benefit-icon">
                  <FaHistory />
                </div>

                <div>
                  <strong>
                    Historial de búsquedas
                  </strong>

                  <span>
                    Revisa las rutas y trayectos que
                    consultaste anteriormente.
                  </span>
                </div>
              </div>

              <div className="login-benefit-item">
                <div className="login-benefit-icon">
                  <FaBolt />
                </div>

                <div>
                  <strong>
                    Acceso desde cualquier lugar
                  </strong>

                  <span>
                    Tu cuenta te acompaña en cualquier
                    dispositivo, cuando la necesites.
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div className="login-information-footer">
            <span>
              Exclusivamente para el
              transporte público urbano
              de Santo Domingo.
            </span>
          </div>

        </div>
      </section>


      {/* ==================================
          PANEL DEL FORMULARIO
      ================================== */}

      <section className="login-form-panel">

        <div className="login-form-wrapper">

          <div className="login-mobile-logo">
            <img
              src={logo}
              alt="Logo de Voomy"
            />
          </div>

          <div className="login-mascot">
            <img
              src={mascota}
              alt="Mascota de Voomy"
            />
          </div>

          <div className="login-form-heading">
            <span>
              Únete a Voomy
            </span>

            <h2>
              Crea tu cuenta
            </h2>

            <p>
              Completa tus datos para
              comenzar a usar Voomy.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {mensaje && (
              <div
                className="login-error"
                role="alert"
              >
                {mensaje}
              </div>
            )}

            <div className="login-field">

              <label htmlFor="nombre">
                Nombre completo
              </label>

              <div className="login-input-wrapper">
                <FaUser />

                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre completo"
                  value={form.nombre}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="login-field">

              <label htmlFor="email">
                Correo electrónico
              </label>

              <div className="login-input-wrapper">
                <FaEnvelope />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">

              <label htmlFor="password">
                Contraseña
              </label>

              <div className="login-input-wrapper">
                <FaLock />

                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  name="password"
                  placeholder="Crea una contraseña"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setMostrarPassword((anterior) => !anterior)
                  }
                  aria-label={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {mostrarPassword
                    ? <FaEyeSlash />
                    : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-button"
              disabled={enviando}
            >
              {enviando
                ? "Creando cuenta..."
                : "Registrarse"}
            </button>

          </form>

          <div className="login-register-section">
            <span>
              ¿Ya tienes una cuenta?
            </span>

            <Link to="/login">
              Inicia sesión
            </Link>
          </div>

          <div className="login-service-note">
            <FaMapMarkedAlt />

            <span>
              Aplicación exclusiva para
              el transporte urbano de
              Santo Domingo.
            </span>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Register;