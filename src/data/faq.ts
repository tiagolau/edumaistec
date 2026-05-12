import { FaqItem } from "@/types/course";
import { INSTITUTION } from "@/lib/constants";

export const faqItems: FaqItem[] = [
  {
    id: "1",
    question: "O que é o curso técnico por competência?",
    answer:
      "É uma modalidade de formação profissional, prevista no Art. 41 da LDB (Lei 9.394/96), que reconhece e certifica habilidades e conhecimentos adquiridos na prática de trabalho. Em vez de cursar toda a grade tradicional, o profissional demonstra suas competências por meio de avaliações, obtendo um diploma técnico idêntico ao de um curso regular.",
    order: 1,
  },
  {
    id: "2",
    question: "Quem pode fazer? Quais são os pré-requisitos?",
    answer:
      "Para se matricular, é necessário ter o Ensino Médio completo e pelo menos 1 ano de experiência profissional comprovada na área do curso escolhido. Os documentos exigidos são: RG, CPF, comprovante de residência e declaração de experiência profissional emitida por empregador ou comprovação equivalente (carteira de trabalho, contratos, etc.).",
    order: 2,
  },
  {
    id: "3",
    question: "O certificado tem validade? É cadastrado no MEC?",
    answer:
      `Sim! A ${INSTITUTION.name} é cadastrada no SISTEC — Sistema Nacional de Informações da Educação Profissional e Tecnológica do MEC. O diploma recebe um código autenticador que pode ser verificado em sistec.mec.gov.br. Tem validade em todo o território nacional para concursos públicos, registro em conselhos de classe e progressão de carreira.`,
    order: 3,
  },
  {
    id: "4",
    question: "O diploma é diferente de um curso técnico regular?",
    answer:
      "Não. O diploma emitido é idêntico ao de qualquer curso técnico presencial ou EAD tradicional, sem nenhuma menção ao método de certificação por competência. Tem a mesma validade legal, o mesmo registro no SISTEC/MEC e os mesmos direitos.",
    order: 4,
  },
  {
    id: "5",
    question: "Como funciona o processo de avaliação?",
    answer:
      "Após a matrícula, você acessa a plataforma EAD com videoaulas e materiais de estudo. Ao se sentir preparado, realiza as avaliações online de cada módulo. É necessário um aproveitamento mínimo de 70%. Caso não atinja a nota em algum módulo, você pode refazer a avaliação daquele módulo específico.",
    order: 5,
  },
  {
    id: "6",
    question: "Quanto tempo leva para concluir?",
    answer:
      "O tempo de conclusão depende do seu ritmo de estudo. Como você já possui experiência na área, os cursos podem ser concluídos em poucos meses. A maioria dos alunos conclui em até 6 meses, mas o prazo é flexível.",
    order: 6,
  },
  {
    id: "7",
    question: "Como comprovo minha experiência profissional?",
    answer:
      "A comprovação pode ser feita por meio de: declaração do empregador constando funções desempenhadas e período de atuação, carteira de trabalho (CTPS), contratos de prestação de serviço, ou outros documentos que atestem sua experiência na área por pelo menos 1 ano.",
    order: 7,
  },
  {
    id: "8",
    question: "Qual o valor dos cursos e formas de pagamento?",
    answer:
      "As mensalidades são acessíveis, a partir de R$ 83,34. Oferecemos parcelamento em até 12 vezes sem juros no cartão de crédito. Entre em contato com nossa equipe para conhecer os valores e promoções vigentes.",
    order: 8,
  },
  {
    id: "9",
    question: "Como funciona a emissão do certificado?",
    answer:
      "Após a conclusão de todos os módulos e aprovação nas avaliações (mínimo 70%), o certificado é emitido em formato digital com código autenticador do SISTEC. O documento tem validade nacional e pode ser utilizado imediatamente no mercado de trabalho, concursos e registro em conselhos profissionais.",
    order: 9,
  },
  {
    id: "10",
    question: "Como entro em contato com o suporte?",
    answer:
      `Você pode entrar em contato conosco pelo WhatsApp ${INSTITUTION.contacts.whatsapp} para atendimento comercial e suporte. Também estamos disponíveis pelo e-mail ${INSTITUTION.contacts.email}. Atendemos de segunda a sexta, das 8h às 18h, e sábado das 8h às 12h.`,
    order: 10,
  },
];
