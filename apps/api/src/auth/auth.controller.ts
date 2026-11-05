import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UsePipes,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { type ZodSchema } from 'zod';
import { AuthService } from './auth.service.js';
import { Public } from './decorators/public.decorator.js';
import {
  type AuthResponseDto,
  loginSchema,
  registerSchema,
  type LoginDto,
  type RegisterDto,
} from './dto/auth.dto.js';

class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new BadRequestException(`Validation failed: ${messages}`);
    }
    return result.data;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Get('me')
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.authService.validateUserById(req.user.id);
  }
}
