import { z } from 'zod';

// Enhanced password validation with security best practices
const passwordSchema = z
  .string()
  .min(8, 'Wachtwoord moet minimaal 8 tekens bevatten')
  .max(128, 'Wachtwoord mag maximaal 128 tekens bevatten')
  .regex(/[a-z]/, 'Wachtwoord moet minimaal één kleine letter bevatten')
  .regex(/[A-Z]/, 'Wachtwoord moet minimaal één hoofdletter bevatten')
  .regex(/[0-9]/, 'Wachtwoord moet minimaal één cijfer bevatten')
  .regex(/[^a-zA-Z0-9]/, 'Wachtwoord moet minimaal één speciaal teken bevatten')
  .refine((password) => {
    // Check for common weak patterns
    const commonPatterns = [
      /(.)\1{2,}/, // Three or more consecutive identical characters
      /123456/, // Sequential numbers
      /abcdef/i, // Sequential letters
      /qwerty/i, // Common keyboard patterns
      /password/i, // Common password words
      /admin/i,
      /login/i
    ];
    
    return !commonPatterns.some(pattern => pattern.test(password));
  }, 'Wachtwoord bevat veelvoorkomende zwakke patronen. Kies een veiliger wachtwoord.');

// Enhanced username validation
const usernameSchema = z
  .string()
  .min(3, 'Gebruikersnaam moet minimaal 3 tekens bevatten')
  .max(31, 'Gebruikersnaam mag maximaal 31 tekens bevatten')
  .regex(/^[a-z0-9_.-]+$/, 'Gebruikersnaam mag alleen kleine letters, cijfers, underscores, koppeltekens en punten bevatten')
  .regex(/^[a-z]/, 'Gebruikersnaam moet beginnen met een letter')
  .refine((username) => {
    // Block common reserved usernames
    const reservedUsernames = [
      'admin', 'administrator', 'root', 'system', 'user', 'guest', 'test',
      'demo', 'api', 'www', 'mail', 'email', 'support', 'help', 'info',
      'null', 'undefined', 'false', 'true'
    ];
    
    return !reservedUsernames.includes(username.toLowerCase());
  }, 'Deze gebruikersnaam is niet toegestaan. Kies een andere.');

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, 'Wachtwoord is verplicht').max(128, 'Wachtwoord is te lang')
});

export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema
});

// Additional schema for password change functionality
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Huidig wachtwoord is verplicht'),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"]
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Nieuw wachtwoord moet verschillen van het huidige wachtwoord",
  path: ["newPassword"]
});

// Schema for password reset functionality
export const resetPasswordRequestSchema = z.object({
  username: usernameSchema
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is verplicht'),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"]
});

export type LoginSchema = typeof loginSchema;
export type RegisterSchema = typeof registerSchema;