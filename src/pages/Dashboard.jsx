import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { getReports } from "../store/slices/reportSlice";
import { getVitals } from "../store/slices/vitalsSlice";
import {
  FileText,
  Activity,
  Upload,
  LogOut,
  User,
  Calendar,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { reports, loading: reportsLoading } = useSelector(
    (state) => state.reports
  );
  const { vitals, loading: vitalsLoading } = useSelector(
    (state) => state.vitals
  );

  useEffect(() => {
    dispatch(getReports({ limit: 5 }));
    dispatch(getVitals({ limit: 5 }));
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-sky-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-sky-500" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-sky-500">Health </span>Mate
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium hidden sm:block">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Apni sehat ka record yahan dekhen aur manage karein
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/upload"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-sky-500 group"
          >
            <div className="bg-sky-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-sky-500 transition-colors">
              <Upload className="w-8 h-8 text-sky-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Upload Report
            </h3>
            <p className="text-gray-600">
              Lab report ya prescription upload karein
            </p>
          </Link>

          <Link
            to="/add-vitals"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-emerald-500 group"
          >
            <div className="bg-emerald-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-emerald-500 transition-colors">
              <Activity className="w-8 h-8 text-emerald-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Vitals</h3>
            <p className="text-gray-600">
              BP, sugar, weight manually add karein
            </p>
          </Link>

          <Link
            to="/timeline"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-amber-500 group"
          >
            <div className="bg-amber-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-amber-500 transition-colors">
              <Calendar className="w-8 h-8 text-amber-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              View Timeline
            </h3>
            <p className="text-gray-600">Apni puri health history dekhein</p>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-6 rounded-xl text-white">
            <FileText className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">{reports.length}</div>
            <div className="text-sky-100">Total Reports</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white">
            <Activity className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">{vitals.length}</div>
            <div className="text-emerald-100">Vital Records</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white">
            <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">
              {reports.length + vitals.length}
            </div>
            <div className="text-amber-100">Total Entries</div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
            <Link
              to="/timeline"
              className="text-sky-500 hover:text-sky-600 font-medium"
            >
              View All →
            </Link>
          </div>
          {reportsLoading ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reports yet. Upload your first report!
            </p>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <Link
                  key={report._id}
                  to={`/report/${report._id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-sky-100 p-2 rounded">
                      <FileText className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {report.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.reportType}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(report.reportDate)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Vitals</h2>
            <Link
              to="/timeline"
              className="text-emerald-500 hover:text-emerald-600 font-medium"
            >
              View All →
            </Link>
          </div>
          {vitalsLoading ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : vitals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No vitals yet. Add your first entry!
            </p>
          ) : (
            <div className="space-y-3">
              {vitals.slice(0, 5).map((vital) => (
                <Link
                  key={vital._id}
                  to={`/vital/${vital._id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-sky-50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-2 rounded">
                      <Activity className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {vital.bloodPressure &&
                          `BP: ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`}
                        {vital.bloodSugar &&
                          ` | Sugar: ${vital.bloodSugar.value}`}
                        {vital.weight && ` | Weight: ${vital.weight.value}kg`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vital.notes || "No notes"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(vital.recordDate)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
