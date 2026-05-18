import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MapaPage from "./pages/MapaPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

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

            </Routes>

        </BrowserRouter>
    );
}

export default App;