import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/Sign-In-page";
import SignUpPage from "./pages/Sign-Up-page";
import VerifyPage from "./pages/VerifyEmail";
import Dashboard from "./components/Dashboard/Dashboard";
import HomeDashBoard from "./pages/HomeDashBoard";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import AccountsPage from "./pages/dashboard/AccountsPage";
import TransactionsPage from "./pages/dashboard/TransactionsPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import TransfersPage from "./pages/dashboard/TransfersPage";
import SecurityPage from "./pages/dashboard/SecurityPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import SupportPage from "./pages/dashboard/SupportPage";
import AuthGuard from "./AuthGuard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/Verify" element={<VerifyPage />} />
        <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route index path="/dashboard" element={<HomeDashBoard />} />
          <Route path="/user-dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Dashboard />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
