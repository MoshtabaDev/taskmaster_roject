import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NewTaskModal from "../../Components/NewTaskModal/NewTaskModal";
import { FaExclamationTriangle, FaHome, FaArrowLeft } from "react-icons/fa";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header />

        <main className={styles.content}>
          <div className={styles.errorCard}>
            <div className={styles.iconWrapper}>
              <FaExclamationTriangle className={styles.warningIcon} />
            </div>

            <h1 className={styles.errorCode}>404</h1>

            <h2 className={styles.errorTitle}>
              {isFa ? "صفحه مورد نظر پیدا نشد!" : "Page Not Found!"}
            </h2>

            <p className={styles.errorDesc}>
              {isFa
                ? "آدرسی که وارد کرده‌اید در داشبورد وجود ندارد یا ممکن است جابه‌جا شده باشد."
                : "The page you are looking for doesn't exist or has been moved to another URL."}
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
                {isFa ? "بازگشت به صفحه قبل" : "Go Back"}
              </button>

              <Link to="/" className={styles.homeBtn}>
                <FaHome />
                {isFa ? "رفتن به نمای کلی" : "Back to Overview"}
              </Link>
            </div>
          </div>
        </main>
      </div>

      <NewTaskModal />
    </div>
  );
}

export default NotFound;