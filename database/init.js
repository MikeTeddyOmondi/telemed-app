const mysql = require("mysql2/promise");

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_NAME,
} = require("../config");

const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
};

async function initialiseDatabase() {
  // create a db connection
  const db = await mysql.createConnection(dbConfig);

  // create database, tables and relationships
  try {
    await db.query("CREATE DATABASE IF NOT EXISTS telemed_app;");

    // use telemed_app;
    await db.changeUser({ database: "telemed_app" });

    // Create the 'roles' table if it doesn't exist
    const rolesTable = `
      CREATE TABLE IF NOT EXISTS roles (
          role_id INT PRIMARY KEY AUTO_INCREMENT,
          role VARCHAR(100) NOT NULL UNIQUE
      );
    `;
    await db.query(rolesTable);
    // console.log("Roles table created or already exists");

    // Create the 'users' table if it doesn't exist
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
          user_id INT PRIMARY KEY AUTO_INCREMENT,
          role_id INT DEFAULT 3,
          email VARCHAR(100) NOT NULL UNIQUE,
          username VARCHAR(50) NOT NULL,
          password VARCHAR(100) NOT NULL,
          FOREIGN KEY (role_id) REFERENCES roles(role_id)
      );
    `;
    await db.query(usersTable);
    // console.log("Users table created or already exists");

    // Create the 'patients' table
    const patientsTable = `
      CREATE TABLE IF NOT EXISTS patients (
          patient_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          date_of_birth DATE,
          gender VARCHAR(10),
          language VARCHAR(20)
      )
    `;
    await db.query(patientsTable);
    // console.log("Patients table created or already exists");

    // Create the 'providers' table
    const doctorsTable = `
      CREATE TABLE IF NOT EXISTS doctors (
          doctor_id INT PRIMARY KEY,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          doctor_specialty VARCHAR(50) NOT NULL,
          email_address VARCHAR(50),
          phone_number VARCHAR(20),
          date_joined DATE NOT NULL
      )
    `;
    await db.query(doctorsTable);
    // console.log("Doctors table created or already exists");

    // Create the 'appointments' table if it doesn't exist
    const appointmentsTable = `
      CREATE TABLE IF NOT EXISTS appointments (
          appointment_id INT PRIMARY KEY AUTO_INCREMENT,
          doctor_id INT NOT NULL,
          patient_id INT NOT NULL,
          description VARCHAR(100) NOT NULL,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          appointment_status_id INT NOT NULL DEFAULT 1,
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
          FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
      );
    `;
    await db.query(appointmentsTable);
    // console.log("Appointments table created or already exists");

    // Create the 'appointments status' table if it doesn't exist
    const appointmentsStatusTable = `
      CREATE TABLE IF NOT EXISTS appointments_status (
          status_id INT PRIMARY KEY AUTO_INCREMENT,
          status_name VARCHAR(100) NOT NULL,
          status_description VARCHAR(200)
      );
    `;
    await db.query(appointmentsStatusTable);
    // console.log("Appointments status table created or already exists");

    // Create the 'visits' table
    const visitsTable = `
      CREATE TABLE IF NOT EXISTS visits (
          visit_id INT PRIMARY KEY AUTO_INCREMENT,
          patient_id INT,
          doctor_id INT,
          date_of_visit DATE NOT NULL,
          date_scheduled DATE NOT NULL,
          visit_department_id INT NOT NULL,
          visit_type VARCHAR(50) NOT NULL,
          blood_pressure_systollic INT,
          blood_pressure_diastollic DECIMAL(5,2),
          pulse DECIMAL(5,2),
          visit_status VARCHAR(50) NOT NULL,
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
          FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
      )
    `;
    await db.query(visitsTable);
    // console.log("Visits table created or already exists");

    // Create the 'ed_visits' table
    const edVisitsTable = `
      CREATE TABLE IF NOT EXISTS ed_visits (
          ed_visit_id INT PRIMARY KEY AUTO_INCREMENT,
          visit_id INT,
          patient_id INT,
          acuity INT NOT NULL,
          reason_for_visit VARCHAR(100) NOT NULL,
          disposition VARCHAR(50) NOT NULL,
          FOREIGN KEY (visit_id) REFERENCES visits(visit_id) ON DELETE CASCADE,
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
      )
    `;
    await db.query(edVisitsTable);
    // console.log("ED Visits table created or already exists");

    // Create the 'admissions' table
    const admissionsTable = `
      CREATE TABLE IF NOT EXISTS admissions (
          admission_id INT PRIMARY KEY AUTO_INCREMENT,
          patient_id INT,
          admission_date DATE NOT NULL,
          discharge_date DATE NOT NULL,
          discharge_disposition VARCHAR(50) NOT NULL,
          service VARCHAR(50) NOT NULL,
          primary_diagnosis VARCHAR(100) NOT NULL,
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
      )
    `;
    await db.query(admissionsTable);
    // console.log("Admissions table created or already exists");

    // Create the 'discharges' table
    const dischargesTable = `
      CREATE TABLE IF NOT EXISTS discharges (
          discharge_id INT PRIMARY KEY AUTO_INCREMENT,
          admission_id INT,
          patient_id INT,
          discharge_date DATE NOT NULL,
          discharge_disposition VARCHAR(50) NOT NULL,
          FOREIGN KEY (admission_id) REFERENCES admissions(admission_id) ON DELETE CASCADE,
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
      )
    `;
    await db.query(dischargesTable);
    // console.log("Discharges table created or already exists");

    console.log("[#] Database migrations completed!");
  } catch (err) {
    console.error("Error initializing database: ", err);
  } finally {
    // Close the database connection
    await db.end();
    // console.log("Database migrations: connection closed!");
  }
}

function pool() {
  return mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10, // pool size
    queueLimit: 0,
  });
}

module.exports = { initialiseDatabase, pool };
