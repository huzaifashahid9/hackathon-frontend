import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { 
  Heart, Mail, Lock, User, Loader, AlertCircle, 
  CheckCircle, Shield, FileText, Activity 
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const registerValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)/,
      "Password must contain at least one uppercase letter or number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(
          register({
            name: values.name,
            email: values.email,
            password: values.password,
          })
        ).unwrap();
        toast.success("✅ Account created successfully! / Account ban gaya!");
        navigate("/dashboard");
      } catch (error) {
        toast.error(
          error || "❌ Registration failed / Registration nahi ho saki"
        );
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex">
      {/* Left Side - Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 to-emerald-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-bold text-white">
              Health<span className="text-emerald-200">Mate</span>
            </span>
          </Link>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                Start Your Health Journey Today
              </h1>
              <p className="text-2xl text-emerald-100 font-semibold">
                Sehat ka Smart Dost 💚
              </p>
              <p className="text-xl text-white/90 mt-4 leading-relaxed">
                Join thousands of users managing their health records with AI-powered insights
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Upload Medical Reports</h3>
                  <p className="text-white/80 text-sm">AI reads and explains your reports</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Track Your Vitals</h3>
                  <p className="text-white/80 text-sm">Monitor BP, sugar, weight & more</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">100% Secure & Private</h3>
                  <p className="text-white/80 text-sm">Your data is encrypted and safe</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-white font-bold text-lg mb-3">Why Choose HealthMate?</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-emerald-200" />
                  <span>Free forever - No hidden charges</span>
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-emerald-200" />
                  <span>AI-powered health insights</span>
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-emerald-200" />
                  <span>Bilingual support (English + Urdu)</span>
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-emerald-200" />
                  <span>Access from anywhere, anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="relative z-10 text-white/80 text-sm">
          <p className="italic">"Managing health records has never been this easy!"</p>
          <p className="mt-2">- HealthMate Users</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="bg-sky-100 p-3 rounded-full">
                <Heart className="w-10 h-10 text-sky-500" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Join <span className="text-sky-500">HealthMate</span>
            </h1>
            <p className="text-gray-600 mt-2">Create your health vault today</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600 text-lg">Get started for free - No credit card required</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Your Name"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={loading || !formik.isValid || !formik.dirty}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating account... / Account ban raha hai...</span>
                </>
              ) : (
                <span>Create Account / Account Banayein</span>
              )}
            </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-sky-500 hover:text-sky-600 font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            <Link to="/" className="hover:text-sky-500 flex items-center justify-center gap-2">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
