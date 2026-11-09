import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NewTaskModal from "../../Components/NewTaskModal/NewTaskModal";
import {
  FaFolderOpen,
  FaCheckCircle,
  FaTrophy,
  FaClock,
  FaRegCircle,
  FaTrashAlt,
} from "react-icons/fa";
import styles from "./Overview.module.css";

function Overview() {
  const {
    tasks,
    activities,
    stats,
    searchQuery,
    setSearchQuery,
    toggleTaskCompletion,
    removeTask,
  } = useContext(TaskContext);

  const { t } = useTranslation();

  const filteredTasks = tasks.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.priority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActivities = activities.filter((act) =>
    act.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeY = Math.round(190 - (stats.completionRate / 100) * 145);
  const velocityY = Math.min(185, activeY + 35);

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header />

        <main className={styles.content}>
          <div className={styles.pageTitle}>
            <h1>{t("overview.title")}</h1>
            <p>{t("overview.date")}</p>
          </div>

          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.cardTop}>
                <span>{t("overview.totalProjects")}</span>
                <div className={styles.blueIconBox}>
                  <FaFolderOpen />
                </div>
              </div>
              <div className={styles.cardBottom}>
                <h2>{stats.totalProjects}</h2>
                <span className={styles.greenBadge}>
                  {stats.totalTasks} {t("overview.totalTasks")}
                </span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.cardTop}>
                <span>{t("overview.activeTasks")}</span>
                <div className={styles.purpleIconBox}>
                  <FaCheckCircle />
                </div>
              </div>
              <div className={styles.cardBottomColumn}>
                <div className={styles.activeRow}>
                  <h2>{stats.activeTasks}</h2>
                  <span className={styles.rateText}>
                    {stats.completionRate}% {t("overview.done")}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.cardTop}>
                <span>{t("overview.completedTasks")}</span>
                <div className={styles.amberIconBox}>
                  <FaTrophy />
                </div>
              </div>
              <div className={styles.cardBottom}>
                <h2>{stats.completedTasks}</h2>
                <span className={styles.greenBadge}>
                  +{stats.completedTasks} {t("overview.completed")}
                </span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.cardTop}>
                <span>{t("overview.hoursLogged")}</span>
                <div className={styles.indigoIconBox}>
                  <FaClock />
                </div>
              </div>
              <div className={styles.cardBottom}>
                <h2>
                  {stats.hoursLogged} {t("overview.hrs")}
                </h2>
                <svg className={styles.miniWave} viewBox="0 0 80 25">
                  <path
                    d="M 0 20 Q 15 5, 30 15 T 60 10 T 80 5"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>
          </section>

          <section className={styles.middleGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>{t("overview.projectProgress")}</h3>
                <span className={styles.chartTag}>
                  {t("overview.completionRate")}: {stats.completionRate}%
                </span>
              </div>

              <div className={styles.chartWrapper}>
                <svg viewBox="0 0 600 220" className={styles.svgChart}>
                  <defs>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="40" y1="30" x2="580" y2="30" stroke="var(--border-color)" strokeDasharray="3" />
                  <line x1="40" y1="75" x2="580" y2="75" stroke="var(--border-color)" strokeDasharray="3" />
                  <line x1="40" y1="120" x2="580" y2="120" stroke="var(--border-color)" strokeDasharray="3" />
                  <line x1="40" y1="165" x2="580" y2="165" stroke="var(--border-color)" strokeDasharray="3" />

                  <text x="10" y="34" fill="#94a3b8" fontSize="11">100</text>
                  <text x="15" y="79" fill="#94a3b8" fontSize="11">75</text>
                  <text x="15" y="124" fill="#94a3b8" fontSize="11">50</text>
                  <text x="15" y="169" fill="#94a3b8" fontSize="11">25</text>
                  <text x="20" y="198" fill="#94a3b8" fontSize="11">0</text>

                  <path
                    d={`M40,190 C90,130 130,135 180,150 C230,165 260,${activeY - 15} 310,${activeY} C360,${activeY + 20} 400,70 450,75 C500,80 540,55 580,${Math.max(35, activeY - 25)} L580,195 L40,195 Z`}
                    fill="url(#cyanGrad)"
                  />
                  <path
                    d={`M40,190 C90,130 130,135 180,150 C230,165 260,${activeY - 15} 310,${activeY} C360,${activeY + 20} 400,70 450,75 C500,80 540,55 580,${Math.max(35, activeY - 25)}`}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                  />

                  <path
                    d={`M40,195 C90,155 130,165 180,175 C230,185 260,130 310,${velocityY} C360,155 400,115 450,115 C500,115 540,95 580,90 L580,195 L40,195 Z`}
                    fill="url(#purpleGrad)"
                  />
                  <path
                    d={`M40,195 C90,155 130,165 180,175 C230,185 260,130 310,${velocityY} C360,155 400,115 450,115 C500,115 540,95 580,90`}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                  />

                  <line x1="310" y1="30" x2="310" y2="195" stroke="#94a3b8" strokeDasharray="4" />
                  <circle cx="310" cy={activeY} r="5" fill="#0b1120" stroke="#22d3ee" strokeWidth="3" />
                  <circle cx="310" cy={velocityY} r="5" fill="#0b1120" stroke="#a855f7" strokeWidth="3" />

                  <rect x="185" y="45" width="115" height="58" rx="6" fill="#0f172a" stroke="#23304a" />
                  <text x="242" y="63" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                    {t("overview.liveProgress")}
                  </text>
                  <text x="242" y="79" textAnchor="middle" fill="#22d3ee" fontSize="10">
                    ● {t("overview.completionLabel")}: {stats.completionRate}%
                  </text>
                  <text x="242" y="94" textAnchor="middle" fill="#a855f7" fontSize="10">
                    ● {t("overview.doneLabel")}: {stats.completedTasks}/{stats.totalTasks}
                  </text>

                  <text x="40" y="214" fill="#94a3b8" fontSize="11">{t("overview.mon")}</text>
                  <text x="115" y="214" fill="#94a3b8" fontSize="11">{t("overview.sun")}</text>
                  <text x="190" y="214" fill="#94a3b8" fontSize="11">{t("overview.wed")}</text>
                  <text x="265" y="214" fill="#94a3b8" fontSize="11">{t("overview.tue")}</text>
                  <text x="335" y="214" fill="#94a3b8" fontSize="11">{t("overview.week")}</text>
                  <text x="415" y="214" fill="#94a3b8" fontSize="11">{t("overview.month")}</text>
                  <text x="500" y="214" fill="#94a3b8" fontSize="11">{t("overview.quarter")}</text>
                </svg>
              </div>
            </div>

            <div className={styles.activityCard}>
              <h3>{t("overview.recentActivity")}</h3>
              <div className={styles.timeline}>
                {filteredActivities.length === 0 ? (
                  <p className={styles.emptyActivity}>
                    {t("overview.noRecentActivity")} "{searchQuery}"
                  </p>
                ) : (
                  filteredActivities.slice(0, 5).map((act) => (
                    <div key={act.id} className={styles.activityItem}>
                      <span
                        className={
                          act.color === "green"
                            ? styles.greenDot
                            : act.color === "amber"
                            ? styles.amberDot
                            : styles.purpleDot
                        }
                      ></span>
                      <div className={styles.activityText}>
                        <p>{act.text}</p>
                        <span>
                          {t(`times.${act.time}`, { defaultValue: act.time })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className={styles.tableCard} data-tour="overview-tasks">
            <div className={styles.tableHeader}>
              <h3>{t("overview.urgentTasks")}</h3>
              {searchQuery && (
                <button
                  type="button"
                  className={styles.resetFilterBtn}
                  onClick={() => setSearchQuery("")}
                >
                  {t("overview.clearFilter")} ({filteredTasks.length})
                </button>
              )}
            </div>

            <div className={styles.tableWrapper}>
              {filteredTasks.length === 0 ? (
                <div className={styles.emptyTable}>
                  <p>
                    {t("overview.noTasksMatching")} "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className={styles.clearSearchBtn}
                  >
                    {t("overview.showAll")}
                  </button>
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

export default Overview;