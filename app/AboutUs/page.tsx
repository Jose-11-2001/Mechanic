"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function About() {
  const [activeTab, setActiveTab] = useState('mission');

  const teamMembers = [
    {
      name: "Calvin Bode",
      position: "Founder & Head Mechanic",
      experience: "15+ years",
      specialty: "Engine Diagnostics & Performance Tuning",
      image: "/Bode.jpg" 
    },
    {
      name: "Mishek Chirwa",
      position: "Service Manager",
      experience: "16+ months",
      specialty: "Customer Service & Quality Control",
      image: "/mishek.jpg" 
    },
    {
      name: "Joseph Mbukwa",
      position: "Programmer",
      experience: "12+ years",
      specialty: "ICT DEPARTMENT",
      image: "/Mbukwa.jpg" 
    },
    {
      name: "Brian Ndhluvu",
      position: "Engineer",
      experience: "8+ years",
      specialty: "Genuine Parts & Inventory Management",
      image: "/Braian.jpg" 
    }
  ];

  const services = [
    { name: "Engine Repair", icon: "⚙️" },
    { name: "Engineer", icon: "👨‍✈️" },
    { name: "Tubes selling", icon: "🌀" },
    { name: "Drivers", icon: "👨‍✈️" },
    { name: "Car hiring", icon: "🚗" },
    { name: "Oil Change", icon: "🛢️" },
    { name: "Tire Service", icon: "🛞" },
    { name: "Batteries selling", icon: "🔋" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="bg-black bg-opacity-80 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition duration-300">
            BODE AUTOMOTIVES
          </Link>
          <Link 
            href="/" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            ← Back Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/Mechanic.jpg')" }} // From public folder
        ></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Where <span className="text-green-400 font-bold">Performance</span> Meets <span className="text-blue-400 font-bold">Precision</span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['mission', 'story', 'team', 'services'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 ${
                  activeTab === tab 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 backdrop-blur-sm">
            {activeTab === 'mission' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-green-400">Our Mission</h2>
                  <p className="text-lg text-gray-300 mb-6">
                    At BODE AUTOMOTIVES, we are committed to delivering exceptional automotive services 
                    that combine cutting-edge technology with traditional craftsmanship. Our mission is 
                    to ensure every vehicle that leaves our shop performs at its peak potential.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">Quality workmanship guaranteed</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">Transparent pricing & honest advice</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">Customer satisfaction as our top priority</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-center text-white">Our Values</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-600 p-4 rounded-lg text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <h4 className="font-bold text-green-400">Excellence</h4>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg text-center">
                      <div className="text-3xl mb-2">🤝</div>
                      <h4 className="font-bold text-green-400">Trust</h4>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg text-center">
                      <div className="text-3xl mb-2">⚡</div>
                      <h4 className="font-bold text-green-400">Innovation</h4>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg text-center">
                      <div className="text-3xl mb-2">❤️</div>
                      <h4 className="font-bold text-green-400">Care</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'story' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-green-400">Our Story</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">From Humble Beginnings</h3>
                    <p className="text-gray-300 mb-4">
                      Founded in 2010 by Calvin Bode, what started as a small garage with just two lifts 
                      has grown into one of the most trusted automotive service centers in the region.
                    </p>
                    <p className="text-gray-300 mb-4">
                      Our journey began with a simple philosophy: treat every customer's vehicle as if it 
                      were our own, and never compromise on quality.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Growth & Excellence</h3>
                    <p className="text-gray-300 mb-4">
                      Over the years, we've invested in state-of-the-art diagnostic equipment and continuous 
                      training for our team, ensuring we stay at the forefront of automotive technology.
                    </p>
                    <p className="text-gray-300">
                      Today, we serve thousands of satisfied customers and have built a reputation for 
                      reliability and expertise that speaks for itself.
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-lg text-center">
                  <h3 className="text-2xl font-bold mb-2">13+ Years of Excellence</h3>
                  <p className="text-gray-100">Serving the community with pride and precision</p>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-green-400 text-center">Meet Our Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-6 text-center transform hover:scale-105 transition duration-300">
                      <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center overflow-hidden rounded-full border-4 border-green-500">
                        {/* Team member photo from public folder */}
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center text-2xl hidden">
                          👤
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                      <p className="text-green-400 font-semibold mb-2">{member.position}</p>
                      <p className="text-gray-400 text-sm mb-2">Experience: {member.experience}</p>
                      <p className="text-gray-300 text-sm">{member.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-green-400 text-center">Our Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {services.map((service, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg text-center transform hover:scale-105 transition duration-300">
                      <div className="text-3xl mb-2">{service.icon}</div>
                      <h3 className="font-semibold text-white">{service.name}</h3>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-center text-white">Why Choose Us?</h3>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-4xl mb-2">🔧</div>
                      <h4 className="font-bold text-green-400 mb-2">Expert Technicians</h4>
                      <p className="text-gray-300">Certified professionals with years of experience</p>
                    </div>
                    <div>
                      <div className="text-4xl mb-2">⚡</div>
                      <h4 className="font-bold text-green-400 mb-2">Quick Service</h4>
                      <p className="text-gray-300">Efficient diagnostics and timely repairs</p>
                    </div>
                    <div>
                      <div className="text-4xl mb-2">💎</div>
                      <h4 className="font-bold text-green-400 mb-2">Quality Parts</h4>
                      <p className="text-gray-300">Genuine parts with warranty coverage</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">13+</div>
            <div className="text-gray-300">Years Experience</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">5K+</div>
            <div className="text-gray-300">Vehicles Serviced</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">98%</div>
            <div className="text-gray-300">Customer Satisfaction</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
            <div className="text-gray-300">Emergency Support</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust BODE AUTOMOTIVES with their vehicles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/Login"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              Book Service Now
            </Link>
            <Link 
              href="/ContactUs" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-600 transition duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}