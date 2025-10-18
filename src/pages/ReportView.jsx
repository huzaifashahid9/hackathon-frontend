import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getReportById, deleteReport } from "../store/slices/reportSlice";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Loader,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const ReportView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentReport: report, loading } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(getReportById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await dispatch(deleteReport(id)).unwrap();
        toast.success("Report deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to delete report");
      }
    }
  };

  if (loading || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-sky-500 animate-spin" />
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-500"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex gap-2">
            <a
              href={report.file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download
            </a>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-sky-100 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-sky-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {report.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(report.reportDate)}
                </span>
                <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                  {report.reportType}
                </span>
              </div>
            </div>
          </div>

          {report.notes && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{report.notes}</p>
            </div>
          )}

          {/* Report Preview */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Report File</h2>
            {report.file.fileType === "pdf" ? (
              <div className="border-2 border-gray-300 rounded-lg p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">PDF Document</p>
                <a
                  href={report.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                >
                  Open PDF
                </a>
              </div>
            ) : (
              <img
                src={report.file.url}
                alt={report.title}
                className="w-full rounded-lg border"
              />
            )}
          </div>
        </div>

        {/* AI Summary */}
        {report.isProcessed && report.aiSummary ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <h2 className="text-2xl font-bold text-gray-900">AI Analysis</h2>
            </div>

            <div className="space-y-6">
              {/* English Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📝 Summary (English)
                </h3>
                <div className="p-4 bg-sky-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {report.aiSummary.englishSummary}
                  </p>
                </div>
              </div>

              {/* Roman Urdu Summary */}
              {report.aiSummary.romanUrduSummary && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    📝 Summary (Roman Urdu)
                  </h3>
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {report.aiSummary.romanUrduSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* Abnormal Values */}
              {report.aiSummary.abnormalValues && report.aiSummary.abnormalValues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    ⚠️ Abnormal Values
                  </h3>
                  <div className="space-y-2">
                    {report.aiSummary.abnormalValues.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 border-l-4 border-red-500 bg-red-50 rounded"
                      >
                        <div className="font-semibold text-gray-900">
                          {item.parameter}
                        </div>
                        <div className="text-gray-700">
                          Value: {item.value} | Normal: {item.normalRange} |
                          Status: <span className="font-medium text-red-600">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor Questions */}
              {report.aiSummary.doctorQuestions && report.aiSummary.doctorQuestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    💬 Questions to Ask Your Doctor
                  </h3>
                  <ul className="space-y-2">
                    {report.aiSummary.doctorQuestions.map((q, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-sky-500 font-bold">{index + 1}.</span>
                        <span className="text-gray-700">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Foods to Avoid */}
              {report.aiSummary.foodsToAvoid && report.aiSummary.foodsToAvoid.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🚫 Foods to Avoid
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.aiSummary.foodsToAvoid.map((food, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Foods */}
              {report.aiSummary.recommendedFoods && report.aiSummary.recommendedFoods.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    ✅ Recommended Foods
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.aiSummary.recommendedFoods.map((food, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Home Remedies */}
              {report.aiSummary.homeRemedies && report.aiSummary.homeRemedies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🏠 Home Remedies
                  </h3>
                  <ul className="space-y-2">
                    {report.aiSummary.homeRemedies.map((remedy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span>
                        <span className="text-gray-700">{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <p className="text-amber-800 text-sm">
                    {report.aiSummary.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : !report.isProcessed && !report.processingError ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Loader className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">AI is analyzing your report...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        ) : report.processingError ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-xl font-semibold">AI Analysis Failed</h3>
            </div>
            <p className="text-gray-600">{report.processingError}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReportView;
