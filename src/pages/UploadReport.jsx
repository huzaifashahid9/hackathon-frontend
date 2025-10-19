import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uploadReport } from "../store/slices/reportSlice";
import toast from "react-hot-toast";
import { Upload, FileText, ArrowLeft, Loader, CheckCircle, AlertCircle } from "lucide-react";
import FamilyMemberSelector from "../components/FamilyMemberSelector";

const UploadReport = () => {
  const [formData, setFormData] = useState({
    title: "",
    reportType: "blood-test",
    reportDate: "",
    notes: "",
    familyMemberId: "",
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedReport, setUploadedReport] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reportTypes = [
    { value: "blood-test", label: "Blood Test" },
    { value: "urine-test", label: "Urine Test" },
    { value: "x-ray", label: "X-Ray" },
    { value: "ultrasound", label: "Ultrasound" },
    { value: "ct-scan", label: "CT Scan" },
    { value: "mri", label: "MRI" },
    { value: "ecg", label: "ECG" },
    { value: "prescription", label: "Prescription" },
    { value: "doctor-notes", label: "Doctor Notes" },
    { value: "other", label: "Other" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFormData({ ...formData, file });

      // Preview
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.familyMemberId) {
      toast.error("Please select a family member");
      return;
    }

    if (!formData.file) {
      toast.error("Please select a file");
      return;
    }

    const data = new FormData();
    data.append("file", formData.file);
    data.append("title", formData.title);
    data.append("reportType", formData.reportType);
    data.append("reportDate", formData.reportDate);
    data.append("notes", formData.notes);
    data.append("familyMemberId", formData.familyMemberId);

    setLoading(true);
    try {
      const result = await dispatch(uploadReport(data)).unwrap();
      setUploadedReport(result);
      setIsProcessing(true);
      toast.success("Report uploaded! AI is analyzing...");
      
      // Reset form but keep family member selected
      setFormData({
        ...formData,
        title: "",
        reportType: "blood-test",
        reportDate: "",
        notes: "",
        file: null,
      });
      setPreview(null);
      
      // Poll for AI analysis completion
      checkAnalysisStatus(result._id);
    } catch (error) {
      toast.error(error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const checkAnalysisStatus = (reportId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/reports/${reportId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        
        if (data.success && data.report.isProcessed) {
          setUploadedReport(data.report);
          setIsProcessing(false);
          clearInterval(interval);
          toast.success("AI analysis complete!");
        }
      } catch (error) {
        console.error("Error checking analysis status:", error);
      }
    }, 3000); // Check every 3 seconds

    // Stop checking after 2 minutes
    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
    }, 120000);
  };

  const handleNewUpload = () => {
    setUploadedReport(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-500 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-sky-100 p-3 rounded-lg">
              <Upload className="w-8 h-8 text-sky-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Upload Medical Report
              </h1>
              <p className="text-gray-600">
                Apni lab report ya prescription upload karein
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Family Member Selector */}
            <FamilyMemberSelector
              value={formData.familyMemberId}
              onChange={(value) =>
                setFormData({ ...formData, familyMemberId: value })
              }
              required={true}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                placeholder="e.g., Monthly Blood Test"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type *
              </label>
              <select
                value={formData.reportType}
                onChange={(e) =>
                  setFormData({ ...formData, reportType: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Date *
              </label>
              <input
                type="date"
                value={formData.reportDate}
                onChange={(e) =>
                  setFormData({ ...formData, reportDate: e.target.value })
                }
                required
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File (PDF or Image) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-sky-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-gray-700 font-medium mb-2">
                    Click to upload file
                  </span>
                  <span className="text-gray-500 text-sm">
                    PDF, JPG, PNG (Max 10MB)
                  </span>
                </label>
              </div>
              {formData.file && (
                <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                  <p className="text-sky-700 font-medium flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {formData.file.name}
                  </p>
                </div>
              )}
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none"
                placeholder="Any additional notes..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  Uploading & Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6" />
                  Upload Report
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> AI will analyze your report and provide a
              summary in English and Roman Urdu. This may take a few moments.
            </p>
          </div>
        </div>

        {/* AI Analysis Result */}
        {uploadedReport && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              {isProcessing ? (
                <>
                  <Loader className="w-8 h-8 text-sky-500 animate-spin" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      AI Analysis in Progress...
                    </h2>
                    <p className="text-gray-600">
                      Aapki report ko analyze kiya ja raha hai
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      AI Analysis Complete!
                    </h2>
                    <p className="text-gray-600">
                      {uploadedReport.title}
                    </p>
                  </div>
                </>
              )}
            </div>

            {uploadedReport.isProcessed && uploadedReport.aiSummary ? (
              <div className="space-y-6">
                {/* English Summary */}
                {uploadedReport.aiSummary.englishSummary && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      📊 Summary (English)
                    </h3>
                    <p className="text-blue-800 whitespace-pre-wrap">
                      {uploadedReport.aiSummary.englishSummary}
                    </p>
                  </div>
                )}

                {/* Roman Urdu Summary */}
                {uploadedReport.aiSummary.romanUrduSummary && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">
                      📊 Summary (Roman Urdu)
                    </h3>
                    <p className="text-green-800 whitespace-pre-wrap">
                      {uploadedReport.aiSummary.romanUrduSummary}
                    </p>
                  </div>
                )}

                {/* Abnormal Values */}
                {uploadedReport.aiSummary.abnormalValues &&
                  uploadedReport.aiSummary.abnormalValues.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Abnormal Values
                      </h3>
                      <div className="space-y-2">
                        {uploadedReport.aiSummary.abnormalValues.map((val, idx) => (
                          <div key={idx} className="bg-white p-3 rounded border border-red-200">
                            <p className="font-medium text-red-900">{val.parameter}</p>
                            <p className="text-sm text-red-700">
                              Value: {val.value} | Normal Range: {val.normalRange}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              val.status === 'critical' ? 'bg-red-200 text-red-900' :
                              val.status === 'high' ? 'bg-orange-200 text-orange-900' :
                              'bg-yellow-200 text-yellow-900'
                            }`}>
                              {val.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Questions for Doctor */}
                {uploadedReport.aiSummary.doctorQuestions &&
                  uploadedReport.aiSummary.doctorQuestions.length > 0 && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">
                        ❓ Doctor se ye sawaal zaroor poochein
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-purple-800">
                        {uploadedReport.aiSummary.doctorQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Foods to Avoid */}
                {uploadedReport.aiSummary.foodsToAvoid &&
                  uploadedReport.aiSummary.foodsToAvoid.length > 0 && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h3 className="font-semibold text-orange-900 mb-2">
                        🚫 Foods to Avoid
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-orange-800">
                        {uploadedReport.aiSummary.foodsToAvoid.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Recommended Foods */}
                {uploadedReport.aiSummary.recommendedFoods &&
                  uploadedReport.aiSummary.recommendedFoods.length > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">
                        ✅ Recommended Foods
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-green-800">
                        {uploadedReport.aiSummary.recommendedFoods.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Home Remedies */}
                {uploadedReport.aiSummary.homeRemedies &&
                  uploadedReport.aiSummary.homeRemedies.length > 0 && (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <h3 className="font-semibold text-teal-900 mb-2">
                        🏠 Gharelu Ilaaj / Home Remedies
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-teal-800">
                        {uploadedReport.aiSummary.homeRemedies.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Disclaimer */}
                <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                  <p className="text-gray-700 text-sm italic">
                    ⚠️ {uploadedReport.aiSummary.disclaimer}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleNewUpload}
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-semibold transition-all"
                  >
                    Upload Another Report
                  </button>
                  <Link
                    to="/dashboard"
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold text-center transition-all"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">
                  AI analysis in progress... Please wait
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadReport;
