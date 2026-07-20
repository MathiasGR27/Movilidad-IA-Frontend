import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

// ---------------------------------------------------------------
// LOGOS / ÍCONOS
// ---------------------------------------------------------------
import logoChatbus from "../assets/logo-negro-fondoazul.png";        // Logo ChatBus (panel oscuro)
import logoChatbusForm from "../assets/logo-negro-fondoblanco.png";  // Logo ChatBus (panel del formulario)
import iconoRutas from "../assets/map.png";                          // Ícono "rutas / mapa"
import iconoTransbordo from "../assets/end-to-end.png";              // Ícono "punto a punto / transbordo"
import iconoDestino from "../assets/browser.png";                    // Ícono "destino / recorrido"

import fondoLogin from "../assets/login-background.jpg";

import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
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

    if (enviando) return;

    setEnviando(true);
    setMensaje("");

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      navigate("/");
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || "Error al iniciar sesión"
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="login-page">

      {/* ==================================
          PANEL INFORMATIVO (izquierda)
      ================================== */}
      <section
        className="login-information-panel"
        style={{ backgroundImage: `url(${fondoLogin})` }}
      >
        <div className="login-information-overlay" />

        <div className="login-information-content">

          <div className="login-brand">
            <img src={logoChatbus} alt="ChatBus" className="login-brand-logo" />
            <span>Movilidad inteligente · Santo Domingo</span>
          </div>

          <div className="login-hero-content">

            <h1>
              Muévete por la ciudad{" "}
              <span className="login-highlight">sin perderte.</span>
            </h1>

            <p>
              Consulta <span className="login-highlight-soft">rutas, líneas, paradas y
              transbordos</span> del transporte público urbano. Tu guía de
              movilidad siempre en el <span className="login-highlight-soft">bolsillo</span>.
            </p>

            <div className="login-benefits">

              <div className="login-benefit-item">
                <div className="login-benefit-icon">
                  <img src={iconoRutas} alt="" />
                </div>
                <div>
                  <strong>Rutas recomendadas</strong>
                  <span>Encuentra la alternativa óptima desde tu origen hasta tu destino.</span>
                </div>
              </div>

              <div className="login-benefit-item">
                <div className="login-benefit-icon">
                  <img src={iconoTransbordo} alt="" />
                </div>
                <div>
                  <strong>Transbordos claros</strong>
                  <span>Conoce dónde bajar y qué línea debes tomar después.</span>
                </div>
              </div>

              <div className="login-benefit-item">
                <div className="login-benefit-icon">
                  <img src={iconoDestino} alt="" />
                </div>
                <div>
                  <strong>Recorrido en el mapa</strong>
                  <span>Visualiza rutas, paradas y tramos de caminata en tiempo real.</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ==================================
          PANEL DEL FORMULARIO (derecha)
      ================================== */}
      <section className="login-form-panel">

        <div className="login-form-wrapper">

          <div className="login-form-heading">
            <img src={logoChatbusForm} alt="ChatBus" className="login-form-logo" />
            <p>Ingresa tu correo electrónico para iniciar sesión</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>

            {mensaje && (
              <div className="login-error" role="alert">
                {mensaje}
              </div>
            )}

            <div className="login-field">
              <div className="login-input-wrapper">
                <FaEnvelope />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Correo"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-input-wrapper">
                <FaLock />
                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setMostrarPassword((anterior) => !anterior)}
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-button" disabled={enviando}>
              {enviando ? "Ingresando..." : "Ingresar"}
            </button>

          </form>

          <div className="login-register-section">
            <span>¿No tienes una cuenta?</span>
            <Link to="/register">Regístrate</Link>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Login;