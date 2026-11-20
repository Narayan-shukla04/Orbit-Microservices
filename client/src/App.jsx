import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom"
import { Provider, useSelector } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { store } from "./store"
import { useAuthSession } from "./hooks/useAuth"

import ProtectedRoute from "./components/auth/ProtectedRoute"
import PublicRoute    from "./components/auth/PublicRoute"

import ServerRail     from "./components/layout/ServerRail"
import ChannelSidebar from "./components/layout/ChannelSidebar"
import TopNav         from "./components/layout/TopNav"
import InviteModal    from "./components/layout/InviteModal"
import ChatPage       from "./pages/ChatPage"
import VoicePage      from "./pages/VoicePage"
import SettingsPage   from "./pages/SettingsPage"
import DMPane         from "./components/layout/DMPane"
import LandingPage    from "./pages/LandingPage"
import LoginPage      from "./pages/LoginPage"
import RegisterPage   from "./pages/RegisterPage"
import PrivacyPage    from "./pages/PrivacyPage"
import TermsPage      from "./pages/TermsPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const PAGE = {
  channels: ChatPage,
  voice: VoicePage,
  settings: SettingsPage,
  dm: DMPane,
  "create-chamber": ChatPage,
}

function Shell() {
  const activeView = useSelector((s) => s.ui.activeView)
  const Page = PAGE[activeView] ?? ChatPage
  const isDm = activeView === "dm"

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface font-sans antialiased">
      <ServerRail />
      {!isDm && <ChannelSidebar />}
      <div className={`${isDm ? "pl-[72px]" : "pl-[332px]"} flex flex-col flex-1 overflow-hidden transition-all duration-150`}>
        <TopNav />
        <main className="mt-16 flex-1 flex overflow-hidden">
          <Page />
        </main>
      </div>
      <InviteModal />
    </div>
  )
}

function RootLayout() {
  useAuthSession()
  return <Outlet />
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: "/app",
        element: (
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        ),
      },
      {
        path: "/privacy",
        element: <PrivacyPage />,
      },
      {
        path: "/terms",
        element: <TermsPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  )
}