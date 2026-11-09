import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NewTaskModal from "../../Components/NewTaskModal/NewTaskModal";
import { FaPlus, FaEllipsisH, FaClock } from "react-icons/fa";
import styles from "./Kanban.module.css";

const COLUMNS = [
  { id: "To Do", color: "purple" },
  { id: "In Progress", color: "blue" },
  { id: "Review", color: "amber" },
  { id: "Done", color: "green" },
];

function Kanban() {
  const { tasks, searchQuery, setIsNewTaskModalOpen, advanceTaskStatus } =
    useContext(TaskContext);

  const { t } = useTranslation();

  const filteredTasks = tasks.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header />

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>
              <h1>{t("kanban.title")}</h1>
              <p>{t("kanban.subtitle")}</p>
            </div>

            <button
              type="button"
              className={styles.addTaskBtn}
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              <FaPlus /> {t("kanban.newTaskBtn")}
            </button>
          </div>

          <div className={styles.boardGrid}>
            {COLUMNS.map((column) => {
              const columnTasks = filteredTasks.filter(
                (t) => (t.status || "To Do") === column.id,
              );

              return (
                <div
                  key={column.id}
                  data-tour={`col-${column.id}`}
                  className={styles.column}
                >
                  <div className={styles.columnHeader}>
                    <div className={styles.columnTitleArea}>
                      <span
                        className={`${styles.dot} ${styles[column.color]}`}
                      ></span>
                      <h3>{t(`status.${column.id}`)}</h3>
                      <span className={styles.countBadge}>
                        {columnTasks.length}
                      </span>
                    </div>
                    <button type="button" className={styles.columnMenuBtn}>
                      <FaEllipsisH />
                    </button>
                  </div>

                  <div className={styles.columnCardsList}>
                    {columnTasks.length === 0 ? (
                      <div className={styles.emptyColumn}>
                        <p>{t("kanban.noTasks")}</p>
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <div
                          key={task.id}
                          className={styles.taskCard}
                          onClick={() => advanceTaskStatus(task.id)}
                          title={t("kanban.clickHint")}
                        >
                          <div className={styles.cardTop}>
                            <span
                              className={
                                task.priority === "High"
                                  ? styles.highBadge
                                  : task.priority === "Medium"
                                    ? styles.mediumBadge
                                    : styles.lowBadge
                              }
                            >
                              {t(`priority.${task.priority}`)}
                            </span>
                            <span className={styles.projectTag}>
                              {task.project}
                            </span>
                          </div>

                          <h4
                            className={
                              task.status === "Done"
                                ? styles.completedTitle
                                : ""
                            }
                          >
                            {task.title}
                          </h4>

                          <div className={styles.cardFooter}>
                            <div className={styles.footerInfo}>
                              <FaClock className={styles.clockIcon} />
                              <span>
                                {task.dueDate} ({task.hours}h)
                              </span>
                            </div>

                            <div className={styles.avatarsGroup}>
                              {task.assignees.map((initial, index) => (
                                <span key={index} className={styles.miniAvatar}>
                                  {initial}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <NewTaskModal />
    </div>
  );
}

export default Kanban;
