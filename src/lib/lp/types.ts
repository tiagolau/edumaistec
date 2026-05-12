export type FormFieldType = "text" | "email" | "phone" | "select" | "checkbox";

export type FormFieldConfig = {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
};

export type LandingPageWithCount = {
  id: string;
  slug: string;
  title: string;
  bannerUrl: string | null;
  redirectUrl: string;
  webhookUrl: string | null;
  formFields: FormFieldConfig[];
  active: boolean;
  createdAt: Date;
  _count: { submissions: number };
};

/* ── snake_case row types from Supabase/PostgREST ── */

export type LpWorkspaceRow = {
  id: string;
  token: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type LandingPageRow = {
  id: string;
  slug: string;
  title: string;
  banner_url: string | null;
  banner_path: string | null;
  redirect_url: string;
  webhook_url: string | null;
  form_fields: FormFieldConfig[];
  active: boolean;
  created_at: string;
  updated_at: string;
  workspace_id: string;
};

export type LpSubmissionRow = {
  id: string;
  data: Record<string, unknown>;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  landing_page_id: string;
};

/* ── Helpers: convert DB rows to the camelCase shape the frontend expects ── */

export function lpRowToCamel(row: LandingPageRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    bannerUrl: row.banner_url,
    bannerPath: row.banner_path,
    redirectUrl: row.redirect_url,
    webhookUrl: row.webhook_url,
    formFields: row.form_fields,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    workspaceId: row.workspace_id,
  };
}

export function lpRowToCamelWithCount(
  row: LandingPageRow & { lp_submissions: { count: number }[] },
) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    bannerUrl: row.banner_url,
    bannerPath: row.banner_path,
    redirectUrl: row.redirect_url,
    webhookUrl: row.webhook_url,
    formFields: row.form_fields,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    workspaceId: row.workspace_id,
    _count: {
      submissions: row.lp_submissions?.[0]?.count ?? 0,
    },
  };
}

export function submissionRowToCamel(row: LpSubmissionRow) {
  return {
    id: row.id,
    data: row.data,
    ip: row.ip,
    userAgent: row.user_agent,
    createdAt: row.created_at,
    landingPageId: row.landing_page_id,
  };
}
