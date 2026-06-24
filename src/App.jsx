import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MapaPage from "./pages/MapaPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Historial from "./pages/Historial";
import HistorialDetalle from "./pages/HistorialDetalle";

import "./App.css";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/mapa"
                    element={<MapaPage />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route 
                    path="/login" 
                    element={<Login />} 
                />

                <Route 
                    path="/register"  
                    element={<Register />} 
                />

                <Route
                    path="/historial"
                    element={<Historial />}
                />

                <Route
                    path="/historial/detalle/:id"
                    element={<HistorialDetalle />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;