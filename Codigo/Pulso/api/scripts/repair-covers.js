const prisma = require('../src/config/database');
const { attachCoverImage } = require('../src/services/tripDestinationImageService');

async function main() {
  const viagens = await prisma.viagem.findMany({
    select: { id: true, destino: true, destinoMeta: true },
  });

  for (const viagem of viagens) {
    const base = viagem.destinoMeta && typeof viagem.destinoMeta === 'object' ? viagem.destinoMeta : {};
    const enriched = await attachCoverImage(base, viagem.destino);
    if (!enriched?.coverImageUrl || enriched.coverImageUrl === base.coverImageUrl) continue;

    await prisma.viagem.update({
      where: { id: viagem.id },
      data: { destinoMeta: enriched },
    });
    console.log('fixed', viagem.destino, enriched.coverImageUrl.slice(0, 90) + '...');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
