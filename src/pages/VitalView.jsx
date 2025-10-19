import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getVitalById, deleteVital } from "../store/slices/vitalsSlice";
import toast from "react-hot-toast";
import axios from "../api/axios";
import {
  ArrowLeft,
  Activity,
  Calendar,
  Loader,
  Trash2,
  AlertCircle,
  CheckCircle,
  Heart,
  Droplet,
  Weight,
  Thermometer,
  Wind,
  RefreshCw,
} from "lucide-react";

const VitalView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentVital: vital, loading } = useSelector((state) => state.vitals);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    dispatch(getVitalById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this vital record?")) {
      try {
        await dispatch(deleteVital(id)).unwrap();
        toast.success("Vital record deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to delete vital record");
      }
    }
  };

  const handleReanalyze = async () => {
    setReanalyzing(true);
    try {
      const response = await axios.post("/vitals/insights", { vitalId: id });

      if (response.data.success) {
        toast.success("AI analysis completed!");
        // Refresh the vital data
        dispatch(getVitalById(id));
      }
    } catch (error) {
      console.error("Reanalysis error:", error);
      toast.error(error.response?.data?.message || "Failed to analyze vitals");
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading || !vital) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-emerald-500 animate-spin" />
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
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-500"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Activity className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Health Vitals Record
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(vital.recordDate)}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  Manual Entry
                </span>
              </div>
            </div>
          </div>

          {/* Vitals Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {vital.bloodPressure?.systolic &&
              vital.bloodPressure?.diastolic && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="font-semibold text-gray-900">
                      Blood Pressure
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {vital.bloodPressure.systolic}/
                    {vital.bloodPressure.diastolic}
                  </p>
                  <p className="text-sm text-gray-600">mmHg</p>
                </div>
              )}

            {vital.bloodSugar?.value && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <Droplet className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-gray-900">
                    Blood Sugar
                  </span>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {vital.bloodSugar.value}
                </p>
                <p className="text-sm text-gray-600">
                  {vital.bloodSugar.unit} ({vital.bloodSugar.type})
                </p>
              </div>
            )}

            {vital.weight?.value && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Weight className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-gray-900">Weight</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {vital.weight.value}
                </p>
                <p className="text-sm text-gray-600">{vital.weight.unit}</p>
              </div>
            )}

            {vital.height?.value && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold text-gray-900">Height</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {vital.height.value}
                </p>
                <p className="text-sm text-gray-600">{vital.height.unit}</p>
              </div>
            )}

            {vital.heartRate?.value && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="font-semibold text-gray-900">
                    Heart Rate
                  </span>
                </div>
                <p className="text-2xl font-bold text-pink-600">
                  {vital.heartRate.value}
                </p>
                <p className="text-sm text-gray-600">bpm</p>
              </div>
            )}

            {vital.temperature?.value && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-gray-900">
                    Temperature
                  </span>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {vital.temperature.value}
                </p>
                <p className="text-sm text-gray-600">
                  °{vital.temperature.unit === "celsius" ? "C" : "F"}
                </p>
              </div>
            )}

            {vital.oxygenLevel?.value && (
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-3 mb-2">
                  <Wind className="w-5 h-5 text-cyan-500" />
                  <span className="font-semibold text-gray-900">
                    Oxygen Level
                  </span>
                </div>
                <p className="text-2xl font-bold text-cyan-600">
                  {vital.oxygenLevel.value}
                </p>
                <p className="text-sm text-gray-600">%</p>
              </div>
            )}

            {vital.bmi && (
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  <span className="font-semibold text-gray-900">BMI</span>
                </div>
                <p className="text-2xl font-bold text-indigo-600">
                  {vital.bmi}
                </p>
                <p className="text-sm text-gray-600">Body Mass Index</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {vital.notes && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700">{vital.notes}</p>
            </div>
          )}

          {/* Symptoms */}
          {vital.symptoms && vital.symptoms.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-900 mb-2">Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {vital.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis */}
        {vital.isAnalyzed && vital.aiAnalysis ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <h2 className="text-2xl font-bold text-gray-900">AI Analysis</h2>
            </div>

            <div className="space-y-6">
              {/* English Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📝 Assessment (English)
                </h3>
                <div className="p-4 bg-sky-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {vital.aiAnalysis.englishSummary}
                  </p>
                </div>
              </div>

              {/* Roman Urdu Summary */}
              {vital.aiAnalysis.romanUrduSummary && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    📝 Assessment (Roman Urdu)
                  </h3>
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {vital.aiAnalysis.romanUrduSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* Abnormal Values */}
              {vital.aiAnalysis.abnormalValues &&
                vital.aiAnalysis.abnormalValues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      ⚠️ Abnormal Values
                    </h3>
                    <div className="space-y-2">
                      {vital.aiAnalysis.abnormalValues.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 border-l-4 border-red-500 bg-red-50 rounded"
                        >
                          <div className="font-semibold text-gray-900">
                            {item.parameter}
                          </div>
                          <div className="text-gray-700">
                            Value: {item.value} | Normal: {item.normalRange} |
                            Status:{" "}
                            <span className="font-medium text-red-600">
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Doctor Questions */}
              {vital.aiAnalysis.doctorQuestions &&
                vital.aiAnalysis.doctorQuestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      💬 Questions to Ask Your Doctor
                    </h3>
                    <ul className="space-y-2">
                      {vital.aiAnalysis.doctorQuestions.map((q, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">
                            {index + 1}.
                          </span>
                          <span className="text-gray-700">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Foods to Avoid */}
              {vital.aiAnalysis.foodsToAvoid &&
                vital.aiAnalysis.foodsToAvoid.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      🚫 Foods to Avoid
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {vital.aiAnalysis.foodsToAvoid.map((food, index) => (
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
              {vital.aiAnalysis.recommendedFoods &&
                vital.aiAnalysis.recommendedFoods.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      ✅ Recommended Foods
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {vital.aiAnalysis.recommendedFoods.map((food, index) => (
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
              {vital.aiAnalysis.homeRemedies &&
                vital.aiAnalysis.homeRemedies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      🏠 Home Remedies
                    </h3>
                    <ul className="space-y-2">
                      {vital.aiAnalysis.homeRemedies.map((remedy, index) => (
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
                    {vital.aiAnalysis.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : !vital.isAnalyzed ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              AI analysis is not available for this record.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Older records may not have AI analysis.
            </p>

            <button
              onClick={handleReanalyze}
              disabled={reanalyzing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reanalyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Re-analyze with AI
                </>
              )}
            </button>
            <p className="text-gray-400 text-xs mt-3">
              Click to generate AI analysis for this record
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VitalView;
