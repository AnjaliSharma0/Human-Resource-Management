import { PreJoiningDoc } from "src/onbording/entity/pre-joining-doc.entity";
import { DataSource } from "typeorm";


const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.BASE_URL,
  entities: [PreJoiningDoc],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();

  const repo = AppDataSource.getRepository(PreJoiningDoc);

  const docs = [
    "Aadhaar Card",
    "PAN Card",
    "10th Marksheet",
    "12th Marksheet",
    "Graduation Certificate",
  ];

  for (const doc of docs) {
    const exists = await repo.findOne({ where: { documentName: doc } });

    if (!exists) {
      await repo.save({ documentName: doc });
    }
  }

  console.log("✅ Seed completed");
  process.exit();
}

seed();