export const mockVehicles = [
  { id: 1, registration: 'TR-204', name: 'Aurora 8', type: 'Van', capacity: '1.8T', odometer: '18420', status: 'Available' },
  { id: 2, registration: 'TR-221', name: 'Evergreen X', type: 'Truck', capacity: '6.2T', odometer: '32180', status: 'On Route' },
  { id: 3, registration: 'TR-312', name: 'Northstar', type: 'Van', capacity: '2.1T', odometer: '24670', status: 'Maintenance' },
  { id: 4, registration: 'TR-407', name: 'Harbor Pro', type: 'Truck', capacity: '7.4T', odometer: '40110', status: 'Available' },
];

export const mockDrivers = [
  { id: 1, driver: 'Mina Chen', license: 'DL-2048', safetyScore: '98', expiry: '2026-08-19', status: 'On Duty' },
  { id: 2, driver: 'Aarav Patel', license: 'DL-1187', safetyScore: '91', expiry: '2026-11-02', status: 'Available' },
  { id: 3, driver: 'Selena Ortiz', license: 'DL-4301', safetyScore: '87', expiry: '2025-09-10', status: 'Resting' },
  { id: 4, driver: 'Owen Brooks', license: 'DL-9922', safetyScore: '95', expiry: '2026-05-27', status: 'On Duty' },
];

export const mockTrips = [
  { id: 1, route: 'Port District → North Hub', vehicle: 'TR-204', driver: 'Mina Chen', cargo: '1.6T', status: 'Dispatched', eta: '14:20' },
  { id: 2, route: 'Harbor Line → Riverside', vehicle: 'TR-221', driver: 'Aarav Patel', cargo: '5.1T', status: 'Planned', eta: '18:00' },
  { id: 3, route: 'Airport → Midtown', vehicle: 'TR-407', driver: 'Owen Brooks', cargo: '2.8T', status: 'Completed', eta: 'Completed' },
];

import { formatCurrency } from './formatCurrency';

export const mockMaintenance = [
  { id: 1, vehicle: 'TR-312', issue: 'Brake inspection', status: 'In Progress', cost: formatCurrency(62000), date: '2026-07-10' },
  { id: 2, vehicle: 'TR-221', issue: 'Tire rotation', status: 'Scheduled', cost: formatCurrency(24000), date: '2026-07-14' },
  { id: 3, vehicle: 'TR-204', issue: 'Battery replacement', status: 'Resolved', cost: formatCurrency(41000), date: '2026-07-06' },
];

export const mockFuelLogs = [
  { id: 1, vehicle: 'TR-204', liters: '48.5', cost: formatCurrency(112000), date: '2026-07-11' },
  { id: 2, vehicle: 'TR-221', liters: '84.0', cost: formatCurrency(192000), date: '2026-07-10' },
  { id: 3, vehicle: 'TR-407', liters: '61.2', cost: formatCurrency(139000), date: '2026-07-09' },
];

export const mockExpenses = [
  { id: 1, vehicle: 'TR-204', category: 'Toll', amount: formatCurrency(18000), date: '2026-07-11' },
  { id: 2, vehicle: 'TR-221', category: 'Parking', amount: formatCurrency(24000), date: '2026-07-10' },
  { id: 3, vehicle: 'TR-312', category: 'Service', amount: formatCurrency(69000), date: '2026-07-08' },
];

export const mockNotifications = [
  { id: 1, title: 'Maintenance window opened', message: 'TR-312 requires a brake inspection before noon.', time: '10 min ago', unread: true, priority: 'High' },
  { id: 2, title: 'Fuel budget alert', message: 'Weekly fuel spend is 12% above target.', time: '42 min ago', unread: true, priority: 'Medium' },
  { id: 3, title: 'Driver schedules updated', message: 'Two routes were reassigned for tomorrow.', time: '2 hrs ago', unread: false, priority: 'Medium' },
];

export const mockReportCards = [
  { title: 'Fuel Efficiency', value: '8.4 km/L', delta: '+4.2% vs last month' },
  { title: 'Vehicle ROI', value: '26.8%', delta: '+1.1% vs target' },
  { title: 'Fleet Utilization', value: '83%', delta: '+7% growth' },
];

export const mockTripStats = [
  { label: 'Active Trips', value: '9' },
  { label: 'On-Time Delivery', value: '94%' },
  { label: 'Avg. Arrival Delay', value: '6 min' },
];

export const mockReports = [
  { label: 'Fuel Efficiency', value: '8.4 km/L', trend: '+4.2%' },
  { label: 'Vehicle ROI', value: '26.8%', trend: '+1.1%' },
  { label: 'Fleet Utilization', value: '83%', trend: '+7%' },
  { label: 'Operational Cost', value: formatCurrency(1830000), trend: '-2.4%' },
];

export const dashboardKpis = [
  { label: 'Active Vehicles', value: '24', change: '+3 this week' },
  { label: 'Available Vehicles', value: '12', change: '50% ready' },
  { label: 'Vehicles in Maintenance', value: '4', change: '1 critical' },
  { label: 'Drivers On Duty', value: '18', change: '3 on standby' },
  { label: 'Active Trips', value: '9', change: '6 in transit' },
  { label: 'Fleet Utilization', value: '83%', change: '+6% vs last month' },
  { label: 'Fuel Cost', value: formatCurrency(420000), change: 'Weekly' },
  { label: 'Operational Cost', value: formatCurrency(890000), change: 'Monthly' },
];
