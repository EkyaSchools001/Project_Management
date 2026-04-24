import { syncAssessmentsToFile } from '../utils/syncAssessments';

async function main() {
    await syncAssessmentsToFile();
    process.exit(0);
}

main().catch(console.error);
