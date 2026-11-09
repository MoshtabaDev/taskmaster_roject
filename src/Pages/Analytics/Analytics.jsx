import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NewTaskModal from "../../Components/NewTaskModal/NewTaskModal";
import {
  FaChartPie,
  FaBolt,
  FaClock,
  FaCheckCircle,
  FaLayerGroup,
  FaUsers,
} from "react-icons/fa";
import styles from "./Analytics.module.css";

function Analytics() {
  const { tasks, stats, searchQuery } = useContext(TaskContext);
  const { t } = useTranslation();

  const filteredTasks = tasks.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalCount = filteredTasks.length;

  const highCount = filteredTasks.filter((t) => t.priority === "High").length;
  const mediumCount = filteredTasks.filter(
    (t) => t.priority === "Medium",
  ).length;
  const lowCount = filteredTasks.filter((t) => t.priority === "Low").length;

  const highPercent =
    totalCount > 0 ? Math.round((highCount / totalCount) * 100) : 0;
  const mediumPercent =
    totalCount > 0 ? Math.round((mediumCount / totalCount) * 100) : 0;
  const lowPercent =
    totalCount > 0 ? Math.round((lowCount / totalCount) * 100) : 0;

  const doneCount = filteredTasks.filter(
    (t) => t.completed || t.status === "Done",
  ).length;
  const inProgressCount = filteredTasks.filter(
    (t) => !t.completed && t.status === "In Progress",
  ).length;
  const reviewCount = filteredTasks.filter(
    (t) => !t.completed && t.status === "Review",
  ).length;
  const todoCount = filteredTasks.filter(
    (t) => !t.completed && (!t.status || t.status === "To Do"),
  ).length;

  const avgHours =
    stats.totalTasks > 0
      ? (stats.hoursLogged / stats.totalTasks).toFixed(1)
      : "0.0";

  const projectMap = {};
  filteredTasks.forEach((task) => {
    const pName = task.project || "General";
    if (!projectMap[pName]) {
      projectMap[pName] = { name: pName, total: 0, done: 0, hours: 0 };
    }
    projectMap[pName].total += 1;
    if (task.completed) projectMap[pName].done += 1;
    projectMap[pName].hours += Number(task.hours) || 0;
  });
  const projectStats = Object.values(projectMap);

  const memberMap = {};
  filteredTasks.forEach((task) => {
    const list = Array.isArray(task.assignees) ? task.assignees : ["M"];
    list.forEach((member) => {
      if (!memberMap[member]) {
        memberMap[member] = {
          initial: member,
          tasks: 0,
          completed: 0,
          hours: 0,
        };
      }
      memberMap[member].tasks += 1;
      if (task.completed) memberMap[member].completed += 1;
      memberMap[member].hours += Number(task.hours) || 0;
    });
  });
  const memberStats = Object.values(memberMap);

  const circumference = 440;
  const doneStroke =
    totalCount > 0 ? (doneCount / totalCount) * circumference : 0;

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header />

        <main className={styles.content}>
          <div className={styles.pageTitle}>
            <h1>{t("analytics.title")}</h1>
            <p>{t("analytics.subtitle")}</p>
          </div>

          <section className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <span>{t("analytics.completionRate")}</span>
                <div className={styles.greenIconBox}>
                  <FaCheckCircle />
                </div>
              </div>
              <h2>{stats.completionRate}%</h2>
              <p className={styles.kpiSub}>
                {stats.completedTasks} {t("analytics.of")} {stats.totalTasks}{" "}
                {t("analytics.tasksFinished")}
              </p>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <span>{t("analytics.avgHours")}</span>
                <div className={styles.blueIconBox}>
                  <FaClock />
                </div>
              </div>
              <h2>{avgHours}h</h2>
              <p className={styles.kpiSub}>
                {t("analytics.acrossProjects")} ({stats.totalProjects})
              </p>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <span>{t("analytics.highPriority")}</span>
                <div className={styles.redIconBox}>
                  <FaBolt />
                </div>
              </div>
              <h2>{highCount}</h2>
              <p className={styles.kpiSub}>
                {highPercent}% {t("analytics.ofTotalFiltered")}
              </p>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <span>{t("analytics.totalLoggedTime")}</span>
                <div className={styles.purpleIconBox}>
                  <FaChartPie />
                </div>
              </div>
              <h2>{stats.hoursLogged}h</h2>
              <p className={styles.kpiSub}>{t("analytics.totalTrackedSub")}</p>
            </div>
          </section>

          <section className={styles.middleGrid}>
            <div className={styles.panelCard}>
              <div className={styles.cardHeader}>
                <h3>{t("analytics.statusDist")}</h3>
                <span className={styles.badge}>
                  {totalCount} {t("analytics.tasksBadge")}
                </span>
              </div>

              <div className={styles.donutContainer}>
                <div className={styles.svgWrapper}>
                  <svg viewBox="0 0 180 180" className={styles.donutSvg}>
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="transparent"
                      stroke="var(--bg-input)"
                      strokeWidth="18"
                    />
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="18"
                      strokeDasharray={`${doneStroke} ${circumference}`}
                      strokeLinecap="round"
                      transform="rotate(-90 90 90)"
                    />
                    <text
                      x="90"
                      y="85"
                      textAnchor="middle"
                      fill="var(--dark-titr-color)"
                      fontSize="24"
                      fontWeight="bold"
                    >
                      {stats.completionRate}%
                    </text>
                    <text
                      x="90"
                      y="106"
                      textAnchor="middle"
                      fill="var(--dark-text-color)"
                      fontSize="11"
                    >
                      {t("analytics.completedLabel")}
                    </text>
                  </svg>
                </div>

                <div className={styles.legendList}>
                  <div className={styles.legendItem}>
                    <div className={styles.legendLeft}>
                      <span className={styles.greenDot}></span>
                      <span>{t("status.Done")}</span>
                    </div>
                    <strong>{doneCount}</strong>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendLeft}>
                      <span className={styles.blueDot}></span>
                      <span>{t("status.In Progress")}</span>
                    </div>
                    <strong>{inProgressCount}</strong>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendLeft}>
                      <span className={styles.amberDot}></span>
                      <span>{t("status.Review")}</span>
                    </div>
                    <strong>{reviewCount}</strong>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendLeft}>
                      <span className={styles.purpleDot}></span>
                      <span>{t("status.To Do")}</span>
                    </div>
                    <strong>{todoCount}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.panelCard}>
              <div className={styles.cardHeader}>
                <h3>{t("analytics.tasksByPriority")}</h3>
                <span className={styles.badge}>{t("analytics.breakdown")}</span>
              </div>

              <div className={styles.priorityBars}>
                <div className={styles.barGroup}>
                  <div className={styles.barLabel}>
                    <span>{t("analytics.highPriorityLabel")}</span>
                    <span>
                      {highCount} {t("analytics.tasksCount")} ({highPercent}%)
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.highFill}
                      style={{ width: `${highPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className={styles.barGroup}>
                  <div className={styles.barLabel}>
                    <span>{t("analytics.mediumPriorityLabel")}</span>
                    <span>
                      {mediumCount} {t("analytics.tasksCount")} ({mediumPercent}
                      %)
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.mediumFill}
                      style={{ width: `${mediumPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className={styles.barGroup}>
                  <div className={styles.barLabel}>
                    <span>{t("analytics.lowPriorityLabel")}</span>
                    <span>
                      {lowCount} {t("analytics.tasksCount")} ({lowPercent}%)
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.lowFill}
                      style={{ width: `${lowPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.bottomGrid}>
            <div className={styles.panelCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleWithIcon}>
                  <FaLayerGroup className={styles.headerIcon} />
                  <h3>{t("analytics.projectHoursTitle")}</h3>
                </div>
              </div>

              <div className={styles.projectRows}>
                {projectStats.map((proj, idx) => {
                  const rate =
                    proj.total > 0
                      ? Math.round((proj.done / proj.total) * 100)
                      : 0;
                  return (
                    <div key={idx} className={styles.projectRowItem}>
                      <div className={styles.projectRowTop}>
                        <strong>{proj.name}</strong>
                        <span>
                          {proj.hours.toFixed(1)} {t("analytics.hrs")} • {rate}%
                        </span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.projectFill}
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.panelCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleWithIcon}>
                  <FaUsers className={styles.headerIcon} />
                  <h3>{t("analytics.teamWorkload")}</h3>
                </div>
              </div>

              <div className={styles.teamList}>
                {memberStats.map((member, idx) => (
                  <div key={idx} className={styles.memberRow}>
                    <div className={styles.memberInfo}>
                      <div className={styles.avatar}>{member.initial}</div>
                      <div>
                        <h4>
                          {t("analytics.member")} ({member.initial})
                        </h4>
                        <span>
                          {member.completed} / {member.tasks}{" "}
                          {t("analytics.tasksCompleted")}
                        </span>
                      </div>
                    </div>
                    <div className={styles.memberHours}>
                      {member.hours.toFixed(1)} {t("analytics.hrs")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      <NewTaskModal />
    </div>
  );
}

export default Analytics;
