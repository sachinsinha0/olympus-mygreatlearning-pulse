import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { DevPanel } from "./components/common/DevPanel";
import { PricingModal } from "./components/pulse/PricingModal";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { PulseHome } from "./pages/Pulse/PulseHome";
import { IssueDetail } from "./pages/Pulse/IssueDetail";
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
      <ScrollToTop />
      <DevPanel />
      <PricingModal />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/pulse" element={<PulseHome />} />
        <Route path="/pulse/subscription" element={<SubscriptionPage />} />
        <Route path="/pulse/issue/:id" element={<IssueDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
