import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

function Header() {
  const { signed, user, signOutUser } = useContext(AuthContext);
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        background: "#1A1A1A",
        color: "#F2EEE8",
        borderBottom: "2px solid #832613",
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#F2EEE8",
          fontSize: "24px",
          fontWeight: "bold",
          fontFamily: "Candal, sans-serif",
        }}
      >
        MovieLab 🎬
      </Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/filmes" style={{ color: "#F2EEE8", textDecoration: "none" }}>
          Catálogo
        </Link>
        <Link
          to="/categorias"
          style={{ color: "#F2EEE8", textDecoration: "none" }}
        >
          Categorias
        </Link>

        {signed ? (
          // SE ESTIVER LOGADO:
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Link
              to="/favoritos"
              style={{
                color: "#BD8C34",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Meus Favoritos
            </Link>

            <span style={{ fontSize: "14px", color: "#aaa" }}>
              {user?.name ? user.name.split(" ")[0] : "Visitante"}
            </span>

            <button
              onClick={signOutUser}
              style={{
                cursor: "pointer",
                background: "transparent",
                border: "1px solid #832613",
                color: "white",
                padding: "5px 12px",
                borderRadius: "4px",
              }}
            >
              Sair
            </button>
          </div>
        ) : (
          // SE NÃO ESTIVER LOGADO:
          <Link
            to="/login"
            style={{
              background: "#832613",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
