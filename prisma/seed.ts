import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Áreas / Categorias ────────────────────────────────────
  const areas = [
    { id: 1, title: "Educação", slug: "educacao", icon: "GraduationCap" },
    { id: 2, title: "Saúde e Bem-estar", slug: "saude-bem-estar", icon: "Heart" },
    { id: 3, title: "Negócios, Administração e Direito", slug: "negocios-administracao-direito", icon: "Briefcase" },
    { id: 4, title: "Engenharia, Produção e Construção", slug: "engenharia-producao-construcao", icon: "HardHat" },
    { id: 5, title: "Computação e TIC", slug: "computacao-tic", icon: "Monitor" },
    { id: 6, title: "Ciências Sociais, Comunicação e Informação", slug: "ciencias-sociais-comunicacao", icon: "Users" },
    { id: 7, title: "Artes e Humanidades", slug: "artes-humanidades", icon: "Palette" },
    { id: 8, title: "Ciências Naturais, Matemática e Estatística", slug: "ciencias-naturais-matematica", icon: "FlaskConical" },
    { id: 9, title: "Agricultura, Silvicultura, Pesca e Veterinária", slug: "agricultura-veterinaria", icon: "Leaf" },
    { id: 10, title: "Serviços", slug: "servicos", icon: "Wrench" },
    { id: 11, title: "Diversos", slug: "diversos", icon: "LayoutGrid" },
    { id: 12, title: "Outros", slug: "outros", icon: "MoreHorizontal" },
  ];

  for (const area of areas) {
    await prisma.area.upsert({
      where: { id: area.id },
      update: area,
      create: area,
    });
  }
  console.log(`  ✓ ${areas.length} áreas criadas`);

  // ─── FAQ ───────────────────────────────────────────────────
  const faqItems = [
    { id: "faq-1", question: "Como funciona a pós-graduação EAD?", answer: "A pós-graduação EAD da Faculdade Global é 100% online. Após a matrícula, você recebe acesso imediato à plataforma de estudos, onde pode assistir às aulas, acessar materiais didáticos e realizar as avaliações no seu próprio ritmo, de qualquer lugar e a qualquer hora.", order: 1 },
    { id: "faq-2", question: "O certificado é reconhecido pelo MEC?", answer: "Sim! A Faculdade Global é credenciada pelo MEC através da Portaria nº 1640 de 19/09/2019. Todos os certificados emitidos são válidos em todo o território nacional para fins de progressão de carreira, concursos públicos e titulação acadêmica.", order: 2 },
    { id: "faq-3", question: "Qual a duração dos cursos?", answer: "A maioria dos cursos tem duração de 3 a 4 meses. Alguns cursos específicos podem ter duração de 6 meses. O tempo mínimo é determinado pela carga horária e regulamentação de cada curso.", order: 3 },
    { id: "faq-4", question: "Quais são os pré-requisitos para matrícula?", answer: "Para se matricular em nossos cursos de pós-graduação, é necessário ter concluído uma graduação (bacharelado, licenciatura ou tecnólogo) reconhecida pelo MEC. Você precisará apresentar o diploma ou declaração de conclusão de curso.", order: 4 },
    { id: "faq-5", question: "Como é a metodologia de ensino?", answer: "Nossa metodologia é baseada em conteúdos organizados em módulos, com videoaulas, materiais de leitura, atividades interativas e avaliações online. O ambiente virtual é intuitivo e conta com suporte pedagógico qualificado durante todo o período do curso.", order: 5 },
    { id: "faq-6", question: "Qual o valor dos cursos e formas de pagamento?", answer: "Os valores variam de acordo com cada curso. Oferecemos pagamento em até 12 vezes sem juros no cartão de crédito ou desconto especial para pagamento à vista via PIX. Entre em contato com nossos consultores para conhecer os valores e promoções vigentes.", order: 6 },
    { id: "faq-7", question: "Como acesso a plataforma de estudos?", answer: "Após a confirmação da matrícula e do pagamento, o acesso à plataforma é liberado automaticamente. Você receberá um e-mail com as credenciais de acesso e poderá iniciar seus estudos imediatamente.", order: 7 },
    { id: "faq-8", question: "Posso fazer mais de um curso ao mesmo tempo?", answer: "Sim! Não há limite para a quantidade de cursos simultâneos. Muitos de nossos alunos optam por cursar duas ou mais especializações ao mesmo tempo, otimizando seu tempo de formação.", order: 8 },
    { id: "faq-9", question: "Como funciona a emissão do certificado?", answer: "Após a conclusão de todas as disciplinas e aprovação nas avaliações, o certificado é emitido gratuitamente em formato digital. Caso deseje a versão impressa, ela pode ser solicitada mediante taxa adicional.", order: 9 },
    { id: "faq-10", question: "Quem pode fazer pós-graduação?", answer: "Qualquer pessoa que tenha concluído um curso de graduação reconhecido pelo MEC pode se matricular. Os cursos são voltados para profissionais que desejam se especializar, progredir na carreira ou se atualizar em sua área de atuação.", order: 10 },
    { id: "faq-11", question: "Como entro em contato com o suporte?", answer: "Você pode entrar em contato conosco pelo WhatsApp para atendimento comercial e suporte. Também estamos disponíveis pelo e-mail oficial. Nosso horário de atendimento é de segunda a sexta, das 8h às 18h, e sábado das 8h às 12h.", order: 11 },
  ];

  for (const faq of faqItems) {
    await prisma.faqItem.upsert({
      where: { id: faq.id },
      update: faq,
      create: faq,
    });
  }
  console.log(`  ✓ ${faqItems.length} itens de FAQ criados`);

  // ─── Vantagens ─────────────────────────────────────────────
  const advantages = [
    { id: "adv-1", icon: "Clock", title: "Flexibilidade Total", description: "Estude 100% online, no seu ritmo e de qualquer lugar. Acesse as aulas quando e onde quiser, sem precisar se deslocar.", order: 1 },
    { id: "adv-2", icon: "Wallet", title: "Economia Inteligente", description: "Valores acessíveis com pagamento em até 12x sem juros no cartão ou desconto especial no PIX. Investimento que cabe no seu bolso.", order: 2 },
    { id: "adv-3", icon: "Award", title: "Certificado MEC", description: "Certificado gratuito, válido em todo o Brasil, reconhecido pelo MEC. Ideal para concursos públicos, progressão de carreira e titulação.", order: 3 },
    { id: "adv-4", icon: "Headphones", title: "Suporte Dedicado", description: "Equipe de apoio pedagógico qualificado e atendimento via WhatsApp para tirar suas dúvidas durante toda a sua jornada de estudos.", order: 4 },
  ];

  for (const advantage of advantages) {
    await prisma.advantage.upsert({
      where: { id: advantage.id },
      update: advantage,
      create: advantage,
    });
  }
  console.log(`  ✓ ${advantages.length} vantagens criadas`);

  console.log("\nSeed concluído!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
