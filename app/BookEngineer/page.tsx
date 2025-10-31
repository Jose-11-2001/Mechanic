"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BookEngineer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    location: "",
    datetime: "",
    serviceType: "",
    servicePrice: "",
    vehicleDetails: "",
    problemDescription: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get service data from URL parameters
  useEffect(() => {
    const service = searchParams.get('service');
    const price = searchParams.get('price');
    const description = searchParams.get('description');
    
    if (service) {
      setForm(prev => ({
        ...prev,
        serviceType: service,
        servicePrice: price || ""
      }));
    }
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const err: Record<string, string> = {};
    if (!form.firstName.trim()) err.firstName = "First name is required";
    if (!form.lastName.trim()) err.lastName = "Last name is required";
    if (!form.phone.trim()) err.phone = "Phone number is required";
    if (!form.location.trim()) err.location = "Location is required";
    if (!form.datetime.trim()) err.datetime = "Date & time is required";
    if (!form.vehicleDetails.trim()) err.vehicleDetails = "Vehicle details are required";
    if (!form.problemDescription.trim()) err.problemDescription = "Problem description is required";
    return err;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setSubmitting(true);
    try {
      // Example: send to an API route (create /api/engineer-bookings to accept this)
      // await fetch('/api/engineer-bookings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form),
      // });

      // For now show success message and clear (or navigate)
      setSuccess(true);
      setForm({ 
        firstName: "", 
        lastName: "", 
        phone: "", 
        email: "", 
        location: "", 
        datetime: "",
        serviceType: "",
        servicePrice: "",
        vehicleDetails: "",
        problemDescription: ""
      });
      // router.push('/book/engineer/confirmation') // optionally navigate to a confirmation page
    } catch (err) {
      setErrors({ form: "Failed to submit. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center py-12 px-4 relative"
      style={{
        backgroundImage: "url('/mechanic4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Back Arrow */}
      <Link href="/Services/Engineers" className="absolute top-6 left-6 z-20">
        <button className="text-white hover:text-gray-300 transition duration-200 bg-black/30 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/20 relative z-10"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Book Engineering Service</h2>

        {/* Display selected service info */}
        {form.serviceType && (
          <div className="mb-6 p-4 bg-blue-900/40 rounded-lg border border-blue-400/30">
            <h3 className="text-lg font-semibold text-white">Selected Service</h3>
            <p className="text-white/90">{form.serviceType}</p>
            {form.servicePrice && (
              <p className="text-green-300 font-bold">K{form.servicePrice}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-white/90">
            <span className="mb-1">First name *</span>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="p-2 rounded bg-white/20 text-white border border-white/30 placeholder-white/60"
              placeholder="Joseph"
            />
            {errors.firstName && <span className="text-xs text-red-300 mt-1">{errors.firstName}</span>}
          </label>

          <label className="flex flex-col text-white/90">
            <span className="mb-1">Last name *</span>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="p-2 rounded bg-white/20 text-white border border-white/30 placeholder-white/60"
              placeholder="Mbukwa"
            />
            {errors.lastName && <span className="text-xs text-red-300 mt-1">{errors.lastName}</span>}
          </label>

          <label className="flex flex-col text-white/90">
            <span className="mb-1">Phone *</span>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="p-2 rounded bg-white/20 text-white border border-white/30 placeholder-white/60"
              placeholder="+265886663959"
            />
            {errors.phone && <span className="text-xs text-red-300 mt-1">{errors.phone}</span>}
          </label>

          <label className="flex flex-col text-white/90">
            <span className="mb-1">Email (optional)</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="p-2 rounded bg-white/20 text-white border border-white/30 placeholder-white/60"
              placeholder="bodeautomotive@gmail.com"
            />
          </label>

          <label className="flex flex-col text-white/90 md:col-span-2">
            <span className="mb-1">Vehicle Details *</span>
            <input
              name="vehicleDetails"
              value={form.vehicleDetails}
              onChange={handleChange}
              className="p-2 rounded bg-white/20 text-white border border-white/30 placeholder-white/60"
              placeholder="e.g., Toyota Corolla 2018, Registration ABC123"
            />
            {errors.vehicleDetails && <span className="text-xs text-red-300 mt-1">{errors.vehicleDetails}</span>}
          </label>

          <label className="flex flex-col text-white/90 md:col-span-2">
            <span className="mb-1">Problem Description *</span>
            <textarea
              name="problemDescription"
              value={form.problemDescription}
              onChange={handleChange}
              rows={3}
              className="p-2 rounded bg-white/20 text-white border border-white/30 placeholder-white/60 resize-none"
              placeholder="Please describe the issue with your vehicle..."
            />
            {errors.problemDescription && <span className="text-xs text-red-300 mt-1">{errors.problemDescription}</span>}
          </label>

          <label className="flex flex-col text-white/90 md:col-span-2">
            <span className="mb-1">Location *</span>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="p-2 rounded bg-white/20 text-white border border-white/30 placeholder-white/60"
              placeholder="Your address or preferred service location"
            />
            {errors.location && <span className="text-xs text-red-300 mt-1">{errors.location}</span>}
          </label>

          <label className="flex flex-col text-white/90 md:col-span-2">
            <span className="mb-1">Preferred Date & Time *</span>
            <input
              name="datetime"
              type="datetime-local"
              value={form.datetime}
              onChange={handleChange}
              className="p-2 rounded bg-white/20 text-white border border-white/30"
            />
            {errors.datetime && <span className="text-xs text-red-300 mt-1">{errors.datetime}</span>}
          </label>
        </div>

        {errors.form && <p className="text-red-300 mt-3">{errors.form}</p>}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded shadow-lg transition duration-200 transform hover:scale-105"
          >
            {submitting ? "Submitting..." : "Confirm Booking"}
          </button>

          {success && <span className="text-green-300 font-semibold">Booking request sent successfully!</span>}
        </div>
      </form>
    </main>
  );
}