import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NewTaskModal from "../../Components/NewTaskModal/NewTaskModal";
import {
  FaUserCog,
  FaPalette,
  FaBell,
  FaDatabase,
  FaDownload,
  FaTrashAlt,
  FaCheckCircle,
  FaMoon,
  FaSun,
  FaLock,
  FaKey,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import styles from "./Settings.module.css";

function Settings() {
  const {
    tasks,
    theme,
    toggleTheme,
    removeTask,
    currentUser,
    updateUserProfile,
    changePassword,
    resetPasswordByUsername,
  } = useContext(TaskContext);

  const { t } = useTranslation();
  const [savedBanner, setSavedBanner] = useState(false);

  const notifStorageKey = `taskmaster-notif-${(
    currentUser?.username || "guest"
  ).toLowerCase()}`;

  const [profile, setProfile] = useState({
    fullName: currentUser?.fullName || "",
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    role: currentUser?.role || "Front-End Developer",
    bio:
      currentUser?.bio ||
      "React & Front-End Web Developer building clean, modular dashboards.",
  });

  useEffect(() => {
    setProfile({
      fullName: currentUser?.fullName || "",
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      role: currentUser?.role || "Front-End Developer",
      bio:
        currentUser?.bio ||
        "React & Front-End Web Developer building clean, modular dashboards.",
    });
  }, [currentUser]);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [recoveryUsername, setRecoveryUsername] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(0);
  const [recoveredNewPwd, setRecoveredNewPwd] = useState("");
  const [recoveryMsg, setRecoveryMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (otpTimeLeft <= 0) {
      if (generatedOtp !== null) {
        setGeneratedOtp(null);
        if (recoveryStep === 2) {
          setRecoveryMsg({
            type: "error",
            text: "Verification code expired (2 minutes passed).",
          });
          setRecoveryStep(1);
        }
      }
      return;
    }

    const timerId = setInterval(() => {
      setOtpTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [otpTimeLeft, generatedOtp, recoveryStep]);

  const formatTimer = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(notifStorageKey);
      return saved
        ? JSON.parse(saved)
        : {
            emailAlerts: true,
            taskReminders: true,
            weeklyReport: false,
          };
    } catch {
      return {
        emailAlerts: true,
        taskReminders: true,
        weeklyReport: false,
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(notifStorageKey, JSON.stringify(notifications));
    } catch (error) {
      console.error("Could not save notifications", error);
    }
  }, [notifications, notifStorageKey]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile(profile);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPwdMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setPwdMessage({
        type: "error",
        text: "New password and confirm password do not match!",
      });
      return;
    }

    const res = changePassword(oldPassword, newPassword);
    if (!res.success) {
      setPwdMessage({ type: "error", text: res.message });
    } else {
      setPwdMessage({ type: "success", text: res.message });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSendRecoveryCode = (e) => {
    e.preventDefault();
    setRecoveryMsg({ type: "", text: "" });

    const savedUsers = JSON.parse(
      localStorage.getItem("taskmaster-users-v2") || "[]",
    );
    const targetUser = savedUsers.find(
      (u) => u.username.toLowerCase() === recoveryUsername.trim().toLowerCase(),
    );

    if (!targetUser) {
      setRecoveryMsg({
        type: "error",
        text: "User ID (Username) not found in localStorage!",
      });
      return;
    }

    const random5Digit = String(Math.floor(10000 + Math.random() * 90000));
    setGeneratedOtp(random5Digit);
    setOtpTimeLeft(120);
    setOtpInput("");
    setRecoveryStep(2);
    setRecoveryMsg({
      type: "success",
      text: `5-digit code sent for @${targetUser.username}.`,
    });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setRecoveryMsg({ type: "", text: "" });

    if (!generatedOtp || otpTimeLeft <= 0) {
      setRecoveryMsg({
        type: "error",
        text: "Code has expired! Please request a new one.",
      });
      setRecoveryStep(1);
      return;
    }

    if (otpInput.trim() !== generatedOtp) {
      setRecoveryMsg({
        type: "error",
        text: "Invalid 5-digit code!",
      });
      return;
    }

    setRecoveryStep(3);
    setRecoveryMsg({
      type: "success",
      text: "Code verified! Enter your new password.",
    });
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setRecoveryMsg({ type: "", text: "" });

    if (recoveredNewPwd.length < 4) {
      setRecoveryMsg({
        type: "error",
        text: "New password must be at least 4 characters.",
      });
      return;
    }

    const res = resetPasswordByUsername(recoveryUsername, recoveredNewPwd);
    if (!res.success) {
      setRecoveryMsg({ type: "error", text: res.message });
    } else {
      setRecoveryMsg({
        type: "success",
        text: "Password successfully reset and saved!",
      });
      setGeneratedOtp(null);
      setOtpTimeLeft(0);
      setRecoveredNewPwd("");
      setTimeout(() => {
        setIsForgotOpen(false);
        setRecoveryStep(1);
      }, 2200);
    }
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `taskmaster-${currentUser?.username || "user"}-backup.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCompleted = () => {
    const completedList = tasks.filter((t) => t.completed);
    completedList.forEach((t) => removeTask(t.id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const avatarInitial = (
    profile.fullName?.[0] ||
    profile.username?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header />

        {generatedOtp && otpTimeLeft > 0 && (
          <div className={styles.otpFloatingAlert}>
            <div className={styles.otpAlertTop}>
              <span className={styles.otpAlertTitle}>
                <FaKey /> {t("settings.recoveryAlertTitle")}
              </span>
              <span className={styles.otpTimerBadge}>
                <FaClock /> {formatTimer(otpTimeLeft)}
              </span>
            </div>
            <p className={styles.otpAlertText}>
              {t("settings.recoveryAlertSub")}{" "}
              <strong>@{recoveryUsername}</strong>
            </p>
            <div className={styles.otpCodeDisplay}>{generatedOtp}</div>
          </div>
        )}

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>
              <h1>{t("settings.title")}</h1>
              <p>{t("settings.subtitle")}</p>
            </div>

            {savedBanner && (
              <div className={styles.savedToast}>
                <FaCheckCircle /> {t("settings.savedToast")}
              </div>
            )}
          </div>

          <div className={styles.settingsGrid}>
            <div className={styles.leftColumn}>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <FaUserCog className={styles.cardIcon} />
                  <h3>{t("settings.profileInfo")}</h3>
                </div>

                <form onSubmit={handleProfileSave} className={styles.form}>
                  <div className={styles.avatarRow}>
                    <div className={styles.largeAvatar}>{avatarInitial}</div>
                    <div className={styles.avatarMeta}>
                      <h4>{profile.fullName || profile.username}</h4>
                      <span>{profile.role}</span>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>{t("settings.fullName")}</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) =>
                          setProfile({ ...profile, fullName: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label>{t("settings.jobTitle")}</label>
                      <input
                        type="text"
                        value={profile.role}
                        onChange={(e) =>
                          setProfile({ ...profile, role: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>{t("settings.emailAddress")}</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label>{t("settings.shortBio")}</label>
                    <textarea
                      rows="3"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <div className={styles.formFooter}>
                    <button type="submit" className={styles.saveBtn}>
                      {t("settings.saveProfile")}
                    </button>
                  </div>
                </form>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHeaderBetween}>
                  <div className={styles.cardHeaderLeft}>
                    <FaLock className={styles.cardIcon} />
                    <h3>{t("settings.securityTitle")}</h3>
                  </div>

                  <button
                    type="button"
                    className={styles.forgotToggleBtn}
                    onClick={() => {
                      setIsForgotOpen(!isForgotOpen);
                      setPwdMessage({ type: "", text: "" });
                      setRecoveryMsg({ type: "", text: "" });
                      setRecoveryUsername(currentUser?.username || "");
                    }}
                  >
                    {isForgotOpen
                      ? t("settings.backToChangeBtn")
                      : t("settings.forgotBtn")}
                  </button>
                </div>

                {!isForgotOpen ? (
                  <form onSubmit={handlePasswordChange} className={styles.form}>
                    {pwdMessage.text && (
                      <div
                        className={
                          pwdMessage.type === "error"
                            ? styles.errorBox
                            : styles.successBox
                        }
                      >
                        <FaExclamationCircle /> {pwdMessage.text}
                      </div>
                    )}

                    <div className={styles.field}>
                      <label>{t("settings.currentPwd")}</label>
                      <input
                        type="password"
                        placeholder={t("settings.currentPwdPlaceholder")}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label>{t("settings.newPwd")}</label>
                        <input
                          type="password"
                          placeholder={t("settings.newPwdPlaceholder")}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.field}>
                        <label>{t("settings.confirmPwd")}</label>
                        <input
                          type="password"
                          placeholder={t("settings.confirmPwdPlaceholder")}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formFooter}>
                      <button type="submit" className={styles.saveBtn}>
                        {t("settings.updatePwdBtn")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.recoveryContainer}>
                    {recoveryMsg.text && (
                      <div
                        className={
                          recoveryMsg.type === "error"
                            ? styles.errorBox
                            : styles.successBox
                        }
                      >
                        <FaExclamationCircle /> {recoveryMsg.text}
                      </div>
                    )}

                    {recoveryStep === 1 && (
                      <form
                        onSubmit={handleSendRecoveryCode}
                        className={styles.form}
                      >
                        <p className={styles.sectionDesc}>
                          {t("settings.recoveryDesc1")}
                        </p>
                        <div className={styles.field}>
                          <label>{t("settings.userIdLabel")}</label>
                          <input
                            type="text"
                            placeholder="e.g. ali"
                            value={recoveryUsername}
                            onChange={(e) =>
                              setRecoveryUsername(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className={styles.formFooter}>
                          <button type="submit" className={styles.saveBtn}>
                            {t("settings.sendCodeBtn")}
                          </button>
                        </div>
                      </form>
                    )}

                    {recoveryStep === 2 && (
                      <form onSubmit={handleVerifyOtp} className={styles.form}>
                        <p className={styles.sectionDesc}>
                          {t("settings.recoveryDesc2")} (
                          {formatTimer(otpTimeLeft)}).
                        </p>
                        <div className={styles.field}>
                          <label>{t("settings.codeLabel")}</label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="e.g. 48291"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            required
                          />
                        </div>
                        <div className={styles.formFooter}>
                          <button type="submit" className={styles.saveBtn}>
                            {t("settings.verifyCodeBtn")}
                          </button>
                        </div>
                      </form>
                    )}

                    {recoveryStep === 3 && (
                      <form
                        onSubmit={handleResetPasswordSubmit}
                        className={styles.form}
                      >
                        <p className={styles.sectionDesc}>
                          {t("settings.recoveryDesc3")}{" "}
                          <strong>@{recoveryUsername}</strong>.
                        </p>
                        <div className={styles.field}>
                          <label>{t("settings.newPwd")}</label>
                          <input
                            type="password"
                            placeholder={t("settings.newPwdPlaceholder")}
                            value={recoveredNewPwd}
                            onChange={(e) => setRecoveredNewPwd(e.target.value)}
                            required
                          />
                        </div>
                        <div className={styles.formFooter}>
                          <button type="submit" className={styles.saveBtn}>
                            {t("settings.saveNewPwdBtn")}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </section>
            </div>

            <div className={styles.rightColumn}>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <FaPalette className={styles.cardIcon} />
                  <h3>{t("settings.appearanceTitle")}</h3>
                </div>

                <p className={styles.sectionDesc}>
                  {t("settings.appearanceDesc")}
                </p>

                <div className={styles.themeSelector}>
                  <button
                    type="button"
                    className={
                      theme === "dark"
                        ? styles.activeThemeCard
                        : styles.themeCard
                    }
                    onClick={() => theme !== "dark" && toggleTheme()}
                  >
                    <FaMoon className={styles.themeIcon} />
                    <div>
                      <h4>{t("settings.darkMode")}</h4>
                      <span>{t("settings.darkDesc")}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={
                      theme === "light"
                        ? styles.activeThemeCard
                        : styles.themeCard
                    }
                    onClick={() => theme !== "light" && toggleTheme()}
                  >
                    <FaSun className={styles.sunIcon} />
                    <div>
                      <h4>{t("settings.lightMode")}</h4>
                      <span>{t("settings.lightDesc")}</span>
                    </div>
                  </button>
                </div>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <FaBell className={styles.cardIcon} />
                  <h3>{t("settings.notificationsTitle")}</h3>
                </div>

                <div className={styles.toggleList}>
                  <div className={styles.toggleItem}>
                    <div>
                      <h4>{t("settings.emailAlerts")}</h4>
                      <span>{t("settings.emailAlertsDesc")}</span>
                    </div>
                    <button
                      type="button"
                      className={
                        notifications.emailAlerts
                          ? styles.switchOn
                          : styles.switchOff
                      }
                      onClick={() => toggleNotification("emailAlerts")}
                    >
                      <span className={styles.knob}></span>
                    </button>
                  </div>

                  <div className={styles.toggleItem}>
                    <div>
                      <h4>{t("settings.taskReminders")}</h4>
                      <span>{t("settings.taskRemindersDesc")}</span>
                    </div>
                    <button
                      type="button"
                      className={
                        notifications.taskReminders
                          ? styles.switchOn
                          : styles.switchOff
                      }
                      onClick={() => toggleNotification("taskReminders")}
                    >
                      <span className={styles.knob}></span>
                    </button>
                  </div>

                  <div className={styles.toggleItem}>
                    <div>
                      <h4>{t("settings.weeklyDigest")}</h4>
                      <span>{t("settings.weeklyDigestDesc")}</span>
                    </div>
                    <button
                      type="button"
                      className={
                        notifications.weeklyReport
                          ? styles.switchOn
                          : styles.switchOff
                      }
                      onClick={() => toggleNotification("weeklyReport")}
                    >
                      <span className={styles.knob}></span>
                    </button>
                  </div>
                </div>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <FaDatabase className={styles.cardIcon} />
                  <h3>{t("settings.workspaceData")}</h3>
                </div>

                <div className={styles.dataActions}>
                  <button
                    type="button"
                    className={styles.exportBtn}
                    onClick={handleExportTasks}
                  >
                    <FaDownload /> {t("settings.exportJson")} ({tasks.length})
                  </button>

                  <button
                    type="button"
                    className={styles.clearDataBtn}
                    onClick={handleClearCompleted}
                    disabled={completedCount === 0}
                  >
                    <FaTrashAlt /> {t("settings.clearCompleted")} (
                    {completedCount})
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <NewTaskModal />
    </div>
  );
}

export default Settings;
