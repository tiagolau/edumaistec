import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { INSTITUTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    `Política de Privacidade da ${INSTITUTION.name}. Saiba como tratamos seus dados pessoais.`,
};

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="bg-primary-dark py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Política de Privacidade
            </h1>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-neutral max-w-none text-muted-foreground [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-3 [&_li]:mb-1">
              <p className="text-sm text-muted-foreground">
                Última atualização: Fevereiro de 2026
              </p>

              <h2>1. Introdução</h2>
              <p>
                A {INSTITUTION.name} ({INSTITUTION.legalName}, CNPJ:{" "}
                {INSTITUTION.cnpj}) valoriza a privacidade de seus usuários e
                está comprometida em proteger os dados pessoais coletados por
                meio de nosso site e plataforma educacional, em conformidade com
                a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
              </p>

              <h2>2. Dados Coletados</h2>
              <p>Podemos coletar os seguintes dados pessoais:</p>
              <ul className="list-disc pl-5">
                <li>Nome completo, CPF, data de nascimento</li>
                <li>Endereço de e-mail e número de telefone</li>
                <li>Endereço residencial</li>
                <li>Dados acadêmicos (graduação, instituição de origem)</li>
                <li>Dados de navegação (cookies, IP, dispositivo)</li>
              </ul>

              <h2>3. Finalidade do Tratamento</h2>
              <p>Os dados coletados são utilizados para:</p>
              <ul className="list-disc pl-5">
                <li>Efetivação da matrícula e prestação dos serviços educacionais</li>
                <li>Comunicação institucional e acadêmica</li>
                <li>Emissão de certificados</li>
                <li>Cumprimento de obrigações legais e regulatórias</li>
                <li>Melhoria contínua dos nossos serviços</li>
              </ul>

              <h2>4. Compartilhamento de Dados</h2>
              <p>
                Seus dados pessoais não são vendidos ou compartilhados com
                terceiros para fins comerciais. Podemos compartilhar dados
                apenas com:
              </p>
              <ul className="list-disc pl-5">
                <li>Órgãos reguladores (MEC, INEP) quando exigido por lei</li>
                <li>Prestadores de serviços essenciais (hospedagem, pagamento)</li>
                <li>Autoridades competentes, mediante ordem judicial</li>
              </ul>

              <h2>5. Segurança dos Dados</h2>
              <p>
                Adotamos medidas técnicas e organizacionais para proteger seus
                dados pessoais contra acesso não autorizado, destruição,
                perda, alteração ou qualquer forma de tratamento inadequado.
              </p>

              <h2>6. Direitos do Titular</h2>
              <p>
                Conforme a LGPD, você tem direito a: confirmação da existência
                de tratamento, acesso aos dados, correção, anonimização,
                bloqueio ou eliminação, portabilidade, informação sobre
                compartilhamento e revogação do consentimento.
              </p>

              <h2>7. Cookies</h2>
              <p>
                Utilizamos cookies para melhorar a experiência de navegação,
                analisar o tráfego do site e personalizar conteúdos. Você pode
                gerenciar as preferências de cookies através das configurações
                do seu navegador.
              </p>

              <h2>8. Contato</h2>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta
                política, entre em contato conosco pelo e-mail{" "}
                <a
                  href={`mailto:${INSTITUTION.contacts.email}`}
                  className="text-primary hover:underline"
                >
                  {INSTITUTION.contacts.email}
                </a>{" "}
                ou pelo telefone {INSTITUTION.contacts.whatsapp}.
              </p>

              <h2>9. Alterações</h2>
              <p>
                Esta política pode ser atualizada periodicamente. Recomendamos
                que consulte esta página regularmente para se manter informado
                sobre como protegemos suas informações.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
