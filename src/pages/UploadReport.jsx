import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uploadReport } from "../store/slices/reportSlice";
import toast from "react-hot-toast";
import { Upload, FileText, ArrowLeft, Loader } from "lucide-react";

const UploadReport = () => {
  const [formData, setFormData] = useState({
    title: "",
    reportType: "blood-test",
    reportDate: "",
    notes: "",
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      await dispatch(uploadReport(data)).unwrap();
      toast.success("Report uploaded! AI is analyzing...");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Upload failed");
    } finally {
      setLoading(false);
    }
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
              <strong>Note:</strong> AI will analyze your report and provide a summary in English and Roman Urdu. This may take a few moments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;
