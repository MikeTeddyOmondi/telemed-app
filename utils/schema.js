const { z } = require("zod");

const providerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters"),

  primaryEmail: z
    .string()
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters"),

  secondaryEmail: z
    .string()
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters")
    .optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  roleId: z
    .number()
    .int("Role ID must be an integer")
    .positive("Role ID must be positive"),

  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),

  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 12 digits"),

  specialty: z
    .string()
    .max(100, "Specialty cannot exceed 100 characters"),

  dateJoined: z
    .string()
    .datetime({ message: "Invalid date format" })
    .or(z.date()),
});

module.exports = { providerSchema };
