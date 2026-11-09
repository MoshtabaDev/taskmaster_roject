import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import {
  FaHome,
  FaCheckCircle,
  FaFolder,
  FaColumns,
  FaChartBar,
  FaCog,
  FaTasks,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { currentUser, logoutUser, isSidebarOpen, setIsSidebarOpen } =
    useContext(TaskContext);

  const displayName =
    currentUser?.fullName || currentUser?.username || "Mojtaba T.";
  const avatarInitial = displayName[0]?.toUpperCase() || "M";

  const closeSidebar = () => {
    if (setIsSidebarOpen) setIsSidebarOpen(false);
  };

  return (
    <>
      {isSidebarOpen && (
        <div className={styles.backdrop} onClick={closeSidebar}></div>
      )}

      <aside
        className={`${styles.container} ${
          isSidebarOpen ? styles.openMobile : ""
        }`}
      >
        <div className={styles.topSection}>
          <div className={styles.logoRow}>
            <div className={styles.logo}>
              <FaTasks className={styles.logoIcon} />
              <h1>TaskMaster</h1>
            </div>

            <button
              type="button"
              className={styles.closeMobileBtn}
              onClick={closeSidebar}
              title="Close Menu"
            >
              <FaTimes />
            </button>
          </div>

          <nav className={styles.nav}>
            <ul>
              <li>
                <Link
                  to="/"
                  onClick={closeSidebar}
                  className={
                    location.pathname === "/" ? styles.activeLink : styles.link
                  }
                >
                  <FaHome className={styles.icon} />
                  <span>{t("sidebar.overview")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/my-tasks"
                  onClick={closeSidebar}
                  className={
                    location.pathname === "/my-tasks"
                      ? styles.activeLink
                      : styles.link
                  }
                >
                  <FaCheckCircle className={styles.icon} />
                  <span>{t("sidebar.myTasks")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  onClick={closeSidebar}
                  className={
                    location.pathname === "/projects"
                      ? styles.activeLink
                      : styles.link
                  }
                >
                  <FaFolder className={styles.icon} />
                  <span>{t("sidebar.projects")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/kanban"
                  data-tour="nav-kanban"
                  onClick={closeSidebar}
                  className={
                    location.pathname === "/kanban"
                      ? styles.activeLink
                      : styles.link
                  }
                >
                  <FaColumns className={styles.icon} />
                  <span>{t("sidebar.kanban")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  onClick={closeSidebar}
                  className={
                    location.pathname === "/analytics"
                      ? styles.activeLink
                      : styles.link
                  }
                >
                  <FaChartBar className={styles.icon} />
                  <span>{t("sidebar.analytics")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  onClick={closeSidebar}
                  className={
                    location.pathname === "/settings"
                      ? styles.activeLink
                      : styles.link
                  }
                >
                  <FaCog className={styles.icon} />
                  <span>{t("sidebar.settings")}</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{avatarInitial}</div>
            <span>{displayName}</span>
          </div>
          <button
            type="button"
            onClick={logoutUser}
            title="Logout"
            className={styles.logoutBtn}
          >
            <FaSignOutAlt className={styles.settingsIcon} />
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
