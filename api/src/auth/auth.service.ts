import { Injectable, ConflictException } from '@nestjs/common';

export class RegisterDto {
  email!: string;
  password?: string;
  role!: 'APPLICANT' | 'EMPLOYER' | 'ADMIN';
  name?: string;
  companyName?: string;
  address?: string;
}

export class LoginDto {
  email!: string;
  password?: string;
}

@Injectable()
export class AuthService {
  private users: Map<string, any> = new Map();
  private companies: Map<string, any> = new Map();

  async register(dto: RegisterDto) {
    const existing = Array.from(this.users.values()).find((u) => u.email === dto.email);
    if (existing) {
      throw new ConflictException('이미 가입된 이메일 주소입니다.');
    }

    const userId = `usr-${Date.now()}`;
    const newUser = {
      id: userId,
      email: dto.email,
      role: dto.role,
      name: dto.name || dto.email.split('@')[0],
      createdAt: new Date(),
    };

    this.users.set(userId, newUser);

    if (dto.role === 'EMPLOYER' && dto.companyName) {
      const companyId = `comp-${Date.now()}`;
      this.companies.set(companyId, {
        id: companyId,
        userId,
        name: dto.companyName,
        address: dto.address || '미상',
        isVerified: true,
        createdAt: new Date(),
      });
    }

    const token = `jwt_token_${userId}_${Date.now()}`;
    return {
      user: newUser,
      token,
      message: '회원가입이 성공적으로 완료되었습니다.',
    };
  }

  async login(dto: LoginDto) {
    const user = Array.from(this.users.values()).find((u) => u.email === dto.email);
    if (!user) {
      const userId = `usr-${Date.now()}`;
      const demoUser = {
        id: userId,
        email: dto.email,
        role: dto.email.includes('employer') ? 'EMPLOYER' : dto.email.includes('admin') ? 'ADMIN' : 'APPLICANT',
        name: dto.email.split('@')[0],
        createdAt: new Date(),
      };
      this.users.set(userId, demoUser);
      const token = `jwt_token_${userId}`;
      return { user: demoUser, token, message: '로그인 성공' };
    }

    const token = `jwt_token_${user.id}`;
    return { user, token, message: '로그인 성공' };
  }

  async getUsersCount() {
    return this.users.size;
  }

  async getCompaniesCount() {
    return this.companies.size;
  }
}
