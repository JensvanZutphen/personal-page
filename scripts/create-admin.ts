import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { createInterface } from 'node:readline';

const db = new PrismaClient();

// Scrypt parameters for secure password hashing (same as in auth.ts)
const SCRYPT_PARAMS = {
	N: 16384,  // CPU/memory cost parameter (2^14)
	r: 8,      // Block size parameter
	p: 1,      // Parallelization parameter
	keyLen: 64 // Key length in bytes
};

// Enhanced password validation with security best practices
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
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
  }, 'Password contains common weak patterns. Please choose a more secure password.');

// Enhanced username validation
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(31, 'Username must be at most 31 characters')
  .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores, and hyphens')
  .regex(/^[a-z]/, 'Username must start with a letter')
  .refine((username) => {
    // Block common reserved usernames
    const reservedUsernames = [
      'admin', 'administrator', 'root', 'system', 'user', 'guest', 'test',
      'demo', 'api', 'www', 'mail', 'email', 'support', 'help', 'info',
      'null', 'undefined', 'false', 'true'
    ];
    
    return !reservedUsernames.includes(username.toLowerCase());
  }, 'This username is not allowed. Please choose a different one.');

const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema
});

function generateUserId() {
	return nanoid(21); // Generate a 21-character user ID
}

// Secure password hashing using Node.js built-in scrypt
async function hashPassword(password: string): Promise<string> {
	try {
		// Generate a random 32-byte salt
		const salt = randomBytes(32);
		
		// Use scryptSync for password hashing with secure parameters
		const derivedKey = scryptSync(password, salt, SCRYPT_PARAMS.keyLen, {
			N: SCRYPT_PARAMS.N,
			r: SCRYPT_PARAMS.r,
			p: SCRYPT_PARAMS.p
		});
		
		// Combine salt and derived key and encode as base64
		const combined = Buffer.concat([salt, derivedKey]);
		return combined.toString('base64');
	} catch (error) {
		console.error('Password hashing failed:', error);
		throw new Error('Failed to hash password');
	}
}

async function createAdminUser() {
  console.log('Creating admin user...\n');

  // Prompt for credentials
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const prompt = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      readline.question(question, resolve);
    });
  };

  try {
    const username = await prompt('Enter admin username: ');
    const password = await prompt('Enter admin password: ');
    const email = await prompt('Enter admin email (optional): ');
    const name = await prompt('Enter admin display name (optional): ');

    console.log('\nValidating input...');

    // Validate input using our schema
    const validationResult = registerSchema.safeParse({ username, password });
    
    if (!validationResult.success) {
      console.error('Validation failed:');
      validationResult.error.errors.forEach(error => {
        console.error(`- ${error.path.join('.')}: ${error.message}`);
      });
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.error(`User with username "${username}" already exists.`);
      process.exit(1);
    }

    // Check if email is provided and already exists
    if (email && email.trim()) {
      const existingEmailUser = await db.user.findUnique({
        where: { email: email.trim() }
      });

      if (existingEmailUser) {
        console.error(`User with email "${email}" already exists.`);
        process.exit(1);
      }
    }

    console.log('Hashing password...');
    
    // Generate secure password hash
    const userId = generateUserId();
    const passwordHash = await hashPassword(password);

    console.log('Creating user in database...');

    // Create admin user
    const adminUser = await db.user.create({
      data: {
        id: userId,
        username,
        passwordHash,
        email: email.trim() || null,
        name: name.trim() || null,
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`User ID: ${adminUser.id}`);
    console.log(`Username: ${adminUser.username}`);
    console.log(`Email: ${adminUser.email || 'Not provided'}`);
    console.log(`Name: ${adminUser.name || 'Not provided'}`);
    console.log(`Role: ${adminUser.role}`);
    console.log('\nYou can now log in with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    readline.close();
    await db.$disconnect();
  }
}

// Run the script
createAdminUser(); 