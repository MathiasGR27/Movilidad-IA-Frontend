import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import logo from "../assets/voomy-logo.png";
import mascota from "../assets/voomy-monster.png";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      navigate("/login");
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
        "Error al registrar usuario"
      );
    }
  };

  return (
    <div className="voomy-login-page">

      {/* LOGO */}
      <div className="voomy-logo">
        <img
          src={logo}
          alt="Logo Voomy"
        />
      </div>

      {/* FORMULARIO */}
      <form
        className="voomy-login-container"
        onSubmit={handleSubmit}
      >

        {/* MASCOTA */}
        <div className="voomy-mascot">
          <img
            src={mascota}
            alt="Mascota Voomy"
          />
        </div>

        <h2>
          Crea una cuenta para comenzar a usar Voomy
        </h2>

        {mensaje && (
          <div className="auth-error">
            {mensaje}
          </div>
        )}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
        />

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
          Registrarse
        </button>

        <p className="register-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">
            Inicia sesión
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;