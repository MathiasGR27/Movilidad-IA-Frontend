import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MapaPage from "./pages/MapaPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Historial from "./pages/Historial";
import HistorialDetalle from "./pages/HistorialDetalle";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Rutas protegidas */}

        <Route

          path="/"

          element={

            <ProtectedRoute>

              <Home />

            </ProtectedRoute>

          }

        />

        <Route

          path="/mapa"

          element={

            <ProtectedRoute>

              <MapaPage />

            </ProtectedRoute>

          }

        />

        <Route

          path="/profile"

          element={

            <ProtectedRoute>

              <Profile />

            </ProtectedRoute>

          }

        />

        <Route

          path="/historial"

          element={

            <ProtectedRoute>

              <Historial />

            </ProtectedRoute>

          }

        />

        <Route

          path="/historial/detalle/:id"

          element={

            <ProtectedRoute>

              <HistorialDetalle />

            </ProtectedRoute>

          }

        />


        {/* Rutas públicas */}

        <Route

          path="/login"

          element={<Login />}

        />

        <Route

          path="/register"

          element={<Register />}

        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;