import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import {
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaTimes,
  FaHandPointDown,
  FaMagic,
} from "react-icons/fa";
import styles from "./OnboardingTour.module.css";

const TOUR_STEPS = [
  {
    id: "step-new-task",
    route: "/",
    selector: '[data-tour="new-task-btn"]',
    titleEn: "1. Create Your First Task",
    titleFa: "۱. ساخت و ثبت تسک جدید",
    descEn:
      'Click the "+ New Task" button here to open the task creation modal. Enter a title, project name, priority, and hours to register your task.',
    descFa:
      "روی دکمه «+ تسک جدید» کلیک کنید تا پنجره ثبت تسک باز شود. عنوان، نام پروژه، اولویت و ساعت تخمینی را وارد و تسک را ثبت کنید.",
  },
  {
    id: "step-overview-check",
    route: "/",
    selector: '[data-tour="overview-tasks"]',
    titleEn: "2. Quick Check in Overview",
    titleFa: "۲. تیک زدن تسک در نمای کلی",
    descEn:
      "Your newly created task appears in the list. When you click the completion checkmark in Overview, it automatically moves to the Review stage!",
    descFa:
      "تسک‌های شما در این جدول نمایش داده می‌شوند. هر زمان در صفحه نمای کلی تیک انجام تسک را بزنید، تسک مستقیماً به مرحله Review منتقل می‌شود!",
  },
  {
    id: "step-kanban-nav",
    route: "/kanban",
    selector: '[data-tour="nav-kanban"]',
    titleEn: "3. Go to Kanban Board",
    titleFa: "۳. ورود به بورد کانبان",
    descEn:
      "From the sidebar menu, we navigate to the Kanban Board where you can visually track and advance every task step by step.",
    descFa:
      "از منوی کناری وارد بخش «بورد کانبان» می‌شویم؛ جایی که می‌توانید وضعیت تسک‌ها را مرحله‌به‌مرحله مدیریت کنید.",
  },
  {
    id: "step-kanban-todo",
    route: "/kanban",
    selector: '[data-tour="col-To Do"]',
    titleEn: "4. Stage 1: To Do",
    titleFa: "۴. مرحله اول: ستون To Do",
    descEn:
      "Every new task you create starts right here in the 'To Do' column. Click once on any task card here to move it to 'In Progress'.",
    descFa:
      "هر تسک جدیدی که می‌سازید ابتدا در ستون «To Do» قرار می‌گیرد. با یک بار کلیک روی کارت تسک، به ستون «In Progress» منتقل می‌شود.",
  },
  {
    id: "step-kanban-progress",
    route: "/kanban",
    selector: '[data-tour="col-In Progress"]',
    titleEn: "5. Stage 2: In Progress",
    titleFa: "۵. مرحله دوم: ستون In Progress",
    descEn:
      "Tasks currently being worked on stay here. Clicking a task card in this column advances it to the 'Review' column.",
    descFa:
      "تسک‌های در حال انجام در این ستون قرار دارند. با کلیک روی کارت تسک در این بخش، تسک به ستون «Review» می‌رود.",
  },
  {
    id: "step-kanban-review",
    route: "/kanban",
    selector: '[data-tour="col-Review"]',
    titleEn: "6. Stage 3: Review",
    titleFa: "۶. مرحله سوم: ستون Review",
    descEn:
      "Tasks checked in Overview or advanced from In Progress wait here for final verification. Click the card one more time to finish it!",
    descFa:
      "تسک‌هایی که در صفحه اول تیک خورده‌اند یا از مرحله قبل آمده‌اند برای بررسی نهایی اینجا قرار می‌گیرند. با یک کلیک دیگر، تسک نهایی می‌شود!",
  },
  {
    id: "step-kanban-done",
    route: "/kanban",
    selector: '[data-tour="col-Done"]',
    titleEn: "7. Final Stage: Done! 🎉",
    titleFa: "۷. مرحله آخر: ستون Done! 🎉",
    descEn:
      "Congratulations! Your task is now in 'Done', crossed out as completed, and your Analytics & Completion Rate are updated automatically.",
    descFa:
      "تبریک! تسک شما اکنون در ستون «Done» قرار گرفته، به عنوان تکمیل‌شده خط خورده و تمام نمودارها و درصد پیشرفت شما بروزرسانی شده‌اند.",
  },
];

function OnboardingTour() {
  const { currentUser } = useContext(TaskContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const storageKey = currentUser?.username
    ? `taskmaster-tour-done-${currentUser.username.toLowerCase()}`
    : null;
  useEffect(() => {
    if (!currentUser || !storageKey) {
      setIsOpen(false);
      return;
    }

    const hasSeenTour = localStorage.getItem(storageKey);
    if (!hasSeenTour) {
      setStepIndex(0);
      setIsOpen(true);
    }
  }, [currentUser, storageKey]);

  const currentStep = TOUR_STEPS[stepIndex];

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    if (location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }

    const updateRect = () => {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setTargetRect(null);
      }
    };

    const timer = setTimeout(updateRect, 220);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [isOpen, stepIndex, location.pathname, currentStep, navigate]);

  if (!isOpen || !currentUser) return null;

  const finishTour = () => {
    if (storageKey) {
      localStorage.setItem(storageKey, "true");
    }
    setIsOpen(false);
  };

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      finishTour();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const getTooltipPosition = () => {
    if (!targetRect) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const tooltipW = Math.min(350, viewportW - 32);
    const tooltipH = 230;

    let top = targetRect.top + targetRect.height + 18;
    if (top + tooltipH > viewportH - 16) {
      top = Math.max(16, targetRect.top - tooltipH - 18);
    }

    let left = targetRect.left + targetRect.width / 2 - tooltipW / 2;
    left = Math.max(16, Math.min(left, viewportW - tooltipW - 16));

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  return (
    <div className={styles.tourOverlay}>
      {targetRect && (
        <div
          className={styles.spotlightBox}
          style={{
            top: `${targetRect.top - 6}px`,
            left: `${targetRect.left - 6}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        >
          <span className={styles.pointerBadge}>
            <FaHandPointDown />
          </span>
        </div>
      )}

      {/* پنجره توضیحات مرحله‌به‌مرحله */}
      <div className={styles.tooltipCard} style={getTooltipPosition()}>
        <div className={styles.cardTop}>
          <div className={styles.badge}>
            <FaMagic />
            <span>
              {isFa
                ? `راهنمای شروع (${stepIndex + 1} از ${TOUR_STEPS.length})`
                : `Quick Guide (${stepIndex + 1} / ${TOUR_STEPS.length})`}
            </span>
          </div>

          <button
            type="button"
            className={styles.skipIconBtn}
            onClick={finishTour}
            title={isFa ? "بستن راهنما" : "Skip Tour"}
          >
            <FaTimes />
          </button>
        </div>

        <h3 className={styles.stepTitle}>
          {isFa ? currentStep.titleFa : currentStep.titleEn}
        </h3>

        <p className={styles.stepDesc}>
          {isFa ? currentStep.descFa : currentStep.descEn}
        </p>

        <div className={styles.dotsRow}>
          {TOUR_STEPS.map((st, idx) => (
            <span
              key={st.id}
              className={
                idx === stepIndex ? styles.activeDot : styles.inactiveDot
              }
            ></span>
          ))}
        </div>

        <div className={styles.cardFooter}>
          <button
            type="button"
            className={styles.skipTextBtn}
            onClick={finishTour}
          >
            {isFa ? "رد کردن راهنما" : "Skip"}
          </button>

          <div className={styles.navBtns}>
            {stepIndex > 0 && (
              <button
                type="button"
                className={styles.prevBtn}
                onClick={handlePrev}
              >
                {!isFa && <FaArrowLeft />}
                {isFa ? "قبلی" : "Back"}
              </button>
            )}

            <button
              type="button"
              className={styles.nextBtn}
              onClick={handleNext}
            >
              {stepIndex === TOUR_STEPS.length - 1 ? (
                <>
                  <FaCheck /> {isFa ? "شروع کار!" : "Finish"}
                </>
              ) : (
                <>
                  {isFa ? "بعدی" : "Next"} {!isFa && <FaArrowRight />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingTour;
