import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import styles from "./Header.module.css";
import logoImg from "../../assets/movielab-logo.svg";

function Header() {
  const { signed, user, signOutUser } = useContext(AuthContext);
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoContainer}>
        <img src={logoImg} alt="MovieLab" className={styles.logoImg} />
      </Link>

      <nav className={styles.nav}>
        <Link to="/filmes" className={styles.link}>
          Catálogo
        </Link>
        <Link to="/categorias" className={styles.link}>
          Categorias
        </Link>

        {signed ? (
          <>
            <Link
              to="/favoritos"
              className={`${styles.link} ${styles.favLink}`}
            >
              ♥ Meus Favoritos
            </Link>

            <div className={styles.userArea}>
              <span className={styles.userName}>
                Olá,{" "}
                <strong>
                  {user?.name ? user.name.split(" ")[0] : "Visitante"}
                </strong>
              </span>
              <button onClick={signOutUser} className={styles.btnSair}>
                SAIR
              </button>
            </div>
          </>
        ) : (
          <div className={styles.userArea} style={{ border: "none" }}>
            <Link to="/login" className={styles.btnEntrar}>
              Entrar
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
