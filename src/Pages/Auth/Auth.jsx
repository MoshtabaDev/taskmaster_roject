import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../../Context/TaskContext";
import {
  FaTasks,
  FaUser,
  FaLock,
  FaEnvelope,
  FaMoon,
  FaSun,
  FaKey,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";
import styles from "./Auth.module.css";

function Auth() {
  const {
    loginUser,
    registerUser,
    resetPasswordByUsername,
    theme,
    toggleTheme,
  } = useContext(TaskContext);

  const [authMode, setAuthMode] = useState("login");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [recoveryUsername, setRecoveryUsername] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(0);
  const [newRecoveredPwd, setNewRecoveredPwd] = useState("");

  useEffect(() => {
    if (otpTimeLeft <= 0) {
      if (generatedOtp !== null) {
        setGeneratedOtp(null);
        if (authMode === "forgot" && recoveryStep === 2) {
          setErrorMsg(
            "Verification code expired (2 minutes passed). Please request a new code."
          );
          setSuccessMsg("");
          setRecoveryStep(1);
        }
      }
      return;
    }

    const timerId = setInterval(() => {
      setOtpTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [otpTimeLeft, generatedOtp, authMode, recoveryStep]);

  const formatTimer = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetMessages();

    if (authMode === "login") {
      const result = loginUser(username, password);
      if (!result.success) {
        setErrorMsg(result.messageEn);
      }
    } else if (authMode === "signup") {
      if (password.length < 4) {
        setErrorMsg("Password must be at least 4 characters.");
        return;
      }

      const result = registerUser({
        fullName,
        username,
        email,
        password,
      });

      if (!result.success) {
        setErrorMsg(result.messageEn);
      }
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    resetMessages();

    const savedUsers = JSON.parse(
      localStorage.getItem("taskmaster-users-v2") || "[]"
    );
    const targetUser = savedUsers.find(
      (u) => u.username.toLowerCase() === recoveryUsername.trim().toLowerCase()
    );

    if (!targetUser) {
      setErrorMsg("User ID (Username) not found! Please check or Sign Up.");
      return;
    }

    const randomCode = String(Math.floor(10000 + Math.random() * 90000));
    setGeneratedOtp(randomCode);
    setOtpTimeLeft(120); // 2 minutes
    setOtpInput("");
    setRecoveryStep(2);
    setSuccessMsg(`5-digit code generated for @${targetUser.username}.`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    resetMessages();

    if (!generatedOtp || otpTimeLeft <= 0) {
      setErrorMsg("Code expired! Please request a new code.");
      setRecoveryStep(1);
      return;
    }

    if (otpInput.trim() !== generatedOtp) {
      setErrorMsg("Invalid 5-digit code! Check the top-right alert box.");
      return;
    }

    setRecoveryStep(3);
    setSuccessMsg("Code verified! Please set your new password.");
  };

  const handleSaveNewPassword = (e) => {
    e.preventDefault();
    resetMessages();

    if (newRecoveredPwd.length < 4) {
      setErrorMsg("New password must be at least 4 characters.");
      return;
    }

    const res = resetPasswordByUsername(recoveryUsername, newRecoveredPwd);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setGeneratedOtp(null);
      setOtpTimeLeft(0);
      setUsername(recoveryUsername);
      setPassword("");
      setNewRecoveredPwd("");
      setAuthMode("login");
      setRecoveryStep(1);
      setSuccessMsg(
        "Password reset successfully! You can now sign in with your new password."
      );
    }
  };

  return (
    <div className={styles.overlay} dir="ltr">
      {generatedOtp && otpTimeLeft > 0 && (
        <div className={styles.otpFloatingAlert}>
          <div className={styles.otpAlertTop}>
            <span className={styles.otpAlertTitle}>
              <FaKey /> Recovery Code
            </span>
            <span className={styles.otpTimerBadge}>
              <FaClock /> {formatTimer(otpTimeLeft)}
            </span>
          </div>
          <p className={styles.otpAlertText}>
            5-digit recovery code for <strong>@{recoveryUsername}</strong>:
          </p>
          <div className={styles.otpCodeDisplay}>{generatedOtp}</div>
        </div>
      )}

      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.topBtn}
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className={styles.authCard}>
        <div className={styles.brand}>
          <div className={styles.logoBox}>
            <FaTasks />
          </div>
          <h1>TaskMaster</h1>
          <p>
            {authMode === "login" &&
              "Welcome back! Sign in to access your workspace"}
            {authMode === "signup" &&
              "Create an account to start managing your tasks"}
            {authMode === "forgot" &&
              "Recover your account password in 3 quick steps"}
          </p>
        </div>

        {authMode !== "forgot" && (
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={
                authMode === "login" ? styles.activeTab : styles.tabBtn
              }
              onClick={() => {
                setAuthMode("login");
                resetMessages();
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={
                authMode === "signup" ? styles.activeTab : styles.tabBtn
              }
              onClick={() => {
                setAuthMode("signup");
                resetMessages();
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}
        {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

        {/* فرم ورود و ثبت‌نام */}
        {authMode !== "forgot" ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            {authMode === "signup" && (
              <div className={styles.field}>
                <label>Full Name</label>
                <div className={styles.inputBox}>
                  <FaUser className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="e.g. Mojtaba Tahmasebi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className={styles.field}>
              <label>Username</label>
              <div className={styles.inputBox}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {authMode === "signup" && (
              <div className={styles.field}>
                <label>Email Address</label>
                <div className={styles.inputBox}>
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label>Password</label>
                {authMode === "login" && (
                  <button
                    type="button"
                    className={styles.forgotLinkBtn}
                    onClick={() => {
                      setAuthMode("forgot");
                      setRecoveryStep(1);
                      setRecoveryUsername(username);
                      resetMessages();
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className={styles.inputBox}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              {authMode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        ) : (
          <div className={styles.form}>
            {recoveryStep === 1 && (
              <form onSubmit={handleSendOtp} className={styles.form}>
                <div className={styles.field}>
                  <label>Enter Your User ID (Username)</label>
                  <div className={styles.inputBox}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="e.g. ali"
                      value={recoveryUsername}
                      onChange={(e) => setRecoveryUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Get 5-Digit Recovery Code
                </button>
              </form>
            )}

            {recoveryStep === 2 && (
              <form onSubmit={handleVerifyOtp} className={styles.form}>
                <div className={styles.field}>
                  <label>
                    5-Digit Verification Code ({formatTimer(otpTimeLeft)})
                  </label>
                  <div className={styles.inputBox}>
                    <FaKey className={styles.inputIcon} />
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="Enter 5-digit code"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Verify Code
                </button>
              </form>
            )}

            {recoveryStep === 3 && (
              <form onSubmit={handleSaveNewPassword} className={styles.form}>
                <div className={styles.field}>
                  <label>New Password for @{recoveryUsername}</label>
                  <div className={styles.inputBox}>
                    <FaLock className={styles.inputIcon} />
                    <input
                      type="password"
                      placeholder="Min 4 characters"
                      value={newRecoveredPwd}
                      onChange={(e) => setNewRecoveredPwd(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Save New Password
                </button>
              </form>
            )}

            <button
              type="button"
              className={styles.backToLoginBtn}
              onClick={() => {
                setAuthMode("login");
                setRecoveryStep(1);
                resetMessages();
              }}
            >
              <FaArrowLeft /> Back to Sign In
            </button>
          </div>
        )}

        {authMode !== "forgot" && (
          <div className={styles.switchFooter}>
            <span>
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                resetMessages();
              }}
            >
              {authMode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;