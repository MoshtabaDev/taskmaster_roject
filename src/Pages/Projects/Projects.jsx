import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../Context/TaskContext";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NewTaskModal from "../../Components/NewTaskModal/NewTaskModal";
import {
  FaFolder,
  FaPlus,
  FaEllipsisV,
  FaClock,
  FaCheckDouble,
  FaTrashAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import styles from "./Projects.module.css";

function Projects() {
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    setIsNewTaskModalOpen,
    completeProjectTasks,
    deleteProjectTasks,
  } = useContext(TaskContext);

  const { t } = useTranslation();
  const [openMenuProject, setOpenMenuProject] = useState(null);
  const navigate = useNavigate();

  const projectsMap = {};
  tasks.forEach((task) => {
    const projName = task.project || "General";
    if (!projectsMap[projName]) {
      projectsMap[projName] = {
        name: projName,
        totalTasks: 0,
        completedTasks: 0,
        hours: 0,
        members: new Set(),
      };
    }
    projectsMap[projName].totalTasks += 1;
    if (task.completed) {
      projectsMap[projName].completedTasks += 1;
    }
    projectsMap[projName].hours += Number(task.hours) || 2;
    if (Array.isArray(task.assignees)) {
      task.assignees.forEach((m) => projectsMap[projName].members.add(m));
    }
  });

  const projectsList = Object.values(projectsMap).map((proj) => {
    const progress =
      proj.totalTasks > 0
        ? Math.round((proj.completedTasks / proj.totalTasks) * 100)
        : 0;
    return {
      ...proj,
      progress,
      members: Array.from(proj.members),
    };
  });

  const filteredProjects = projectsList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = (projectName) => {
    setOpenMenuProject((prev) => (prev === projectName ? null : projectName));
  };

  const handleViewProjectTasks = (projectName) => {
    setSearchQuery(projectName);
    setOpenMenuProject(null);
    navigate("/my-tasks");
  };

  return (
    <div
      className={styles.container}
      onClick={() => setOpenMenuProject(null)}
    >
      <Sidebar />

      <div className={styles.mainArea}>
        <Header />

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>
              <h1>{t("projectsPage.title")}</h1>
              <p>{t("projectsPage.subtitle")}</p>
            </div>

            <button
              type="button"
              className={styles.addProjectBtn}
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              <FaPlus /> {t("projectsPage.newProjectBtn")}
            </button>
          </div>

          <div className={styles.projectsGrid}>
            {filteredProjects.length === 0 ? (
              <div className={styles.emptyState}>
                <p>
                  {t("projectsPage.noProjectsMatching")} "{searchQuery}".
                </p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <div key={index} className={styles.projectCard}>
                  <div className={styles.cardHeaderTop}>
                    <div className={styles.projectIconBox}>
                      <FaFolder />
                    </div>

                    <div
                      className={styles.menuWrapper}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className={styles.optionsBtn}
                        onClick={() => toggleDropdown(project.name)}
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenuProject === project.name && (
                        <div className={styles.dropdownMenu}>
                          <button
                            type="button"
                            className={styles.dropdownItem}
                            onClick={() => {
                              setOpenMenuProject(null);
                              setIsNewTaskModalOpen(true);
                            }}
                          >
                            <FaPlus /> {t("projectsPage.addTask")}
                          </button>
                          <button
                            type="button"
                            className={styles.dropdownItem}
                            onClick={() => handleViewProjectTasks(project.name)}
                          >
                            <FaExternalLinkAlt /> {t("projectsPage.viewTasks")}
                          </button>
                          <button
                            type="button"
                            className={styles.dropdownItem}
                            onClick={() => {
                              completeProjectTasks(project.name);
                              setOpenMenuProject(null);
                            }}
                          >
                            <FaCheckDouble /> {t("projectsPage.markAllDone")}
                          </button>
                          <button
                            type="button"
                            className={styles.deleteItem}
                            onClick={() => {
                              deleteProjectTasks(project.name);
                              setOpenMenuProject(null);
                            }}
                          >
                            <FaTrashAlt /> {t("projectsPage.deleteProject")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.projectInfo}>
                    <h2>{project.name}</h2>
                    <p>
                      {project.completedTasks} {t("projectsPage.of")}{" "}
                      {project.totalTasks} {t("projectsPage.tasksCompleted")}
                    </p>
                  </div>

                  <div className={styles.progressSection}>
                    <div className={styles.progressMeta}>
                      <span>{t("projectsPage.progress")}</span>
                      <span className={styles.progressPercent}>
                        {project.progress}%
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.footerItem}>
                      <FaClock className={styles.footerIcon} />
                      <span>
                        {project.hours} {t("projectsPage.hrs")}
                      </span>
                    </div>

                    <div className={styles.avatarsGroup}>
                      {project.members.map((member, mIndex) => (
                        <span key={mIndex} className={styles.miniAvatar}>
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <NewTaskModal />
    </div>
  );
}

export default Projects;