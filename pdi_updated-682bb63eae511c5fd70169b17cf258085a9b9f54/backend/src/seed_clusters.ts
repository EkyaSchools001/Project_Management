import prisma from './infrastructure/database/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('Seeding Clusters, Domains, and Parameters...');

    const clustersPath = path.join(__dirname, 'config', 'clusters.json');
    if (!fs.existsSync(clustersPath)) {
        console.error('Clusters config not found at:', clustersPath);
        return;
    }
    const clustersData = JSON.parse(fs.readFileSync(clustersPath, 'utf8'));

    for (const cData of clustersData) {
        const cluster = await prisma.cluster.upsert({
            where: { number: cData.number },
            update: { name: cData.name },
            create: { number: cData.number, name: cData.name }
        });

        for (const [dIndex, dData] of cData.domains.entries()) {
            const domain = await prisma.domain.create({
                data: {
                    clusterId: cluster.id,
                    name: dData.name,
                    order: dIndex
                }
            });

            for (const [sdIndex, sdData] of dData.subdomains.entries()) {
                const subdomain = await prisma.subdomain.create({
                    data: {
                        domainId: domain.id,
                        code: sdData.code,
                        title: sdData.title,
                        order: sdIndex
                    }
                });

                for (const [pIndex, pData] of sdData.parameters.entries()) {
                    await prisma.parameter.create({
                        data: {
                            subdomainId: subdomain.id,
                            name: pData.name,
                            description: pData.description,
                            lookFors: pData.lookFors,
                            order: pIndex
                        }
                    });
                }
            }
        }
    }

    console.log('✅ Cluster seeding complete.');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
