import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./contexts/auth";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/SignIn";
import Cadastro from "./pages/SignUp";
import Filme from "./pages/Film";
import Filmes from "./pages/Films";
import Favoritos from "./pages/Favorites";
import Categoria from "./pages/Category";
import Categorias from "./pages/Categories";
import Erro from "./pages/Error";

function RoutesApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Root Route */}
          <Route path="/" element={<Home />} />

          {/* Auth Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Cadastro />} />

          {/* Specific Film Route */}
          <Route path="/filme/:id" element={<Filme />} />

          {/* Film Catalog Routes */}
          <Route path="/filme" element={<Navigate to="/filmes" replace />} />
          <Route path="/filmes" element={<Filmes />} />

          {/* Favorite Films Route */}
          <Route path="/favoritos" element={<Favoritos />} />

          {/* Specific Category Route */}
          <Route path="/categoria/:id" element={<Categoria />} />

          {/* Category Catalog Routes */}
          <Route
            path="/categoria"
            element={<Navigate to="/categorias" replace />}
          />
          <Route path="/categorias" element={<Categorias />} />

          {/* The Wild Card Route */}
          <Route path="*" element={<Erro />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default RoutesApp;
