import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import { FaTimes } from "react-icons/fa";
import styles from "./NewTaskModal.module.css";

function NewTaskModal() {
  const { isNewTaskModalOpen, setIsNewTaskModalOpen, addTask, currentUser } =
    useContext(TaskContext);
  const { t } = useTranslation();

  const defaultInitial = (
    currentUser?.fullName?.[0] ||
    currentUser?.username?.[0] ||
    "M"
  ).toUpperCase();

  const [title, setTitle] = useState("");
  const [project, setProject] = useState("TaskMaster Dashboard");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("Today");
  const [hours, setHours] = useState(4);
  const [assigneesInput, setAssigneesInput] = useState(defaultInitial);

  if (!isNewTaskModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedAssignees = assigneesInput
      .split(",")
      .map((item) => item.trim().toUpperCase()[0])
      .filter(Boolean);

    addTask({
      title,
      project,
      priority,
      dueDate,
      hours: Number(hours) || 2,
      assignees:
        parsedAssignees.length > 0 ? parsedAssignees : [defaultInitial],
    });

    setTitle("");
    setIsNewTaskModalOpen(false);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={() => setIsNewTaskModalOpen(false)}
    >
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{t("modal.createTitle")}</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsNewTaskModalOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>{t("modal.taskTitle")}</label>
            <input
              type="text"
              placeholder={t("modal.taskPlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>{t("modal.projectName")}</label>
              <input
                type="text"
                placeholder={t("modal.projectPlaceholder")}
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>{t("modal.priority")}</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">{t("priority.High")}</option>
                <option value="Medium">{t("priority.Medium")}</option>
                <option value="Low">{t("priority.Low")}</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>{t("modal.dueDate")}</label>
              <input
                type="text"
                placeholder={t("modal.dueDatePlaceholder")}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>{t("modal.estimatedHours")}</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>{t("modal.assignees")}</label>
            <input
              type="text"
              placeholder="M, S, A"
              value={assigneesInput}
              onChange={(e) => setAssigneesInput(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setIsNewTaskModalOpen(false)}
            >
              {t("modal.cancel")}
            </button>
            <button type="submit" className={styles.submitBtn}>
              {t("modal.createBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTaskModal;
