import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { DevPanel } from "./components/common/DevPanel";
import { PageLoaderProvider } from "./components/common/PageLoader";
import { PricingModal } from "./components/pulse/PricingModal";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { PulseHome } from "./pages/Pulse/PulseHome";
import { PulseIntroPage } from "./pages/Pulse/PulseIntroPage";
import { PulseConsumePage } from "./pages/Pulse/PulseConsumePage";
import { SubscriptionPage } from "./pages/Pulse/SubscriptionPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <PageLoaderProvider>
        <ScrollToTop />
        <DevPanel />
        <PricingModal />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/pulse" element={<PulseHome />} />
          <Route path="/pulse/intro" element={<PulseIntroPage />} />
          <Route path="/pulse/subscription" element={<SubscriptionPage />} />
          <Route path="/pulse/modules/:moduleId" element={<PulseConsumePage />} />
          <Route path="/pulse/modules/:moduleId/items/:itemId" element={<PulseConsumePage />} />
          <Route path="/pulse/course" element={<Navigate to="/pulse" replace />} />
          <Route path="/pulse/course/*" element={<Navigate to="/pulse" replace />} />
        </Routes>
      </PageLoaderProvider>
    </BrowserRouter>
  );
}
