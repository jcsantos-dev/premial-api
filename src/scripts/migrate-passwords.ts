import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { entities } from '../entities'; // Asegúrate de que la ruta es correcta

// 👇 configura tu DataSource según tu ormconfig
const dataSource = new DataSource({
  type: 'postgres', // o mysql, según tu DB
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'P0ztgre$QL',
  database: process.env.DB_NAME || 'loyaltyapp',
  entities: Object.values(entities), // 👈 todas las entidades
  synchronize: false,
});

async function migratePasswords() {
  await dataSource.initialize();

  const repo = dataSource.getRepository(entities.UserAuth);
  const users = await repo.find();

  for (const user of users) {
    if (user.passwordHash) {
      const hash = await bcrypt.hash(user.passwordHash, 10); // salt 10
      user.passwordHash = hash;
      await repo.save(user);
    }
  }

  console.log('Migración de contraseñas completada ✅');

  await dataSource.destroy();
}

migratePasswords().catch(err => {
  console.error('Error migrando contraseñas:', err);
  process.exit(1);
});
