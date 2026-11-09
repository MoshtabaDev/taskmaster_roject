import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import TaskProvider, { TaskContext } from "./Context/TaskContext";

import "./App.css";
import Auth from "./Pages/Auth/Auth";
import Overview from "./Pages/Overview/Overview";
import MyTasks from "./Pages/MyTasks/MyTasks";
import Projects from "./Pages/Projects/Projects";
import Kanban from "./Pages/Kanban/Kanban";
import Analytics from "./Pages/Analytics/Analytics";
import Settings from "./Pages/Settings/Settings";
import NotFound from "./Pages/NotFound/NotFound";
import OnboardingTour from "./Components/OnboardingTour/OnboardingTour";

function AppRoutes() {
  const { currentUser } = useContext(TaskContext);

  if (!currentUser) {
    return (
      <>
        <Overview />
        <Auth />
      </>
    );
  }

  return (
    <>
      <OnboardingTour />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="appLayout">
      <TaskProvider>
        <AppRoutes />
      </TaskProvider>
    </div>
  );
}

export default App;
