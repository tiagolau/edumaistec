import { edunoFetch } from "./client";
import type {
  EdunoCourseListResponse,
  EdunoCourseDetailedListResponse,
  EdunoCourseDetailResponse,
  EdunoAreaListResponse,
  EdunoEnrollmentRequest,
  EdunoEnrollmentResponse,
  EdunoConfirmEnrollmentRequest,
  EdunoProposalRequest,
  EdunoProposalResponse,
} from "@/types/eduno";

// === Cursos ===

export async function fetchCourses(): Promise<EdunoCourseListResponse> {
  return edunoFetch<EdunoCourseListResponse>("/cursos", {
    next: { revalidate: 3600 }, // cache 1h
  });
}

export async function fetchCoursesDetailed(): Promise<EdunoCourseDetailedListResponse> {
  return edunoFetch<EdunoCourseDetailedListResponse>("/cursos/detalhado", {
    next: { revalidate: 3600 }, // cache 1h
  });
}

export async function fetchCourseDetail(
  courseId: number,
): Promise<EdunoCourseDetailResponse> {
  return edunoFetch<EdunoCourseDetailResponse>(`/infocurso/${courseId}`, {
    next: { revalidate: 3600 },
  });
}

// === Áreas de Interesse ===

export async function fetchAreas(): Promise<EdunoAreaListResponse> {
  return edunoFetch<EdunoAreaListResponse>("/areasdeinteresse", {
    next: { revalidate: 86400 }, // cache 24h
  });
}

// === Matrícula ===

export async function submitEnrollment(
  data: EdunoEnrollmentRequest,
): Promise<EdunoEnrollmentResponse> {
  return edunoFetch<EdunoEnrollmentResponse>("/matricular", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export async function confirmEnrollment(
  data: EdunoConfirmEnrollmentRequest,
): Promise<EdunoEnrollmentResponse> {
  return edunoFetch<EdunoEnrollmentResponse>("/confirmarmatricula", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

// === Propostas ===

export async function generateProposal(
  data: EdunoProposalRequest,
): Promise<EdunoProposalResponse> {
  return edunoFetch<EdunoProposalResponse>("/proposta/gerar", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}
