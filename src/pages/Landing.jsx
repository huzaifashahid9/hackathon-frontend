import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Heart,
  FileText,
  Activity,
  Shield,
  Menu,
  X,
  ChevronDown,
  CheckCircle,
  Star,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Users,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Contact Form Validation Schema
const contactValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  subject: Yup.string()
    .min(5, "Subject must be at least 5 characters")
    .required("Subject is required"),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
    .nullable(),
});

const Landing = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  // Contact Form
  const contactForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validationSchema: contactValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setContactLoading(true);
      try {
        const response = await axios.post(`${API_URL}/contact`, values);
        toast.success(
          "✅ Message sent successfully! We'll get back to you soon."
        );
        resetForm();
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "❌ Failed to send message. Please try again."
        );
      } finally {
        setContactLoading(false);
      }
    },
  });

  // FAQ Data
  const faqs = [
    {
      question: "What is HealthMate?",
      answer:
        "HealthMate is an AI-powered personal health companion that helps you manage your medical reports, track vitals, and get easy-to-understand health insights in both English and Roman Urdu.",
    },
    {
      question: "Is my health data secure?",
      answer:
        "Yes! Your health data is encrypted and stored securely. We use industry-standard security practices and only you have access to your medical records.",
    },
    {
      question: "How does the AI report analysis work?",
      answer:
        "Our AI (powered by Google Gemini) reads your uploaded medical reports (PDFs or images) and provides simple explanations, highlights abnormal values, and suggests questions to ask your doctor.",
    },
    {
      question: "Can I use HealthMate without uploading reports?",
      answer:
        "Absolutely! You can manually track your vitals like blood pressure, sugar levels, weight, and more even without uploading any lab reports.",
    },
    {
      question: "Is HealthMate free to use?",
      answer:
        "Yes, HealthMate is completely free to use. Just create an account and start managing your health records.",
    },
    {
      question: "Can HealthMate replace my doctor?",
      answer:
        "No. HealthMate is for understanding and tracking your health data only. Always consult your doctor for medical advice and treatment decisions.",
    },
    {
      question: "What languages does HealthMate support?",
      answer:
        "HealthMate provides bilingual support in English and Roman Urdu, making it accessible for everyone.",
    },
    {
      question: "What file formats can I upload?",
      answer:
        "You can upload medical reports in PDF format or as images (JPG, PNG). Our AI can read both types of files.",
    },
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: "Ahmed Khan",
      role: "Regular User",
      image: "👨‍💼",
      rating: 5,
      text: "HealthMate ne meri zindagi asaan kar di! Ab sab reports ek jagah hain aur AI samajh bhi deta hai. Bahut helpful!",
    },
    {
      name: "Fatima Ali",
      role: "Healthcare Professional",
      image: "👩‍⚕️",
      rating: 5,
      text: "As a doctor, I recommend HealthMate to my patients. It helps them track their health and ask better questions during visits.",
    },
    {
      name: "Bilal Ahmed",
      role: "Diabetes Patient",
      image: "👨",
      rating: 5,
      text: "I track my sugar levels daily. The timeline view helps me see patterns and manage my diabetes better. Amazing app!",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-sky-100 p-2 rounded-lg">
                <Heart className="w-8 h-8 text-sky-500" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-sky-500">Health </span>
                <span className="text-gray-900">Mate</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-sky-500 font-medium transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-sky-500 font-medium transition"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-sky-500 font-medium transition"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-gray-700 hover:text-sky-500 font-medium transition"
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-sky-500 font-medium transition"
              >
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sky-500 hover:text-sky-600 font-semibold transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <a
                href="#features"
                className="block py-2 text-gray-700 hover:text-sky-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block py-2 text-gray-700 hover:text-sky-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="block py-2 text-gray-700 hover:text-sky-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="block py-2 text-gray-700 hover:text-sky-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="block py-2 text-gray-700 hover:text-sky-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-sky-500 font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-sky-500 text-white px-6 py-2 rounded-lg font-semibold text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-sky-100 p-4 rounded-full animate-bounce">
                <Heart className="w-16 h-16 text-sky-500" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="text-sky-500">Health </span>Mate
            </h1>
            <p className="text-3xl text-emerald-600 font-semibold mb-4">
              Sehat ka Smart Dost
            </p>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your personal AI-powered health companion. Upload medical reports,
              track vitals, and get instant explanations in English and Roman
              Urdu.
            </p>

            {!isAuthenticated && (
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/register"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-white hover:bg-gray-50 text-sky-500 px-10 py-4 rounded-xl font-bold text-lg transition-all border-2 border-sky-500 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-sky-500">100%</div>
                <div className="text-gray-600 mt-2">Free</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-500">AI</div>
                <div className="text-gray-600 mt-2">Powered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500">🔒</div>
                <div className="text-gray-600 mt-2">Secure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your health in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-sky-500 p-4 rounded-xl w-fit mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Upload Medical Reports
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upload PDFs or images of lab reports. AI automatically reads and
                explains results in simple language.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-emerald-500 p-4 rounded-xl w-fit mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Track Vital Signs
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Manually log BP, blood sugar, weight, heart rate, and more. View
                trends over time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-amber-500 p-4 rounded-xl w-fit mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your health data is encrypted and stored securely. Only you have
                access to your records.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-purple-500 p-4 rounded-xl w-fit mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Bilingual Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get explanations in both English and Roman Urdu. AI speaks your
                language!
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-pink-500 p-4 rounded-xl w-fit mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Health Timeline
              </h3>
              <p className="text-gray-600 leading-relaxed">
                View all your reports and vitals in chronological order. Track
                your health journey.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="bg-indigo-500 p-4 rounded-xl w-fit mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Family Friendly
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Manage health records for yourself and your family members in
                one account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 3 simple steps / Sirf 3 asaan steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start gap-6 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="bg-sky-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-lg">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Your Free Account
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Sign up in seconds with just your name and email. No credit
                  card required. / Apna naam aur email se account banayein.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="bg-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-lg">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Reports or Add Vitals
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Upload PDF/image medical reports OR manually enter your BP,
                  sugar, weight, etc. / Reports upload karein ya vitals manually
                  add karein.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="bg-amber-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-lg">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Get AI-Powered Insights
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Receive easy-to-understand explanations in English and Roman
                  Urdu. Track your health timeline. / AI se samajh ke results
                  hasil karein.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from real people / Asli log, asli reviews
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">Aapke sawalat ke jawabat</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-lg pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-sky-500 flex-shrink-0 transition-transform ${
                      activeAccordion === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === index && (
                  <div className="px-6 py-4 bg-sky-50 border-t border-sky-100">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you / Koi sawal? Hum se
              rabta karein
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-sky-100 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-sky-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">support@healthmate.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+92 300 1234567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Location</h4>
                      <p className="text-gray-600">Karachi, Pakistan</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-sky-50 to-emerald-50 p-6 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-2">💡 Quick Tip</h4>
                <p className="text-gray-700">
                  We typically respond within 24-48 hours. For urgent matters,
                  please call us directly.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl">
              <form onSubmit={contactForm.handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.values.name}
                    onChange={contactForm.handleChange}
                    onBlur={contactForm.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                      contactForm.touched.name && contactForm.errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Your name"
                  />
                  {contactForm.touched.name && contactForm.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {contactForm.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.values.email}
                    onChange={contactForm.handleChange}
                    onBlur={contactForm.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                      contactForm.touched.email && contactForm.errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="your@email.com"
                  />
                  {contactForm.touched.email && contactForm.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {contactForm.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.values.phone}
                    onChange={contactForm.handleChange}
                    onBlur={contactForm.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                      contactForm.touched.phone && contactForm.errors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="03001234567"
                  />
                  {contactForm.touched.phone && contactForm.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {contactForm.errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.values.subject}
                    onChange={contactForm.handleChange}
                    onBlur={contactForm.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                      contactForm.touched.subject && contactForm.errors.subject
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="What's this about?"
                  />
                  {contactForm.touched.subject &&
                    contactForm.errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {contactForm.errors.subject}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.values.message}
                    onChange={contactForm.handleChange}
                    onBlur={contactForm.handleBlur}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none ${
                      contactForm.touched.message && contactForm.errors.message
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Your message "
                  />
                  {contactForm.touched.message &&
                    contactForm.errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {contactForm.errors.message}
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={contactLoading || !contactForm.isValid}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {contactLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending your message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-8 h-8 text-sky-400" />
                <span className="text-2xl font-bold">
                  <span className="text-sky-400">Health</span>Mate
                </span>
              </div>
              <p className="text-gray-400">Sehat ka Smart Dost 💚</p>
              <p className="text-gray-400 mt-2">
                Your AI-powered personal health companion.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-sky-400 transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-sky-400 transition"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 hover:text-sky-400 transition"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-400 hover:text-sky-400 transition"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/register"
                    className="text-gray-400 hover:text-sky-400 transition"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-sky-400 transition"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-sky-400 transition"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-sky-400 transition"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@healthmate.com</li>
                <li>📱 +92 300 1234567</li>
                <li>📍 Karachi, Pakistan</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2025 HealthMate. All rights reserved.
              </p>
              <div className="bg-amber-50 px-4 py-2 rounded-lg">
                <p className="text-amber-800 text-sm font-medium">
                  ⚕️ For understanding only, not medical advice / Sirf samajhne
                  ke liye, ilaaj ke liye nahi
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
