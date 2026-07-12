import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import logo from "../assets/voomy-logo.png";
import mascota from "../assets/voomy-monster.png";

import {
  FaBus,
  FaMapMarkedAlt
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

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value
    });
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      const response = await api.post(
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
          ?.mensaje ||
          "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="voomy-login-page">

      <div className="voomy-logo">
        <img
          src={logo}
          alt="Logo de Voomy"
        />

        <div className="login-app-description">
          <FaBus />

          <p>
            Sistema inteligente para
            consultar rutas del transporte
            público urbano de Santo Domingo
            de los Tsáchilas.
          </p>
        </div>
      </div>

      <form
        className="voomy-login-container"
        onSubmit={handleSubmit}
      >

        <div className="voomy-mascot">
          <img
            src={mascota}
            alt="Mascota de Voomy"
          />
        </div>

        <h2>
          Ingresa tu correo electrónico
          para iniciar sesión
        </h2>

        <div className="login-service-label">
          <FaMapMarkedAlt />

          <span>
            Aplicación exclusiva para el
            transporte urbano de Santo Domingo
          </span>
        </div>

        {mensaje && (
          <div className="auth-error">
            {mensaje}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Ingresar
        </button>

        <p className="register-text">
          ¿No tienes cuenta?{" "}

          <Link to="/register">
            Regístrate
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;