# Database Schemas

- Database name is `telemed_app`

### `roles` Table

| Column   | Type           | Constraints                  |
|----------|----------------|------------------------------|
| role_id  | INT            | PRIMARY KEY, AUTO_INCREMENT  |
| role     | VARCHAR(100)   | NOT NULL, UNIQUE             |

### `users` Table

| Column    | Type           | Constraints                          |
|-----------|----------------|--------------------------------------|
| user_id   | INT            | PRIMARY KEY, AUTO_INCREMENT         |
| role_id   | INT            | DEFAULT 3, FOREIGN KEY (references `roles(role_id)`) |
| email     | VARCHAR(100)   | NOT NULL, UNIQUE                    |
| username  | VARCHAR(50)    | NOT NULL                            |
| password  | VARCHAR(100)   | NOT NULL                            |

### `patients` Table

| Column        | Type           | Constraints                                    |
|---------------|----------------|------------------------------------------------|
| patient_id    | INT            | PRIMARY KEY, FOREIGN KEY (references `users(user_id)`) ON DELETE CASCADE |
| first_name    | VARCHAR(50)    |                                                |
| last_name     | VARCHAR(50)    |                                                |
| date_of_birth | DATE           |                                                |
| gender        | VARCHAR(10)    |                                                |
| language      | VARCHAR(20)    |                                                |

### `doctors` Table

| Column            | Type           | Constraints              |
|-------------------|----------------|--------------------------|
| doctor_id         | INT            | PRIMARY KEY              |
| first_name        | VARCHAR(50)    | NOT NULL                 |
| last_name         | VARCHAR(50)    | NOT NULL                 |
| doctor_specialty  | VARCHAR(50)    | NOT NULL                 |
| email_address     | VARCHAR(50)    |                          |
| phone_number      | VARCHAR(20)    |                          |
| date_joined       | DATE           | NOT NULL                 |

### `appointments` Table

| Column                | Type           | Constraints                                        |
|-----------------------|----------------|----------------------------------------------------|
| appointment_id        | INT            | PRIMARY KEY, AUTO_INCREMENT                       |
| doctor_id             | INT            | NOT NULL, FOREIGN KEY (references `doctors(doctor_id)`) ON DELETE CASCADE |
| patient_id            | INT            | NOT NULL, FOREIGN KEY (references `patients(patient_id)`) ON DELETE CASCADE |
| description           | VARCHAR(100)   | NOT NULL                                           |
| appointment_date      | DATE           | NOT NULL                                           |
| appointment_time      | TIME           | NOT NULL                                           |
| appointment_status_id | INT            | NOT NULL, DEFAULT 1                                |

### `appointments_status` Table

| Column             | Type           | Constraints                  |
|--------------------|----------------|------------------------------|
| status_id          | INT            | PRIMARY KEY, AUTO_INCREMENT  |
| status_name        | VARCHAR(100)   | NOT NULL                     |
| status_description | VARCHAR(200)   |                              |

### `visits` Table

| Column                 | Type           | Constraints                                        |
|------------------------|----------------|----------------------------------------------------|
| visit_id               | INT            | PRIMARY KEY, AUTO_INCREMENT                       |
| patient_id             | INT            | FOREIGN KEY (references `patients(patient_id)`) ON DELETE CASCADE |
| doctor_id              | INT            | FOREIGN KEY (references `doctors(doctor_id)`) ON DELETE CASCADE |
| date_of_visit          | DATE           | NOT NULL                                           |
| date_scheduled         | DATE           | NOT NULL                                           |
| visit_department_id    | INT            | NOT NULL                                           |
| visit_type             | VARCHAR(50)    | NOT NULL                                           |
| blood_pressure_systollic | INT          |                                                    |
| blood_pressure_diastollic | DECIMAL(5,2)|                                                    |
| pulse                  | DECIMAL(5,2)   |                                                    |
| visit_status           | VARCHAR(50)    | NOT NULL                                           |

### `ed_visits` Table

| Column              | Type           | Constraints                                        |
|---------------------|----------------|----------------------------------------------------|
| ed_visit_id         | INT            | PRIMARY KEY, AUTO_INCREMENT                       |
| visit_id            | INT            | FOREIGN KEY (references `visits(visit_id)`) ON DELETE CASCADE |
| patient_id          | INT            | FOREIGN KEY (references `patients(patient_id)`) ON DELETE CASCADE |
| acuity              | INT            | NOT NULL                                           |
| reason_for_visit    | VARCHAR(100)   | NOT NULL                                           |
| disposition         | VARCHAR(50)    | NOT NULL                                           |

### `admissions` Table

| Column              | Type           | Constraints                                        |
|---------------------|----------------|----------------------------------------------------|
| admission_id        | INT            | PRIMARY KEY, AUTO_INCREMENT                       |
| patient_id          | INT            | FOREIGN KEY (references `patients(patient_id)`) ON DELETE CASCADE |
| admission_date      | DATE           | NOT NULL                                           |
| discharge_date      | DATE           | NOT NULL                                           |
| discharge_disposition | VARCHAR(50)  | NOT NULL                                           |
| service             | VARCHAR(50)    | NOT NULL                                           |
| primary_diagnosis   | VARCHAR(100)   | NOT NULL                                           |

### `discharges` Table

| Column              | Type           | Constraints                                        |
|---------------------|----------------|----------------------------------------------------|
| discharge_id        | INT            | PRIMARY KEY, AUTO_INCREMENT                       |
| admission_id        | INT            | FOREIGN KEY (references `admissions(admission_id)`) ON DELETE CASCADE |
| patient_id          | INT            | FOREIGN KEY (references `patients(patient_id)`) ON DELETE CASCADE |
| discharge_date      | DATE           | NOT NULL                                           |
| discharge_disposition | VARCHAR(50)  | NOT NULL                                           | 

