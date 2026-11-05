import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  PipeTransform,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { type ZodSchema } from 'zod';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { UserRole } from '../database/schema.js';
import { CropsService } from './crops.service.js';
import {
  createCropSchema,
  updateAiGradeSchema,
  updateEscrowStatusSchema,
  type CreateCropDto,
  type UpdateAiGradeDto,
  type UpdateEscrowStatusDto,
} from './dto/crop.dto.js';

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

interface RequestWithUser {
  user: {
    id: string;
    role: UserRole;
    fullName: string;
  };
}

@Controller('crops')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  /**
   * Only FARMERS can upload and record crop harvest assets.
   */
  @Post()
  @Roles('FARMER')
  @UsePipes(new ZodValidationPipe(createCropSchema))
  async create(
    @Request() req: RequestWithUser,
    @Body() dto: CreateCropDto,
  ) {
    return this.cropsService.createCrop(req.user.id, dto);
  }

  /**
   * Role-gated crops list:
   * Farmers see their own crops; Buyers see listed crops; Admins see all.
   */
  @Get()
  @Roles('FARMER', 'BUYER', 'ADMIN')
  async findAll(@Request() req: RequestWithUser) {
    return this.cropsService.findAll(req.user);
  }

  /**
   * Retrieve single crop asset.
   */
  @Get(':id')
  @Roles('FARMER', 'BUYER', 'ADMIN')
  async findOne(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    return this.cropsService.findById(id, req.user);
  }

  /**
   * BUYER and ADMIN can transition escrow states (e.g. deposit into escrow, release funds upon delivery).
   */
  @Patch(':id/escrow')
  @Roles('BUYER', 'ADMIN')
  @UsePipes(new ZodValidationPipe(updateEscrowStatusSchema))
  async updateEscrow(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateEscrowStatusDto,
  ) {
    return this.cropsService.updateEscrowStatus(id, dto, req.user);
  }

  /**
   * ADMIN (or internal AI grading microservice) updates AI quality grade.
   */
  @Patch(':id/ai-grade')
  @Roles('ADMIN')
  @UsePipes(new ZodValidationPipe(updateAiGradeSchema))
  async updateAiGrade(
    @Param('id') id: string,
    @Body() dto: UpdateAiGradeDto,
  ) {
    return this.cropsService.updateAiGrade(id, dto);
  }
}
