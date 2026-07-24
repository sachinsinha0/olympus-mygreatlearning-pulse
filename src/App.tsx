import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from "react-router-dom";
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
import { ProgramSupport } from "./pages/ProgramSupport";
import { SupportProvider } from "./context/SupportContext";
import { AskQuestion } from "./pages/AskQuestion";
import { TopicCompose } from "./pages/TopicCompose";
import { GlaideChat } from "./pages/GlaideChat";
import { GlaideChatMock } from "./pages/GlaideChatMock";
import { ProtoGuidedSteps } from "./pages/ProtoGuidedSteps";
import { ProtoStepper } from "./pages/ProtoStepper";
import { ProtoIndex } from "./pages/ProtoIndex";
import { InterviewReport } from "./pages/InterviewReport/InterviewReport";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RootLayout() {
  return (
    <PageLoaderProvider>
      <ScrollToTop />
      <DevPanel />
      <PricingModal />
      <SupportProvider>
        <Outlet />
      </SupportProvider>
    </PageLoaderProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/courses", element: <Courses /> },
      { path: "/courses/:id", element: <CourseDetail /> },
      { path: "/program_support", element: <ProgramSupport /> },
      { path: "/program_support/ask", element: <AskQuestion /> },
      { path: "/program_support/glaide", element: <TopicCompose /> },
      { path: "/program_support/chat", element: <GlaideChat /> },
      { path: "/program_support/chat/:threadId", element: <GlaideChat /> },
      { path: "/program_support/chat-mock", element: <GlaideChatMock /> },
      { path: "/program_support/proto", element: <ProtoIndex /> },
      { path: "/program_support/proto/a", element: <GlaideChatMock /> },
      { path: "/program_support/proto/b", element: <ProtoGuidedSteps /> },
      { path: "/program_support/proto/c", element: <ProtoStepper /> },
      { path: "/pulse", element: <PulseHome /> },
      { path: "/pulse/intro", element: <PulseIntroPage /> },
      { path: "/pulse/subscription", element: <SubscriptionPage /> },
      { path: "/pulse/modules/:moduleId", element: <PulseConsumePage /> },
      { path: "/pulse/modules/:moduleId/items/:itemId", element: <PulseConsumePage /> },
      { path: "/sublime", element: <InterviewReport /> },
      { path: "/pulse/course", element: <Navigate to="/pulse" replace /> },
      { path: "/pulse/course/*", element: <Navigate to="/pulse" replace /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
