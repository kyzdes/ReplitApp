import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@aidevplatform.com' },
    update: {},
    create: {
      email: 'demo@aidevplatform.com',
      username: 'demo',
      displayName: 'Demo User',
      passwordHash,
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create demo project
  const project = await prisma.project.create({
    data: {
      name: 'My First Project',
      description: 'A demo project created by the seed script',
      template: 'react-ts',
      userId: user.id,
      isPublic: true,
      tags: ['demo', 'react', 'typescript'],
      files: {
        create: [
          {
            name: 'App.tsx',
            path: '/App.tsx',
            type: 'file',
            language: 'typescript',
            content: `import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Hello from AI Dev Platform!</h1>
      <p>This is a demo project.</p>
    </div>
  );
}

export default App;`,
            order: 0,
          },
          {
            name: 'index.tsx',
            path: '/index.tsx',
            type: 'file',
            language: 'typescript',
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
            order: 1,
          },
        ],
      },
    },
  });

  console.log('✅ Created demo project:', project.name);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
