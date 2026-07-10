import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import logo from "../assets/voomy-logo.png";
import mascota from "../assets/voomy-monster.png";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      navigate("/");
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="voomy-login-page">

      <div className="voomy-logo">
        <img src={logo} alt="Logo" />
      </div>

      <form
        className="voomy-login-container"
        onSubmit={handleSubmit}
      >

        <div className="voomy-mascot">
          <img src={mascota} alt="Mascota" />
        </div>

        <h2>
          Ingresa tu correo electrónico para iniciar sesión
        </h2>

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
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">
          Ingresar
        </button>

        <p className="register-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>

      </form>

    </div>
  );
}

export default Login;