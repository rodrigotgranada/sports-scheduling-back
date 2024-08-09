// src/interface-adapters/controllers/admin.controller.ts
import { Controller, Get, Param, Patch, Body, Delete, Post, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/http/guards/jwt-auth.guard';
import { UserManagementService } from 'src/infrastructure/services/user-management.service';
import { LoggingService } from 'src/infrastructure/services/logging.service';
import { CreateUserDTO } from 'src/interface-adapters/dtos/CreateUserDTO';
import { User } from 'src/domain/entities/User';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly loggingService: LoggingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers(@Request() req) {
    const users = await this.userManagementService.viewUsers(req.user.role);
    await this.loggingService.logActivity('viewAllUsers', '', req.user.id);
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/:id')
  async updateUser(@Param('id') userId: string, @Body() updateUserDto: Partial<User>, @Request() req) {
    const updatedUser = await this.userManagementService.editUser(req.user.role, userId, updateUserDto);
    await this.loggingService.logActivity('editUser', userId, req.user.id);
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') userId: string, @Request() req) {
    await this.userManagementService.deleteUser(req.user.role, userId);
    await this.loggingService.logActivity('deleteUser', userId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/:id/block')
  async blockUser(@Param('id') userId: string, @Request() req) {
    const updatedUser = await this.userManagementService.blockUser(req.user.role, userId);
    await this.loggingService.logActivity('blockUser', userId, req.user.id);
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/:id/unblock')
  async unblockUser(@Param('id') userId: string, @Request() req) {
    const updatedUser = await this.userManagementService.unblockUser(req.user.role, userId);
    await this.loggingService.logActivity('unblockUser', userId, req.user.id);
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/create')
  async createUser(@Body() createUserDto: CreateUserDTO, @Request() req) {
    const createdUser = await this.userManagementService.createUser(req.user.role, createUserDto);
    await this.loggingService.logActivity('createUser', createdUser.id, req.user.id);
    return createdUser;
  }
}
