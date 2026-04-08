import { DataSource } from 'typeorm';
import { Role, Permissions } from '../entities/role.entity';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);

  // Check if roles already exist
  const existingRoles = await roleRepository.count();
  if (existingRoles > 0) {
    console.log('Roles already seeded, skipping...');
    return;
  }

  const roles = [
    {
      name: 'admin',
      permissions: [
        Permissions.READ,
        Permissions.CREATE,
        Permissions.UPDATE,
        Permissions.DELETE
      ]
    },
    {
      name: 'owner',
      permissions: [
        Permissions.READ,
        Permissions.CREATE,
        Permissions.UPDATE,
        Permissions.DELETE
      ]
    },
    {
      name: 'manager',
      permissions: [
        Permissions.READ,
        Permissions.CREATE,
        Permissions.UPDATE
      ]
    },
    {
      name: 'tenant',
      permissions: [
        Permissions.READ,
        Permissions.CREATE,
        Permissions.UPDATE
      ]
    }
  ];

  for (const role of roles) {
    const existingRole = await roleRepository.findOne({ where: { name: role.name } });
    if (!existingRole) {
        const newRole = roleRepository.create(role);
        await roleRepository.save(newRole);
      console.log(`Role '${role.name}' seeded successfully`);
    }
  }
}
