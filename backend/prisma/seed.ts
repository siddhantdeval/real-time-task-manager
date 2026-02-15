import 'dotenv/config';
import { PrismaClient, Role, Status, Priority } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const adminEmail = 'admin@example.com';
  const memberEmail = 'member@example.com';

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password_hash: 'admin123', // In a real app, hash this!
      role: Role.admin,
      owned_projects: {
        create: {
          name: 'Admin Project',
          description: 'A project managed by admin',
          tasks: {
            create: [
              {
                title: 'Review System Architecture',
                description: 'Check diagrams and plans',
                status: Status.in_progress,
                priority: Priority.high,
              },
              {
                title: 'Setup CI/CD',
                status: Status.todo,
                priority: Priority.medium,
              },
            ],
          },
        },
      },
    },
  });

  // Create Member User
  const member = await prisma.user.upsert({
    where: { email: memberEmail },
    update: {},
    create: {
      email: memberEmail,
      password_hash: 'member123',
      role: Role.member,
      owned_projects: {
        create: {
          name: 'Member Project',
          description: 'A personal project',
          tasks: {
            create: [
              {
                title: 'Learn Prisma',
                status: Status.done,
                priority: Priority.high,
              },
            ],
          },
        },
      },
    },
  });

  const adminProject = await prisma.project.findFirst({ where: { owner: { email: adminEmail } } });

  if (adminProject) {
    await prisma.task.create({
      data: {
        title: 'Assigned Task from Seed',
        description: 'Task assigned specifically to this member',
        project_id: adminProject.id,
        assignee_id: member.id,
        status: Status.todo,
        priority: Priority.low,
      },
    });
  }

  console.log({ admin, member });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
