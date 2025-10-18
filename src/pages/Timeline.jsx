import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../store/slices/reportSlice";
import { getVitals } from "../store/slices/vitalsSlice";
import {
  ArrowLeft,
  FileText,
  Activity,
  Calendar,
  Filter,
  Loader,
} from "lucide-react";

const Timeline = () => {
  const dispatch = useDispatch();
  const { reports, loading: reportsLoading } = useSelector((state) => state.reports);
  const { vitals, loading: vitalsLoading } = useSelector((state) => state.vitals);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getReports({ limit: 100 }));
    dispatch(getVitals({ limit: 100 }));
  }, [dispatch]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Combine and sort by date
  const allEntries = [
    ...reports.map((r) => ({ ...r, type: "report", date: r.reportDate })),
    ...vitals.map((v) => ({ ...v, type: "vital", date: v.recordDate })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredEntries =
    filter === "all"
      ? allEntries
      : allEntries.filter((e) => e.type === filter);

  const loading = reportsLoading || vitalsLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-500 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Health Timeline
          </h1>
          <p className="text-gray-600">
            Apni puri health history chronological order mein
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("report")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "report"
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setFilter("vital")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "vital"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Vitals
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Loader className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading timeline...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No entries yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by uploading a report or adding vitals
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/upload"
                className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                Upload Report
              </Link>
              <Link
                to="/add-vitals"
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Add Vitals
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block" />

            <div className="space-y-6">
              {filteredEntries.map((entry, index) => (
                <div key={`${entry.type}-${entry._id}`} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-5 h-5 rounded-full bg-white border-4 hidden md:block" style={{
                    borderColor: entry.type === "report" ? "#0EA5E9" : "#10B981"
                  }} />

                  {/* Content */}
                  <div className="md:ml-16">
                    {entry.type === "report" ? (
                      <Link
                        to={`/report/${entry._id}`}
                        className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-sky-500"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="bg-sky-100 p-3 rounded-lg">
                              <FileText className="w-6 h-6 text-sky-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {entry.title}
                                </h3>
                                <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium">
                                  Report
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {entry.reportType}
                              </p>
                              {entry.notes && (
                                <p className="text-gray-600 text-sm">
                                  {entry.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-medium text-gray-900">
                              {formatDate(entry.date)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatTime(entry.createdAt)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="bg-emerald-100 p-3 rounded-lg">
                              <Activity className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                  Manual Vitals
                                </h3>
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                                  Vitals
                                </span>
                              </div>
                              <div className="grid md:grid-cols-2 gap-2 text-sm">
                                {entry.bloodPressure && (
                                  <div>
                                    <span className="text-gray-600">BP:</span>{" "}
                                    <span className="font-medium text-gray-900">
                                      {entry.bloodPressure.systolic}/
                                      {entry.bloodPressure.diastolic} mmHg
                                    </span>
                                  </div>
                                )}
                                {entry.bloodSugar && (
                                  <div>
                                    <span className="text-gray-600">Sugar:</span>{" "}
                                    <span className="font-medium text-gray-900">
                                      {entry.bloodSugar.value} mg/dL (
                                      {entry.bloodSugar.type})
                                    </span>
                                  </div>
                                )}
                                {entry.weight && (
                                  <div>
                                    <span className="text-gray-600">Weight:</span>{" "}
                                    <span className="font-medium text-gray-900">
                                      {entry.weight.value} kg
                                    </span>
                                  </div>
                                )}
                                {entry.heartRate && (
                                  <div>
                                    <span className="text-gray-600">Heart Rate:</span>{" "}
                                    <span className="font-medium text-gray-900">
                                      {entry.heartRate.value} bpm
                                    </span>
                                  </div>
                                )}
                              </div>
                              {entry.notes && (
                                <p className="text-gray-600 text-sm mt-2">
                                  {entry.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-medium text-gray-900">
                              {formatDate(entry.date)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatTime(entry.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
