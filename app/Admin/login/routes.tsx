import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// Type definitions
interface UserBase {
  id: string;
  loginId: string;
  password: string;
  name: string;
  email: string;
}

interface Admin extends UserBase {
  role: 'admin';
  permissions: string[];
}

interface RegularUser extends UserBase {
  role: 'user';
  isActive: boolean;
  createdAt: Date;
}

type User = Admin | RegularUser;

interface LoginRequest {
  loginId: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: Omit<User, 'password'>;
  userType?: 'admin' | 'user';
}

// Mock database - In production, replace with real database
const admins: Admin[] = [
  {
    id: '1',
    loginId: 'admin',
    password: '$2a$10$8K1p/a0dRTlB0ZQ1F8c8e.8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c', // admin123
    name: 'System Administrator',
    email: 'admin-bode@gmail.com',
    role: 'admin',
    permissions: ['all']
  }
];

const users: RegularUser[] = [
  {
    id: '2',
    loginId: 'user1',
    password: '$2a$10$8K1p/a0dRTlB0ZQ1F8c8e.8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c', // user123
    name: 'John User',
    email: 'user@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];

// Initialize passwords (in production, do this separately)
async function initializePasswords() {
  admins[0].password = await bcrypt.hash('admin123', 10);
  users[0].password = await bcrypt.hash('user123', 10);
}

initializePasswords();

async function findAdminByLoginId(loginId: string): Promise<Admin | null> {
  return (
    admins.find(
      (admin) => admin.loginId === loginId || admin.email === loginId
    ) || null
  );
}

async function findUserByLoginId(loginId: string): Promise<RegularUser | null> {
  return (
    users.find((user) => user.loginId === loginId || user.email === loginId) ||
    null
  );
}

async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, storedHash);
}

export async function POST(request: NextRequest) {
  const { loginId, password }: LoginRequest = await request.json();

  // Validate request body
  if (!loginId || !password) {
    return NextResponse.json(
      {
        success: false,
        message: 'Login ID and password are required'
      },
      { status: 400 }
    );
  }

  try {
    let user: User | null = null;
    let userType: 'admin' | 'user' | null = null;

    // Check admin table first
    const admin = await findAdminByLoginId(loginId);
    if (admin && (await verifyPassword(password, admin.password))) {
      user = admin;
      userType = 'admin';
    } else {
      // Check user table
      const regularUser = await findUserByLoginId(loginId);
      if (regularUser && (await verifyPassword(password, regularUser.password))) {
        user = regularUser;
        userType = 'user';

        // Check if user is active/approved
        if (!regularUser.isActive) {
          return NextResponse.json(
            {
              success: false,
              message: 'Account is inactive. Please contact administrator.'
            },
            { status: 403 }
          );
        }
      }
    }

    if (user && userType) {
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user as any;

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        userType
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials or unauthorized access'
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
