import { DataSource } from 'typeorm';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

const HASH_ALGORITHM = 'sha256';

export async function seedOwnerUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // Check if manager user already exists
  const existingManager = await userRepository.findOne({ where: { email: 'louis.jhonny@gmail.com' } });
  if (existingManager) {
    console.log('Manager user already exists, skipping...');
    return;
  }

  // Get admin role
  const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    throw new Error('Admin role not found. Please seed roles first.');
  }

    // Get Manager role
  const ownerRole = await roleRepository.findOne({ where: { name: 'owner' } });
  if (!ownerRole) {
    throw new Error('Owner role not found. Please seed roles first.');
  }

  // Hash default password
  const defaultPassword = 'AdminPassword123!';
  const hashedPassword = crypto.createHash(HASH_ALGORITHM).update(defaultPassword).digest('hex');

  // Create manager user
  const ownerUser = userRepository.create({
    id: uuidv4(),
    firstname: 'Jhonny',
    lastname: 'Alcius',
    email: 'louis.jhonny@gmail.com',
    password: hashedPassword,
    isActive: true,
    activationToken: null,
    role: ownerRole,
    blockedPermissions: []
  });

  await userRepository.save(ownerUser);
  console.log(
    `Owner user created with email: louis.jhonny@gmail.com and password: ${defaultPassword}`
  );
}
