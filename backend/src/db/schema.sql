-- ============================================================
-- TransitOps Database Schema (PostgreSQL)
-- ============================================================

DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS fuel_logs CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS vehicle_status;
DROP TYPE IF EXISTS driver_status;
DROP TYPE IF EXISTS trip_status;
DROP TYPE IF EXISTS maintenance_status;

CREATE TYPE user_role AS ENUM ('fleet_manager', 'driver', 'safety_officer', 'financial_analyst', 'admin');
CREATE TYPE vehicle_status AS ENUM ('Available', 'On Trip', 'In Shop', 'Retired');
CREATE TYPE driver_status AS ENUM ('Available', 'On Trip', 'Off Duty', 'Suspended');
CREATE TYPE trip_status AS ENUM ('Draft', 'Dispatched', 'Completed', 'Cancelled');
CREATE TYPE maintenance_status AS ENUM ('Open', 'Closed');

-- ------------------------------------------------------------
-- Users & RBAC
-- ------------------------------------------------------------
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'driver',
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Vehicles
-- ------------------------------------------------------------
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(40) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(60) NOT NULL,
    max_load_capacity NUMERIC(10,2) NOT NULL CHECK (max_load_capacity > 0),
    odometer NUMERIC(12,2) NOT NULL DEFAULT 0,
    acquisition_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    status vehicle_status NOT NULL DEFAULT 'Available',
    region VARCHAR(80),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Drivers
-- ------------------------------------------------------------
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    license_number VARCHAR(60) UNIQUE NOT NULL,
    license_category VARCHAR(40) NOT NULL,
    license_expiry_date DATE NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    safety_score NUMERIC(5,2) NOT NULL DEFAULT 100,
    status driver_status NOT NULL DEFAULT 'Available',
    region VARCHAR(80),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Trips
-- ------------------------------------------------------------
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    source VARCHAR(160) NOT NULL,
    destination VARCHAR(160) NOT NULL,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    driver_id INTEGER NOT NULL REFERENCES drivers(id),
    cargo_weight NUMERIC(10,2) NOT NULL CHECK (cargo_weight > 0),
    planned_distance NUMERIC(10,2) NOT NULL CHECK (planned_distance > 0),
    actual_distance NUMERIC(10,2),
    fuel_consumed NUMERIC(10,2),
    revenue NUMERIC(12,2) DEFAULT 0,
    status trip_status NOT NULL DEFAULT 'Draft',
    created_by INTEGER REFERENCES users(id),
    dispatched_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Maintenance Logs
-- ------------------------------------------------------------
CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    service_type VARCHAR(120) NOT NULL,
    description TEXT,
    cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    status maintenance_status NOT NULL DEFAULT 'Open',
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Fuel Logs
-- ------------------------------------------------------------
CREATE TABLE fuel_logs (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    trip_id INTEGER REFERENCES trips(id),
    liters NUMERIC(10,2) NOT NULL CHECK (liters > 0),
    cost NUMERIC(12,2) NOT NULL CHECK (cost >= 0),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Expenses (tolls, misc - maintenance costs pulled from maintenance_logs)
-- ------------------------------------------------------------
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
    category VARCHAR(60) NOT NULL,
    description TEXT,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_maintenance_vehicle ON maintenance_logs(vehicle_id);
CREATE INDEX idx_fuel_vehicle ON fuel_logs(vehicle_id);
CREATE INDEX idx_expenses_vehicle ON expenses(vehicle_id);
