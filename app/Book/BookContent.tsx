"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function BookContent() {
  const searchParams = useSearchParams();
  const service = searchParams.get('service');
  const price = searchParams.get('price');
  const description = searchParams.get('description');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Set current date and time as default
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setFormData(prev => ({
      ...prev,
      date: currentDate,
      time: currentTime
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save booking to localStorage
      const booking = {
        id: Date.now(),
        service,
        price,
        description,
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      const existingBookings = JSON.parse(localStorage.getItem('driverBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('driverBookings', JSON.stringify(existingBookings));

      alert('Booking submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        date: '',
        time: '',
        message: ''
      });

    } catch (error) {
      alert('Error submitting booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service || !price) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Booking</h1>
          <p className="mb-4">Please select a service first.</p>
          <Link href="/Services/Cars" className="text-blue-400 hover:text-blue-300">
            Go back to services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/mechanic4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Back Arrow */}
      <Link href="/Services/Cars" className="absolute top-6 left-6 z-20">
        <button className="text-white hover:text-gray-300 transition duration-200 bg-black/50 rounded-full p-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </Link>

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Service Info Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🚗</div>
            <h1 className="text-3xl font-bold text-white mb-2">Book Driver Service</h1>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <h2 className="text-xl font-bold text-white">{service}</h2>
              <p className="text-white/80 mt-1">{description}</p>
              <p className="text-green-300 font-bold text-lg mt-2">K{price}</p>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-white/80 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/80 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition duration-200"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white/80 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition duration-200"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-white/80 mb-2">Pickup Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition duration-200"
                  placeholder="Enter pickup address"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-white/80 mb-2">Preferred Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition duration-200"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-white/80 mb-2">Preferred Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition duration-200"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-white/80 mb-2">Additional Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition duration-200"
                placeholder="Any special requirements or notes..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition duration-200 transform hover:scale-105 ${
                isSubmitting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-lg'
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Processing Booking...
                </div>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm text-white/80">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>We'll contact you within 24 hours to confirm</span>
            </div>
            <div className="flex items-center text-sm text-white/80">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              <span>Payment can be made after service confirmation</span>
            </div>
            <div className="flex items-center text-sm text-white/80">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              <span>24/7 customer support available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}