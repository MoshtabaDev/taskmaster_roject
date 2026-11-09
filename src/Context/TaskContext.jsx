import { createContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const TaskContext = createContext();

const THEME_STORAGE_KEY = "taskmaster-theme-v2";
const USERS_STORAGE_KEY = "taskmaster-users-v2";
const CURRENT_USER_STORAGE_KEY = "taskmaster-current-user-v2";

const getTasksKey = (username) =>
  `taskmaster-tasks-${(username || "guest").toLowerCase()}`;

const getActivitiesKey = (username) =>
  `taskmaster-activities-${(username || "guest").toLowerCase()}`;

const createDefaultTasks = (userInitial = "M") => [
  {
    id: "1",
    title: "Fix auth token expiration",
    project: "TaskMaster Dashboard",
    priority: "High",
    dueDate: "Today",
    hours: 6.5,
    status: "In Progress",
    completed: false,
    assignees: [userInitial, "S"],
  },
  {
    id: "2",
    title: "Design overview page",
    project: "TaskMaster Dashboard",
    priority: "Medium",
    dueDate: "Oct 31, 2026",
    hours: 8,
    status: "To Do",
    completed: false,
    assignees: [userInitial, "A"],
  },
  {
    id: "3",
    title: "Implement localStorage state sync",
    project: "E-Commerce",
    priority: "High",
    dueDate: "Nov 2, 2026",
    hours: 5.5,
    status: "Review",
    completed: true,
    assignees: [userInitial],
  },
];

const createDefaultActivities = (displayName = "You") => [
  {
    id: "act-1",
    text: `Workspace initialized for ${displayName}`,
    time: "Just now",
    color: "green",
  },
  {
    id: "act-2",
    text: 'Task "Fix auth token expiration" moved to In Progress',
    time: "10m ago",
    color: "purple",
  },
];

function TaskProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return savedTheme === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  const activeUsername = currentUser?.username || "guest";
  const userInitial = (
    currentUser?.fullName?.[0] ||
    currentUser?.username?.[0] ||
    "M"
  ).toUpperCase();

  const loadUserTasks = (username, initial) => {
    try {
      const savedTasks = localStorage.getItem(getTasksKey(username));
      if (!savedTasks) return createDefaultTasks(initial);

      const parsedTasks = JSON.parse(savedTasks);
      if (!Array.isArray(parsedTasks)) {
        return createDefaultTasks(initial);
      }

      return parsedTasks
        .filter((item) => item && item.id != null)
        .map((item) => ({
          ...item,
          status: item.status || "To Do",
          hours: Number(item.hours) || 2,
          assignees: Array.isArray(item.assignees) ? item.assignees : [initial],
        }));
    } catch {
      return createDefaultTasks(initial);
    }
  };

  const loadUserActivities = (username, displayName) => {
    try {
      const savedActivities = localStorage.getItem(getActivitiesKey(username));
      if (!savedActivities) return createDefaultActivities(displayName);

      const parsed = JSON.parse(savedActivities);
      if (!Array.isArray(parsed)) {
        return createDefaultActivities(displayName);
      }
      return parsed;
    } catch {
      return createDefaultActivities(displayName);
    }
  };

  const [tasks, setTasks] = useState(() =>
    loadUserTasks(activeUsername, userInitial),
  );

  const [activities, setActivities] = useState(() =>
    loadUserActivities(
      activeUsername,
      currentUser?.fullName || currentUser?.username || "Guest",
    ),
  );

  useEffect(() => {
    const uname = currentUser?.username || "guest";
    const initial = (
      currentUser?.fullName?.[0] ||
      currentUser?.username?.[0] ||
      "M"
    ).toUpperCase();
    const dName = currentUser?.fullName || currentUser?.username || "Guest";

    setTasks(loadUserTasks(uname, initial));
    setActivities(loadUserActivities(uname, dName));
    setSearchQuery("");
  }, [currentUser?.username]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Could not save theme", error);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Could not save users", error);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(
          CURRENT_USER_STORAGE_KEY,
          JSON.stringify(currentUser),
        );
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Could not save current user", error);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(getTasksKey(activeUsername), JSON.stringify(tasks));
    } catch (error) {
      console.error("Could not save tasks", error);
    }
  }, [tasks, activeUsername]);

  useEffect(() => {
    try {
      localStorage.setItem(
        getActivitiesKey(activeUsername),
        JSON.stringify(activities),
      );
    } catch (error) {
      console.error("Could not save activities", error);
    }
  }, [activities, activeUsername]);

  const registerUser = ({ fullName, username, email, password }) => {
    const cleanUsername = username.trim().toLowerCase();
    const exists = users.some(
      (u) => u.username.toLowerCase() === cleanUsername,
    );

    if (exists) {
      return {
        success: false,
        messageEn: "Username is already taken.",
        messageFa: "این نام کاربری قبلاً ثبت شده است.",
      };
    }

    const newUser = {
      id: uuidv4(),
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      role: "Front-End Developer",
      bio: "React & Front-End Web Developer building clean, modular dashboards.",
    };

    const initial = (
      newUser.fullName[0] ||
      newUser.username[0] ||
      "U"
    ).toUpperCase();

    localStorage.setItem(
      getTasksKey(newUser.username),
      JSON.stringify(createDefaultTasks(initial)),
    );
    localStorage.setItem(
      getActivitiesKey(newUser.username),
      JSON.stringify(createDefaultActivities(newUser.fullName)),
    );

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const loginUser = (username, password) => {
    const cleanUsername = username.trim().toLowerCase();
    const foundUser = users.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername && u.password === password,
    );

    if (!foundUser) {
      return {
        success: false,
        messageEn: "Invalid username or password. Please sign up first.",
        messageFa: "نام کاربری یا رمز عبور اشتباه است.",
      };
    }

    setCurrentUser(foundUser);
    return { success: true };
  };

  const updateUserProfile = (updatedFields) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(updatedUser);
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.username.toLowerCase() === currentUser.username.toLowerCase()
          ? updatedUser
          : u,
      ),
    );
  };
  const changePassword = (oldPassword, newPassword) => {
    if (!currentUser) {
      return { success: false, message: "No active user session." };
    }

    const storedUser = users.find(
      (u) => u.username.toLowerCase() === currentUser.username.toLowerCase(),
    );

    const actualOldPassword = storedUser
      ? storedUser.password
      : currentUser.password;

    if (actualOldPassword !== oldPassword) {
      return {
        success: false,
        message: "Current password is incorrect!",
      };
    }

    if (newPassword.length < 4) {
      return {
        success: false,
        message: "New password must be at least 4 characters.",
      };
    }

    const updatedUser = { ...currentUser, password: newPassword };
    setCurrentUser(updatedUser);
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.username.toLowerCase() === currentUser.username.toLowerCase()
          ? updatedUser
          : u,
      ),
    );

    logActivity("You updated your account password", "green");
    return {
      success: true,
      message: "Password updated successfully!",
    };
  };
  const resetPasswordByUsername = (targetUsername, newPassword) => {
    const cleanUsername = targetUsername.trim().toLowerCase();
    const userExists = users.some(
      (u) => u.username.toLowerCase() === cleanUsername,
    );

    if (!userExists) {
      return {
        success: false,
        message: "Username not found in localStorage!",
      };
    }

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.username.toLowerCase() === cleanUsername
          ? { ...u, password: newPassword }
          : u,
      ),
    );

    if (currentUser && currentUser.username.toLowerCase() === cleanUsername) {
      setCurrentUser((prev) => ({ ...prev, password: newPassword }));
    }

    logActivity(`Password recovered for @${targetUsername}`, "amber");
    return {
      success: true,
      message: "Password reset and saved to localStorage!",
    };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const logActivity = (text, color = "purple") => {
    const newEntry = {
      id: uuidv4(),
      text,
      time: "Just now",
      color,
    };
    setActivities((current) => [newEntry, ...current.slice(0, 7)]);
  };
  const toggleTaskCompletion = (taskId) => {
    const targetTask = tasks.find((item) => item.id === taskId);
    if (!targetTask) return;

    const nextCompleted = !targetTask.completed;
    const nextStatus = nextCompleted ? "Review" : "In Progress";

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === taskId
          ? {
              ...item,
              completed: nextCompleted,
              status: nextStatus,
            }
          : item,
      ),
    );

    if (nextCompleted) {
      logActivity(
        `You checked "${targetTask.title}" (Moved to Review)`,
        "amber",
      );
    } else {
      logActivity(
        `You unchecked "${targetTask.title}" (Moved to In Progress)`,
        "purple",
      );
    }
  };
  const advanceTaskStatus = (taskId) => {
    const targetTask = tasks.find((item) => item.id === taskId);
    if (!targetTask) return;

    const statusOrder = ["To Do", "In Progress", "Review", "Done"];
    const currentStatus = targetTask.status || "To Do";
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus =
      currentIndex < statusOrder.length - 1
        ? statusOrder[currentIndex + 1]
        : "To Do";

    const nextCompleted = nextStatus === "Review" || nextStatus === "Done";

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === taskId
          ? {
              ...item,
              status: nextStatus,
              completed: nextCompleted,
            }
          : item,
      ),
    );

    const activityColor =
      nextStatus === "Done"
        ? "green"
        : nextStatus === "Review"
          ? "amber"
          : "purple";

    logActivity(
      `Task "${targetTask.title}" moved to ${nextStatus}`,
      activityColor,
    );
  };
  const addTask = (taskData) => {
    const newTask = {
      id: uuidv4(),
      title: taskData.title.trim(),
      project: taskData.project.trim() || "TaskMaster Dashboard",
      priority: taskData.priority || "Medium",
      dueDate: taskData.dueDate.trim() || "Today",
      hours: Math.max(0.5, Number(taskData.hours) || 2),
      status: "To Do",
      completed: false,
      assignees:
        taskData.assignees && taskData.assignees.length > 0
          ? taskData.assignees
          : [userInitial],
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    logActivity(`You created task "${newTask.title}" in To Do`, "purple");
  };

  const removeTask = (taskId) => {
    const targetTask = tasks.find((item) => item.id === taskId);
    setTasks((currentTasks) =>
      currentTasks.filter((item) => item.id !== taskId),
    );
    if (targetTask) {
      logActivity(`You removed task "${targetTask.title}"`, "amber");
    }
  };

  const completeProjectTasks = (projectName) => {
    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.project === projectName
          ? { ...item, completed: true, status: "Done" }
          : item,
      ),
    );
    logActivity(`All tasks in "${projectName}" marked as Done`, "green");
  };

  const deleteProjectTasks = (projectName) => {
    setTasks((currentTasks) =>
      currentTasks.filter((item) => item.project !== projectName),
    );
    logActivity(`Project "${projectName}" and its tasks were removed`, "amber");
  };

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter((t) => !t.completed).length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const uniqueProjects = new Set(tasks.map((t) => t.project.trim())).size;
    const hoursLogged = tasks.reduce(
      (sum, item) => sum + (Number(item.hours) || 0),
      0,
    );
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      totalProjects: uniqueProjects,
      activeTasks,
      completedTasks,
      hoursLogged: Number(hoursLogged.toFixed(1)),
      completionRate,
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activities,
        stats,
        theme,
        toggleTheme,
        currentUser,
        loginUser,
        registerUser,
        updateUserProfile,
        changePassword,
        resetPasswordByUsername,
        logoutUser,
        searchQuery,
        setSearchQuery,
        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleTaskCompletion,
        advanceTaskStatus,
        addTask,
        removeTask,
        completeProjectTasks,
        deleteProjectTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export default TaskProvider;
