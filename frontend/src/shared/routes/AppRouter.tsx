import Login from "../../pages/login";
import { Helmet } from "react-helmet";
import { Routes, Route } from "react-router-dom";
import {
  ProtectedRouteDashboardAdmin,
} from "./ProtectRoute.jsx";
import AccountManagement from "@/pages/admin/account";
import DepartmentManagement from "@/pages/admin/department";
import ClassManagement from "@/pages/admin/class";
import StudentManagement from "@/pages/admin/student";
import SubjectManagement from "@/pages/admin/subject";
import AttendenceManagement from "@/pages/admin/attendence";
import ScoreManagement from "@/pages/admin/score";
import ForgotPassword from "@/pages/forgotPassword";

export const AppRouter = () => {
  return (
    <>
      <Helmet>
        <title>System Management</title>
        <meta name="description" content="System Management" />
        <link rel="icon" type="image/x-icon" href={"logo"} />
      </Helmet>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard/account"
          element={
            <ProtectedRouteDashboardAdmin>
              <AccountManagement />
            </ProtectedRouteDashboardAdmin>
          }
        />
        <Route
          path="/dashboard/department"
          element={
            <ProtectedRouteDashboardAdmin>
              <DepartmentManagement />
            </ProtectedRouteDashboardAdmin>
          }
        />

        <Route
          path="/dashboard/class"
          element={
            <ProtectedRouteDashboardAdmin>
              <ClassManagement />
            </ProtectedRouteDashboardAdmin>
          }
        />

        <Route
          path="/dashboard/student"
          element={
            <ProtectedRouteDashboardAdmin>
              <StudentManagement />
            </ProtectedRouteDashboardAdmin>
          }
        />

        <Route
          path="/dashboard/subject"
          element={
            <ProtectedRouteDashboardAdmin>
              <SubjectManagement />
            </ProtectedRouteDashboardAdmin>
          }
        />

        <Route
          path="/dashboard/score"
          element={
            <ProtectedRouteDashboardAdmin>
              <ScoreManagement />
            </ProtectedRouteDashboardAdmin>
          }
        />

        <Route
          path="/dashboard/attendence"
          element={
            <ProtectedRouteDashboardAdmin>
              <AttendenceManagement />
            </ProtectedRouteDashboardAdmin>
          }
        />
      </Routes>
    </>
  );
};
