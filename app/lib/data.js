// This would typically come from a database, but for now we'll use a simple object
export const servicesData = {
  tyres: [
    { id: 1, size: '165/70R14', brand: 'Michelin', type: 'All Season', price: 85, quantity: 50 },
    { id: 2, size: '185/65R15', brand: 'Bridgestone', type: 'Touring', price: 95, quantity: 30 },
    { id: 3, size: '205/55R16', brand: 'Goodyear', type: 'Performance', price: 120, quantity: 25 },
  ],
  tubes: [
    { id: 1, size: '12-inch', type: 'Bicycle Tube', valve: 'Schrader', price: 8, quantity: 100 },
    { id: 2, size: '14-inch', type: 'Bicycle Tube', valve: 'Presta', price: 10, quantity: 80 },
  ],
  engineer: [
    { id: 1, name: 'Automobile Repair', description: 'General automobile maintenance and repair', price: 50, duration: '2 hours' },
    { id: 2, name: 'Tyre Fitting', description: 'Professional tyre fitting and balancing', price: 20, duration: '30 mins' },
  ],
  batteries: [
    { id: 1, type: 'Lead Acid Battery', capacity: '45Ah', warranty: '1 Year', price: 65, quantity: 20 },
    { id: 2, type: 'Maintenance Free', capacity: '60Ah', warranty: '2 Years', price: 85, quantity: 15 },
  ],
  oilChange: [
    { id: 1, type: 'Petrol Engine Oil', grade: '5W-30 Synthetic', price: 45, quantity: 40 },
    { id: 2, type: 'Diesel Engine Oil', grade: '15W-40 Mineral', price: 40, quantity: 35 },
  ]
};