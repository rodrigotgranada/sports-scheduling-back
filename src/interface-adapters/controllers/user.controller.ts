import { Controller, Get, Param, Patch, Body, Post, UseGuards, Request, ForbiddenException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from 'src/infrastructure/services/user.service';
import { ConfigService } from 'src/infrastructure/services/config.service';
import { LoggingService } from 'src/infrastructure/services/logging.service';
import { JwtAuthGuard } from 'src/infrastructure/http/guards/jwt-auth.guard';
import { CreateUserDTO } from 'src/interface-adapters/dtos/CreateUserDTO';
import { UpdateUserDTO } from 'src/interface-adapters/dtos/UpdateUserDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadCleanerService } from 'src/infrastructure/services/checkAndCleanUploads';
import { ResetPasswordDTO } from 'src/interface-adapters/dtos/ResetPasswordDTO'; 

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggingService: LoggingService,
    private readonly configService: ConfigService,
    private readonly uploadCleanerService: UploadCleanerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    console.log('req', req )
    return this.userService.findUserById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Request() req, @Body() updateUserDto: UpdateUserDTO) {
    return this.userService.updateUser(req.user.userId, updateUserDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Request() req) {
    const config = await this.configService.getConfig();
    const role = req.user.role;
    if (!config.canViewUsers.includes(role)) {
      throw new ForbiddenException('Você não tem permissão para visualizar todos os usuários');
    }
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/create')
  @UseInterceptors(FileInterceptor('foto'))
  async createUser(@Body() createUserDto: CreateUserDTO, @Request() req, @UploadedFile() file: Express.Multer.File) {
    const user = await this.userService.createUser(createUserDto, req.user.userId, file);

    // Log message
    const loggedUser = await this.userService.findUserById(req.user.userId);
    const logMessage = `Usuário ${user.firstName} ${user.lastName} criado pelo usuário ${loggedUser.firstName} ${loggedUser.lastName} com permissões ${user.role} e no status de ${user.isActive}`;

    await this.loggingService.logActivity('createUser', user.id, logMessage);

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/clean-uploads')
  async cleanUploads(@Request() req) {
    if (req.user.role !== 'owner') {
      throw new ForbiddenException('Você não tem permissão para executar esta ação');
    }

    await this.uploadCleanerService.checkAndCleanUploads();
    await this.loggingService.logActivity('cleanUploads', req.user.userId, 'Uploads verificados e limpos.');
    return { message: 'Uploads verificados e limpos com sucesso.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async getUserById(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'owner' && req.user.userId !== id) {
      throw new ForbiddenException('Você não tem permissão para visualizar este usuário');
    }
    return this.userService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/:id/regenerate-activation-code')
  async regenerateActivationCode(@Param('id') id: string, @Request() req) {
    const user = await this.userService.findUserById(id);
    
    // Verifica se o status do usuário é "pending"
    if (user.isActive !== 'pending') {
      throw new ForbiddenException('O código de ativação só pode ser reenviado para usuários com status "pending".');
    }

    await this.userService.regenerateActivationCode(user);

    // Log action
    const loggedUser = await this.userService.findUserById(req.user.userId);
    const logMessage = `Código de ativação reenviado para ${user.firstName} ${user.lastName} pelo usuário ${loggedUser.firstName} ${loggedUser.lastName}`;

    await this.loggingService.logActivity('regenerateActivationCode', user.id, logMessage);

    return { message: 'Código de ativação reenviado com sucesso.' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id/block')
  async blockUserById(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'owner') {
      throw new ForbiddenException('Você não tem permissão para executar esta ação');
    }
    await this.loggingService.logActivity('blockUser', id, `Usuário bloqueado pelo ${req.user.userId}`);
    return this.userService.updateUserStatus(id, 'blocked', req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id/unblock')
  async unblockUserById(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'owner') {
      throw new ForbiddenException('Você não tem permissão para executar esta ação');
    }
    await this.loggingService.logActivity('unblockUser', id, `Usuário desbloqueado pelo ${req.user.userId}`);
    return this.userService.updateUserStatus(id, 'active', req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id/password')
  async updateUserPassword(@Param('id') id: string, @Body() resetPasswordDto: ResetPasswordDTO, @Request() req) {
    if (req.user.role !== 'owner') {
      throw new ForbiddenException('Você não tem permissão para trocar a senha de outro usuário');
    }
    return this.userService.updateUserPassword(id, resetPasswordDto.newPassword, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/:id/reset-password')
  async sendResetPasswordCode(@Param('id') id: string, @Request() req) {
    const user = await this.userService.findUserById(id);
    await this.userService.sendResetPasswordCode(user);

    // Log action
    const loggedUser = await this.userService.findUserById(req.user.userId);
    const logMessage = `Código de reset de senha enviado para ${user.firstName} ${user.lastName} pelo usuário ${loggedUser.firstName} ${loggedUser.lastName}`;

    await this.loggingService.logActivity('sendResetPasswordCode', user.id, logMessage);

    return { message: 'Código de reset de senha enviado com sucesso.' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id')
  async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO, @Request() req) {
    const config = await this.configService.getConfig();
    const role = req.user.role;

    // Verificar permissões para editar usuários
    if (!config.canEditUsers.includes(role)) {
      throw new ForbiddenException('Você não tem permissão para editar usuários');
    }

    // Verificar se um admin está tentando editar outro admin ou owner
    const targetUser = await this.userService.findUserById(id);
    if (role === 'admin' && (targetUser.role === 'admin' || targetUser.role === 'owner')) {
      throw new ForbiddenException('Um usuário admin não pode editar outro admin ou owner');
    }

    // Filtrar campos editáveis com base nas permissões configuradas
    const allowedFields = config.editableFields;
    const updates = {};
    for (const field of allowedFields) {
      if (updateUserDto[field] !== undefined) {
        updates[field] = updateUserDto[field];
      }
    }

    return this.userService.updateUser(id, updates, req.user.userId);
  }
}
