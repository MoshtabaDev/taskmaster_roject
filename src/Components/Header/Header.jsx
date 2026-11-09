import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import {
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
  FaTimes,
  FaCheckCircle,
  FaRegCircle,
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import styles from "./Header.module.css";

function Header() {
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    setIsNewTaskModalOpen,
    toggleTaskCompletion,
    currentUser,
    logoutUser,
    setIsSidebarOpen,
  } = useContext(TaskContext);

  const { t, i18n } = useTranslation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const currentLang = i18n.language || "en";
  const isFa = currentLang === "fa";
  const fullName =
    currentUser?.fullName?.trim() ||
    currentUser?.username?.trim() ||
    "Mojtaba Tahmasebi";
  const firstName = fullName.split(" ")[0];
  const avatarInitial = fullName.charAt(0).toUpperCase();
  const username = currentUser?.username || "mojtaba";
  const email = currentUser?.email || "mojtaba.dev@example.com";
  const role = currentUser?.role || "Front-End Developer";

  const toggleLanguage = () => {
    const nextLang = currentLang === "en" ? "fa" : "en";
    i18n.changeLanguage(nextLang);
    localStorage.setItem("taskmaster-lang-v2", nextLang);
    document.documentElement.dir = nextLang === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = nextLang;
  };

  const matchingTasks = searchQuery.trim()
    ? tasks.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.priority.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <header className={styles.container}>
      <div className={styles.leftHeader}>
        <button
          type="button"
          className={styles.hamburgerBtn}
          onClick={() => setIsSidebarOpen(true)}
          title="Open Menu"
        >
          <FaBars />
        </button>

        <div className={styles.welcome}>
          <h2>
            {isFa
              ? `خوش برگشتی، ${firstName}! 👋`
              : `Welcome back, ${firstName}! 👋`}
          </h2>
        </div>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder={t("header.searchPlaceholder")}
          value={searchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 180)}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => setSearchQuery("")}
            title="Clear search"
          >
            <FaTimes />
          </button>
        ) : (
          <FaSearch className={styles.searchIcon} />
        )}

        {searchQuery.trim() !== "" && isSearchFocused && (
          <div className={styles.searchDropdown}>
            <div className={styles.dropdownHeader}>
              <span>{t("header.searchResults")}</span>
              <span>
                {matchingTasks.length} {t("header.found")}
              </span>
            </div>

            {matchingTasks.length === 0 ? (
              <p className={styles.noResult}>
                {t("header.noResult")} "{searchQuery}"
              </p>
            ) : (
              <ul className={styles.resultList}>
                {matchingTasks.slice(0, 5).map((item) => (
                  <li
                    key={item.id}
                    className={styles.resultItem}
                    onMouseDown={() => toggleTaskCompletion(item.id)}
                  >
                    <div className={styles.resultLeft}>
                      {item.completed ? (
                        <FaCheckCircle className={styles.doneIcon} />
                      ) : (
                        <FaRegCircle className={styles.todoIcon} />
                      )}
                      <div>
                        <p
                          className={
                            item.completed ? styles.completedText : styles.title
                          }
                        >
                          {item.title}
                        </p>
                        <span className={styles.subText}>
                          {item.project} • {item.dueDate}
                        </span>
                      </div>
                    </div>
                    <span
                      className={
                        item.priority === "High"
                          ? styles.highTag
                          : item.priority === "Medium"
                            ? styles.mediumTag
                            : styles.lowTag
                      }
                    >
                      {item.priority}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          data-tour="new-task-btn"
          className={styles.newTaskBtn}
          onClick={() => setIsNewTaskModalOpen(true)}
        >
          {t("header.newTask")}
        </button>

        <FaBell className={styles.actionIcon} />

        <button
          type="button"
          className={
            currentLang === "fa" ? styles.langToggleFa : styles.langToggle
          }
          onClick={toggleLanguage}
          title={currentLang === "en" ? "تغییر به فارسی" : "Switch to English"}
        >
          <span className={styles.langCircle}></span>
          <span className={styles.langLabel}>
            {currentLang === "en" ? "EN" : "FA"}
          </span>
        </button>

        <button
          type="button"
          className={
            theme === "light" ? styles.themeToggleLight : styles.themeToggle
          }
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          <span className={styles.circle}></span>
          {theme === "dark" ? (
            <FaMoon className={styles.moonIcon} />
          ) : (
            <FaSun className={styles.sunIcon} />
          )}
        </button>
        <div className={styles.profileWrapper}>
          <div className={styles.headerAvatar}>{avatarInitial}</div>

          <div className={styles.profilePopup}>
            <div className={styles.popupHeader}>
              <div className={styles.popupLargeAvatar}>{avatarInitial}</div>
              <div className={styles.popupTitle}>
                <h4>{fullName}</h4>
                <span>{role}</span>
              </div>
            </div>

            <div className={styles.popupDetails}>
              <div className={styles.detailRow}>
                <FaUser className={styles.detailIcon} />
                <span>@{username}</span>
              </div>
              <div className={styles.detailRow}>
                <FaEnvelope className={styles.detailIcon} />
                <span>{email}</span>
              </div>
              <div className={styles.detailRow}>
                <FaIdBadge className={styles.detailIcon} />
                <span>{isFa ? "حساب کاربری فعال" : "Active Workspace"}</span>
              </div>
            </div>

            <div className={styles.popupFooter}>
              <Link to="/settings" className={styles.popupLinkBtn}>
                <FaCog />
                {isFa ? "تنظیمات حساب" : "Settings"}
              </Link>
              <button
                type="button"
                onClick={logoutUser}
                className={styles.popupLogoutBtn}
              >
                <FaSignOutAlt />
                {isFa ? "خروج" : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
