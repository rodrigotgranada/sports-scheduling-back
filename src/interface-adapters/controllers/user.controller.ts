import { Controller, Get, Param, Patch, Body, Delete, Post, UseGuards, Request, Put } from '@nestjs/common';
import { UserService } from 'src/infrastructure/services/user.service';
import { JwtAuthGuard } from '../../infrastructure/http/guards/jwt-auth.guard';
import { UpdateUserDTO } from 'src/interface-adapters/dtos/UpdateUserDTO';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return this.userService.getUserById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMe(@Request() req, @Body() updateUserDto: UpdateUserDTO) {
    return this.userService.updateUser(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/block')
  blockUserById(@Param('id') id: string) {
    return this.userService.updateUserStatus(id, 'blocked');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/unblock')
  unblockUserById(@Param('id') id: string) {
    return this.userService.updateUserStatus(id, 'active');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/create')
  createUser(@Body() createUserDto: UpdateUserDTO) {
    return this.userService.createUser(createUserDto);
  }
}
