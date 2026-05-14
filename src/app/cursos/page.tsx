import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { CourseList } from "@/components/cursos/course-list";
import { getCourses, getAreas } from "@/lib/services/courses";
import type { Course, CourseArea } from "@/types/course";

export const dynamic = "force-dynamic"; // rota redirecionada via next.config.ts — evita fetch no build

export const metadata: Metadata = {
  title: "Cursos Técnicos EAD",
  description:
    "Explore mais de 60 cursos técnicos EAD com diploma reconhecido pelo MEC. Encontre o curso ideal para sua carreira profissional.",
};

async function CourseListLoader() {
  const [courses, areas] = await Promise.all([getCourses(), getAreas()]);

  return (
    <CourseList
      initialCourses={courses as Course[]}
      initialAreas={areas as CourseArea[]}
    />
  );
}

export default function CursosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="bg-primary-dark py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Cursos Técnicos EAD
            </h1>
            <p className="mt-3 text-base text-white/80 sm:text-lg">
              Encontre o curso técnico ideal entre mais de 60 opções 100% online
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Suspense
              fallback={
                <div className="py-12 text-center text-muted-foreground">
                  Carregando cursos...
                </div>
              }
            >
              <CourseListLoader />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
