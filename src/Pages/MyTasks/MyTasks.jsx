import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NewTaskModal from "../../Components/NewTaskModal/NewTaskModal";
import {
  FaCheckCircle,
  FaRegCircle,
  FaTrashAlt,
  FaTasks,
} from "react-icons/fa";
import styles from "./MyTasks.module.css";

function MyTasks() {
  const { tasks, searchQuery, toggleTaskCompletion, removeTask } =
    useContext(TaskContext);

  const { t } = useTranslation();
  const [filterTab, setFilterTab] = useState("all");

  const filteredTasks = tasks.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "active") return !item.completed;
    if (filterTab === "completed") return item.completed;
    if (filterTab === "high") return item.priority === "High";

    return true;
  });

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header />

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>
              <h1>{t("myTasksPage.title")}</h1>
              <p>{t("myTasksPage.subtitle")}</p>
            </div>

            <div className={styles.filterTabs}>
              <button
                type="button"
                className={
                  filterTab === "all" ? styles.activeTab : styles.tabBtn
                }
                onClick={() => setFilterTab("all")}
              >
                {t("myTasksPage.all")} ({tasks.length})
              </button>
              <button
                type="button"
                className={
                  filterTab === "active" ? styles.activeTab : styles.tabBtn
                }
                onClick={() => setFilterTab("active")}
              >
                {t("myTasksPage.active")}
              </button>
              <button
                type="button"
                className={
                  filterTab === "completed" ? styles.activeTab : styles.tabBtn
                }
                onClick={() => setFilterTab("completed")}
              >
                {t("myTasksPage.completed")}
              </button>
              <button
                type="button"
                className={
                  filterTab === "high" ? styles.activeTab : styles.tabBtn
                }
                onClick={() => setFilterTab("high")}
              >
                {t("myTasksPage.highPriority")}
              </button>
            </div>
          </div>

          <section className={styles.tasksCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerLeft}>
                <FaTasks className={styles.taskIcon} />
                <h3>{t("myTasksPage.taskList")}</h3>
              </div>
              <span className={styles.countBadge}>
                {t("myTasksPage.showing")} {filteredTasks.length}{" "}
                {t("myTasksPage.tasksUnit")}
              </span>
            </div>

            <div className={styles.tableWrapper}>
              {filteredTasks.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>{t("myTasksPage.emptyState")}</p>
                </div>
              ) : (
                <table className={styles.tasksTable}>
                  <thead>
                    <tr>
                      <th>{t("table.taskName")}</th>
                      <th>{t("table.project")}</th>
                      <th>{t("table.priority")}</th>
                      <th>{t("table.dueDate")}</th>
                      <th>{t("table.hours")}</th>
                      <th>{t("table.assignees")}</th>
                      <th>{t("table.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={task.completed ? styles.completedRow : ""}
                      >
                        <td className={styles.taskNameCell}>
                          {task.completed ? (
                            <FaCheckCircle className={styles.checkedIcon} />
                          ) : (
                            <FaRegCircle className={styles.uncheckedIcon} />
                          )}
                          <span>{task.title}</span>
                        </td>
                        <td className={styles.projectCell}>{task.project}</td>
                        <td>
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
                        </td>
                        <td className={styles.dateCell}>
                          {t(`dates.${task.dueDate}`, {
                            defaultValue: task.dueDate,
                          })}
                        </td>
                        <td className={styles.dateCell}>
                          {task.hours}
                          {t("table.unitHour")}
                        </td>
                        <td>
                          <div className={styles.avatarsGroup}>
                            {task.assignees.map((initial, index) => (
                              <span key={index} className={styles.miniAvatar}>
                                {initial}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTask(task.id);
                          }}
                        >
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            title={t("myTasksPage.deleteTitle")}
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>

      <NewTaskModal />
    </div>
  );
}

export default MyTasks;