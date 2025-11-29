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
    <header>
      <Link to="/">MovieLab 🎬</Link>

      <div>
        <Link to="/filmes">Catálogo</Link>
        <Link to="/categorias">Categorias</Link>

        {signed ? (
          // SE ESTIVER LOGADO:
          <div>
            <Link to="/favoritos">Meus Favoritos</Link>

            <span>{user?.name ? user.name.split(" ")[0] : "Visitante"}</span>

            <button onClick={signOutUser}>Sair</button>
          </div>
        ) : (
          // SE NÃO ESTIVER LOGADO:
          <Link to="/login">Entrar</Link>
        )}
      </div>
    </header>
  );
}

export default Header;
