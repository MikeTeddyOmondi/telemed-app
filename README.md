# Telemed App

## Project Objective

The objective of this assignment is to provide students with practical experience in developing a full-stack web application using Node.js, Express, and MySQL. Students will build the backend of the telemedicine application that includes patient management, doctor scheduling, appointment booking, and user authentication for patients. This project will help students understand how to connect a Node.js application to a MySQL database, perform CRUD operations, manage user authentication, and handle data securely and efficiently.

## Project Overview

In this assignment, students will design and develop the backend telemedicine application. The application will allow patients to create accounts, log in, book appointments, and manage their profiles. Doctors will manage their schedules, and administrators will oversee the system. Students will create the necessary database tables, set up an Express.js server, implement user authentication, and integrate core functionalities.

## Tech Stack

1. Express - Backend Web Framework (Node.js)
2. HTML, CSS (PicoCSS) & JS - Frontend
3. MySQL - Database

## Project Requirements

1. **Database Design:**

   - All the tables are defined here: [schemas](/SCHEMAS.md)

## Start Project

- Install dependencies

```
npm install
```

- Copy/rename the .env.sample file to .env and add your database credentials

```
mv .env.sample .env
```

- Start the server in development mode

```
npm run dev
```

- Start the server in production mode

```
npm run start
```

## Core Features Implementation

- [ * ] **User Management and Authentication**

  - [ * ] **Registration of users** by default all users are patients upon registration
  - [ * ] **Login of users**
  - [ * ] **User profile management**

- [ * ] **Session Management**

- [ * ] **Patient Management**

  - [ * ] **Creating** patients through registrations and creating an account.
  - [ * ] **Read patients(admin only)** with search and filter options.
  - [ * ] **Update profile** Patients can update their profile information.
  - [ * ] **Delete account:** Implement a feature for patients to delete their accounts.

- [ ] **Doctor Management**

  - [ * ] **Creating (admins only)** new doctors, including their schedules.
  - [ ] **Read** Display a list of doctors with their specialization and availability.
  - [ ] **Update:** Allow doctors or admin to update schedules or profile information.
  - [ ] **Delete:** Implement a feature to deactivate or delete doctor profiles.

- [ ] **Appointment Booking:**

  - [ * ] **Create appointments (patients)** Patients can book an appointment by selecting a doctor, date, and time.
  - [ ] **Read appointments (patients and doctors)** Display a list of upcoming appointments for patients and doctors.
  - [ * ] **Update appointments (patients)** Allow patients to reschedule or cancel appointments.
  - [ * ] **Delete:** Allow patients to cancel appointments, updating the status to "canceled."

- [ * ] **Interactivity and Enhanced UX**
  - [ * ] Use form validation for all input fields.
  - [ * ] Provide real-time feedback for form submissions (e.g., success messages, error handling).
