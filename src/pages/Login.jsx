import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import logo from "../assets/voomy-logo.png";
import mascota from "../assets/voomy-monster.png";
import fondoLogin from "../assets/login-background.jpg";

import {
  FaBus,
  FaMapMarkedAlt,
  FaRoute,
  FaExchangeAlt,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";


function Login() {
  const navigate = useNavigate();

  const [
    form,
    setForm
  ] = useState({
    email: "",
    password: ""
  });

  const [
    mensaje,
    setMensaje
  ] = useState("");

  const [
    mostrarPassword,
    setMostrarPassword
  ] = useState(false);

  const [
    enviando,
    setEnviando
  ] = useState(false);


  const handleChange = (
    event
  ) => {
    setForm({
      ...form,

      [event.target.name]:
        event.target.value
    });

    if (mensaje) {
      setMensaje("");
    }
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (enviando) {
      return;
    }

    setEnviando(true);
    setMensaje("");

    try {
      const response =
        await api.post(
          "/auth/login",
          form
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(
          response.data.usuario
        )
      );

      navigate("/");
    } catch (error) {
      setMensaje(
        error.response
          ?.data
          ?.mensaje
        ||
        "Error al iniciar sesión"
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
          backgroundImage:
            `url(${fondoLogin})`
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
              <FaBus />
            </div>

            <h1>
              Muévete por Santo Domingo
              de forma inteligente
            </h1>

            <p>
              Voomy es una plataforma
              desarrollada para consultar
              rutas, líneas, paradas y
              transbordos del transporte
              público urbano de Santo
              Domingo de los Tsáchilas.
            </p>

            <div className="login-benefits">

              <div className="login-benefit-item">
                <div className="login-benefit-icon">
                  <FaRoute />
                </div>

                <div>
                  <strong>
                    Rutas recomendadas
                  </strong>

                  <span>
                    Encuentra una alternativa
                    adecuada desde tu origen
                    hasta tu destino.
                  </span>
                </div>
              </div>

              <div className="login-benefit-item">
                <div className="login-benefit-icon">
                  <FaExchangeAlt />
                </div>

                <div>
                  <strong>
                    Transbordos claros
                  </strong>

                  <span>
                    Conoce dónde bajar y qué
                    línea debes tomar después.
                  </span>
                </div>
              </div>

              <div className="login-benefit-item">
                <div className="login-benefit-icon">
                  <FaMapMarkedAlt />
                </div>

                <div>
                  <strong>
                    Recorrido en el mapa
                  </strong>

                  <span>
                    Visualiza las rutas,
                    paradas y tramos de
                    caminata.
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
              Bienvenido
            </span>

            <h2>
              Inicia sesión
            </h2>

            <p>
              Ingresa tus datos para
              continuar utilizando Voomy.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={
              handleSubmit
            }
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
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
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
                  type={
                    mostrarPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setMostrarPassword(
                      (anterior) =>
                        !anterior
                    )
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
              disabled={
                enviando
              }
            >
              {enviando
                ? "Ingresando..."
                : "Ingresar"}
            </button>

          </form>

          <div className="login-register-section">
            <span>
              ¿No tienes una cuenta?
            </span>

            <Link to="/register">
              Crear cuenta
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

export default Login;