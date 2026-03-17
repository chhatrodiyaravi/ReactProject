import { Header } from "../components/header";
import { Footer } from "../components/footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { contactApi } from "../services/api";
import { isValidEmail, isValidName, isValidPhone } from "../utils/validation";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFieldErrors((prev) => {
      if (!prev[e.target.name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[e.target.name];
      return nextErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const nextErrors = {};

      if (!formData.name.trim()) {
        nextErrors.name = "Name is required.";
      } else if (!isValidName(formData.name)) {
        nextErrors.name = "Please enter a valid name.";
      }

      if (!formData.email.trim()) {
        nextErrors.email = "Email is required.";
      } else if (!isValidEmail(formData.email)) {
        nextErrors.email = "Please enter a valid email address.";
      }

      if (formData.phone.trim() && !isValidPhone(formData.phone)) {
        nextErrors.phone = "Phone number must contain exactly 10 digits.";
      }

      if (!formData.subject.trim()) {
        nextErrors.subject = "Subject is required.";
      } else if (formData.subject.trim().length < 3) {
        nextErrors.subject = "Subject must be at least 3 characters.";
      }

      if (!formData.message.trim()) {
        nextErrors.message = "Message is required.";
      } else if (formData.message.trim().length < 10) {
        nextErrors.message = "Message must be at least 10 characters long.";
      }

      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors);
        setError("Please correct the highlighted fields.");
        setLoading(false);
        return;
      }

      // Submit to API
      await contactApi.submit({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      subdetails: "Mon-Sun, 8:00 AM - 10:00 PM",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: "support@foodhub.com",
      subdetails: "We'll respond within 24 hours",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office",
      details: "123 Food Street, Culinary District",
      subdetails: "New York, NY 10001",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: "Monday - Sunday",
      subdetails: "8:00 AM - 10:00 PM",
    },
  ];

  const faqs = [
    {
      question: "How long does delivery take?",
      answer:
        "Most orders are delivered within 30-45 minutes, depending on your location and restaurant availability.",
    },
    {
      question: "What are the delivery charges?",
      answer:
        "Delivery charges vary based on distance and order value. Many restaurants offer free delivery on orders above ₹200.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes! You can track your order in real-time from the 'My Orders' section once your order is confirmed.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and cash on delivery.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            We're here to help! Reach out to us for any questions or concerns
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 text-orange-600 rounded-full mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {info.title}
              </h3>
              <p className="text-gray-700 font-medium mb-1">{info.details}</p>
              <p className="text-sm text-gray-500">{info.subdetails}</p>
            </div>
          ))}
        </div>

        {/* Contact Form and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Send Us a Message
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  ✓ Thank you! Your message has been sent successfully. We'll
                  get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldErrors.name ? "border-red-400" : "border-gray-300"}`}
                  placeholder="John Doe"
                />
                {fieldErrors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="text"
                  inputMode="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldErrors.email ? "border-red-400" : "border-gray-300"}`}
                  placeholder="john@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldErrors.phone ? "border-red-400" : "border-gray-300"}`}
                  placeholder="Enter 10-digit phone number"
                />
                {fieldErrors.phone && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldErrors.subject ? "border-red-400" : "border-gray-300"}`}
                  placeholder="How can we help?"
                />
                {fieldErrors.subject && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={loading}
                  rows="5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldErrors.message ? "border-red-400" : "border-gray-300"}`}
                  placeholder="Tell us more about your query..."
                ></textarea>
                {fieldErrors.message && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map or Image */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-full min-h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=800&fit=crop"
                alt="Our Office"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-l-4 border-orange-600 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
