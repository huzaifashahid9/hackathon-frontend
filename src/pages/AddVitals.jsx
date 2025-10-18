import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addVitals } from "../store/slices/vitalsSlice";
import toast from "react-hot-toast";
import { Activity, ArrowLeft, Loader, AlertCircle } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema using Yup (without cyclic dependencies)
const vitalsValidationSchema = Yup.object({
  recordDate: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
  bpSystolic: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(40, "Systolic BP must be between 40-300 mmHg")
    .max(300, "Systolic BP must be between 40-300 mmHg")
    .test(
      "bp-both-required",
      "Both systolic and diastolic BP are required",
      function (value) {
        const { bpDiastolic } = this.parent;
        // If diastolic is filled but systolic is not, show error
        if (bpDiastolic && !value) {
          return false;
        }
        return true;
      }
    )
    .test(
      "bp-systolic-greater",
      "Systolic BP must be greater than diastolic BP",
      function (value) {
        const { bpDiastolic } = this.parent;
        if (value && bpDiastolic) {
          return value > bpDiastolic;
        }
        return true;
      }
    ),
  bpDiastolic: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(20, "Diastolic BP must be between 20-200 mmHg")
    .max(200, "Diastolic BP must be between 20-200 mmHg")
    .test(
      "bp-both-required",
      "Both systolic and diastolic BP are required",
      function (value) {
        const { bpSystolic } = this.parent;
        // If systolic is filled but diastolic is not, show error
        if (bpSystolic && !value) {
          return false;
        }
        return true;
      }
    ),
  bloodSugar: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(20, "Blood Sugar must be between 20-1000 mg/dL")
    .max(1000, "Blood Sugar must be between 20-1000 mg/dL"),
  bloodSugarType: Yup.string().oneOf(["fasting", "random", "postprandial", "post-meal", "hba1c"]),
  weight: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(1, "Weight must be between 1-500 kg")
    .max(500, "Weight must be between 1-500 kg"),
  height: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(30, "Height must be between 30-300 cm")
    .max(300, "Height must be between 30-300 cm"),
  heartRate: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(30, "Heart Rate must be between 30-300 bpm")
    .max(300, "Heart Rate must be between 30-300 bpm"),
  temperature: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(30, "Temperature must be between 30-45 °C")
    .max(45, "Temperature must be between 30-45 °C"),
  oxygenLevel: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(50, "Oxygen Level must be between 50-100%")
    .max(100, "Oxygen Level must be between 50-100%"),
  notes: Yup.string().max(500, "Notes must be less than 500 characters"),
}).test(
  "at-least-one-vital",
  "Please fill at least one vital sign",
  function (value) {
    const {
      bpSystolic,
      bpDiastolic,
      bloodSugar,
      weight,
      height,
      heartRate,
      temperature,
      oxygenLevel,
    } = value;
    return !!(
      bpSystolic ||
      bpDiastolic ||
      bloodSugar ||
      weight ||
      height ||
      heartRate ||
      temperature ||
      oxygenLevel
    );
  }
);

const AddVitals = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      recordDate: new Date().toISOString().split("T")[0],
      bpSystolic: "",
      bpDiastolic: "",
      bloodSugar: "",
      bloodSugarType: "fasting",
      weight: "",
      height: "",
      heartRate: "",
      temperature: "",
      oxygenLevel: "",
      notes: "",
    },
    validationSchema: vitalsValidationSchema,
    onSubmit: async (values) => {
      const vitalsData = {
        recordDate: values.recordDate,
        notes: values.notes,
      };

      if (values.bpSystolic && values.bpDiastolic) {
        vitalsData.bloodPressure = {
          systolic: parseInt(values.bpSystolic),
          diastolic: parseInt(values.bpDiastolic),
        };
      }

      if (values.bloodSugar) {
        vitalsData.bloodSugar = {
          value: parseFloat(values.bloodSugar),
          type: values.bloodSugarType,
        };
      }

      if (values.weight) {
        vitalsData.weight = { value: parseFloat(values.weight) };
      }

      if (values.height) {
        vitalsData.height = { value: parseFloat(values.height) };
      }

      if (values.heartRate) {
        vitalsData.heartRate = { value: parseInt(values.heartRate) };
      }

      if (values.temperature) {
        vitalsData.temperature = { value: parseFloat(values.temperature) };
      }

      if (values.oxygenLevel) {
        vitalsData.oxygenLevel = { value: parseInt(values.oxygenLevel) };
      }

      setLoading(true);
      try {
        await dispatch(addVitals(vitalsData)).unwrap();
        toast.success("✅ Vitals added successfully! / Vitals kamyabi se add ho gaye!");
        navigate("/dashboard");
      } catch (error) {
        toast.error(error || "❌ Failed to add vitals / Vitals add nahi ho sake");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-500 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Activity className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add Manual Vitals
              </h1>
              <p className="text-gray-600">
                Apne health vitals manually add karein
              </p>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Show general error if no vital is filled */}
            {formik.touched.bpSystolic && formik.errors.bpSystolic && 
             !formik.values.bpSystolic && !formik.values.bloodSugar && 
             !formik.values.weight && !formik.values.height && 
             !formik.values.heartRate && !formik.values.temperature && 
             !formik.values.oxygenLevel && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-red-700 text-sm">
                  {formik.errors.bpSystolic}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Date *
              </label>
              <input
                type="date"
                name="recordDate"
                value={formik.values.recordDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                max={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                  formik.touched.recordDate && formik.errors.recordDate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.recordDate && formik.errors.recordDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formik.errors.recordDate}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (Systolic)
                </label>
                <input
                  type="number"
                  name="bpSystolic"
                  value={formik.values.bpSystolic}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="120"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                    formik.touched.bpSystolic && formik.errors.bpSystolic
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <span className="text-xs text-gray-500">Upper number (mmHg)</span>
                {formik.touched.bpSystolic && formik.errors.bpSystolic && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.bpSystolic}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (Diastolic)
                </label>
                <input
                  type="number"
                  name="bpDiastolic"
                  value={formik.values.bpDiastolic}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="80"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                    formik.touched.bpDiastolic && formik.errors.bpDiastolic
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <span className="text-xs text-gray-500">Lower number (mmHg)</span>
                {formik.touched.bpDiastolic && formik.errors.bpDiastolic && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.bpDiastolic}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Sugar (mg/dL)
                </label>
                <input
                  type="number"
                  name="bloodSugar"
                  value={formik.values.bloodSugar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                    formik.touched.bloodSugar && formik.errors.bloodSugar
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.bloodSugar && formik.errors.bloodSugar && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.bloodSugar}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sugar Type
                </label>
                <select
                  name="bloodSugarType"
                  value={formik.values.bloodSugarType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="fasting">Fasting</option>
                  <option value="random">Random</option>
                  <option value="post-meal">Post-Meal</option>
                  <option value="hba1c">HbA1c</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="70"
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                    formik.touched.weight && formik.errors.weight
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.weight && formik.errors.weight && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.weight}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="170"
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                    formik.touched.height && formik.errors.height
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.height && formik.errors.height && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.height}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formik.values.heartRate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="72"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                    formik.touched.heartRate && formik.errors.heartRate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.heartRate && formik.errors.heartRate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.heartRate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formik.values.temperature}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="37.0"
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                    formik.touched.temperature && formik.errors.temperature
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.temperature && formik.errors.temperature && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.temperature}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oxygen Level (%)
                </label>
                <input
                  type="number"
                  name="oxygenLevel"
                  value={formik.values.oxygenLevel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="98"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                    formik.touched.oxygenLevel && formik.errors.oxygenLevel
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.oxygenLevel && formik.errors.oxygenLevel && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.oxygenLevel}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
                <span className="text-gray-500 text-xs ml-2">(Koi bhi additional notes)</span>
              </label>
              <textarea
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none ${
                  formik.touched.notes && formik.errors.notes
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="E.g., Feeling tired today / Aaj thakan mehsoos ho rahi hai..."
              />
              {formik.touched.notes && formik.errors.notes && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formik.errors.notes}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !formik.isValid}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Saving Vitals... / Save ho raha hai...</span>
                </>
              ) : (
                <>
                  <Activity className="w-6 h-6" />
                  <span>Save Vitals / Vitals Save Karein</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
            <p className="text-sky-800 text-sm">
              <strong>💡 Tip / Mashwara:</strong> Fill in at least one vital sign. You don't need to fill all fields.
              <br />
              <span className="text-sky-700">Kam az kam ek vital sign zaroor bharein. Sab fields ka bharna zaroori nahi hai.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVitals;
