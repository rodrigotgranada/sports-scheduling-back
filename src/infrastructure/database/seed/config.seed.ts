import { ConfigService } from 'src/infrastructure/services/config.service';
import { ConfigModel } from 'src/infrastructure/database/models/ConfigModel';

export async function seedConfig() {
  const existingConfig = await ConfigModel.findOne();
  if (!existingConfig) {
    const defaultConfig = {
      canViewUsers: ['admin', 'owner'],
      canEditUsers: ['admin', 'owner'],
      canDeleteUsers: ['owner'],
      canBlockUsers: ['admin', 'owner'],
      editableFields: ['firstName', 'lastName', 'cpf', 'phone', 'email', 'isActive', 'role'],
    };
    await ConfigModel.create(defaultConfig);
    console.log('Default config seeded');
  } else {
    console.log('Config already exists');
  }
}
