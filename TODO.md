[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/b84te96j)
### Assignment Title: Hands-on Project: Working with Node.js, Express, and MySQL

#### **Objective:**
The objective of this assignment is to provide students with practical experience in developing a full-stack web application using Node.js, Express, and MySQL. Students will build the backend of the telemedicine application that includes patient management, doctor scheduling, appointment booking, and user authentication for patients. This project will help students understand how to connect a Node.js application to a MySQL database, perform CRUD operations, manage user authentication, and handle data securely and efficiently.

#### **Assignment Overview:**
In this assignment, students will design and develop the backend telemedicine application. The application will allow patients to create accounts, log in, book appointments, and manage their profiles. Doctors will manage their schedules, and administrators will oversee the system. Students will create the necessary database tables, set up an Express.js server, implement user authentication, and integrate core functionalities.

#### **Project Requirements:**

1. **Database Design:**
   - **Tables:**
     - **Patients:** `id`, `first_name`, `last_name`, `email`, `password_hash`, `phone`, `date_of_birth`, `gender`, `address`.
     - **Doctors:** `id`, `first_name`, `last_name`, `specialization`, `email`, `phone`, `schedule` (e.g., available days and times).
     - **Appointments:** `id`, `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `status` (e.g., scheduled, completed, canceled).
     - **Admin:** `id`, `username`, `password_hash`, `role`.

   - **Relationships:**
     - Patients and doctors have a one-to-many relationship with appointments.
     - Admin can manage doctors and view appointments.

   - **Database Setup:**
     - Design the database schema using MySQL.
     - Create and populate tables with sample data for testing.

2. **Node.js and Express Setup:**
   - **Express Application:**
     - Set up an Express.js project structure.
     - Implement routing for different parts of the application (e.g., `/patients`, `/doctors`, `/appointments`, `/admin`).

   - **Connecting to MySQL:**
     - Use a MySQL driver (e.g., `mysql2`) to establish a connection between the Express server and MySQL database.
     - Implement connection pooling for efficient database management.

3. **User Management and Authentication:**
   - **Patient Registration and Login:**
     - **Registration:** Allow patients to create an account by providing their personal details and setting a password. Store passwords securely using hashing (e.g., bcrypt).
     - **Login:** Implement a login system that authenticates patients using their email and password. Upon successful login, start a session for the patient.
     - **Profile Management:** Allow logged-in patients to view and update their profile information (excluding their email and password).

   - **Session Management:**
     - Use session cookies to manage patient sessions.
     - Implement session-based authentication to protect routes that require login (e.g., booking an appointment, viewing appointment history).
     - Provide a logout functionality that ends the patient’s session.

4. **Core Features Implementation:**
   - **Patient Management:**
     - **Create:** Patients can register and create an account.
     - **Read:** Display a list of patients (admin only), with search and filter options.
     - **Update:** Patients can update their profile information.
     - **Delete:** Implement a feature for patients to delete their accounts.

   - **Doctor Management:**
     - **Create:** Admin can add new doctors, including their schedules.
     - **Read:** Display a list of doctors with their specialization and availability.
     - **Update:** Allow doctors or admin to update schedules or profile information.
     - **Delete:** Implement a feature to deactivate or delete doctor profiles.

   - **Appointment Booking:**
     - **Create:** Patients can book an appointment by selecting a doctor, date, and time.
     - **Read:** Display a list of upcoming appointments for patients and doctors.
     - **Update:** Allow patients to reschedule or cancel appointments.
     - **Delete:** Allow patients to cancel appointments, updating the status to "canceled."

5. **Interactivity and User Experience:**
   - Use form validation for all input fields.
   - Provide real-time feedback for form submissions (e.g., success messages, error handling).
