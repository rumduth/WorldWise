import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import { useResolvedPath } from "react-router-dom";

function Sidebar() {
  const path = useResolvedPath();
  return (
    <div className={styles.sidebar}>
      {path.pathname !== '/app/profile' && <>
      <Logo />
      <AppNav />
      </>}

      <Outlet />

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by WorldWise Inc.
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;
