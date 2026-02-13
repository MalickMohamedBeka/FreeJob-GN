// API types matching Django REST API schemas

// ── Auth ──

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  user: ApiUser;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  role: 'CLIENT' | 'PROVIDER';
  provider_kind?: 'FREELANCE' | 'AGENCY' | null;
}

export interface RegisterResponse {
  message: string;
  needs_activation: boolean;
  email: string;
}

export interface ActivationRequest {
  uid: string;
  token: string;
}

export interface ActivationResponse {
  message: string;
}

export interface TokenRefreshResponse {
  access: string;
}

export interface LogoutResponse {
  message: string;
}

// ── User ──

export interface ApiUser {
  id: number;
  email: string;
  username: string;
  role: 'CLIENT' | 'PROVIDER';
  provider_kind: 'FREELANCE' | 'AGENCY' | null;
  is_active: boolean;
  date_joined: string;
}

export interface ApiUserMini {
  id: number;
  username: string;
}

// ── Pagination ──

export interface DjangoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Skills & Categories ──

export interface ApiSkill {
  id: number;
  name: string;
}

export interface ApiSpeciality {
  id: number;
  name: string;
  description?: string;
}

export interface ApiCategory {
  id: string;
  name: string;
}

// ── Projects ──

export type ProjectStatusEnum =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'IN_PROGRESS'
  | 'CLOSED'
  | 'REJECTED'
  | 'CANCELLED';

export type BudgetBandEnum = 'BAND_25_50' | 'BAND_50_100' | 'BAND_100_PLUS';

export interface ApiProjectList {
  id: string;
  title: string;
  description: string;
  category: ApiCategory;
  budget_band: BudgetBandEnum;
  budget_band_display: string;
  budget_amount: string;
  skills: ApiSkill[];
  speciality: ApiSpeciality;
  deadline: string | null;
  status: ProjectStatusEnum;
  status_display: string;
  client: ApiUserMini;
  created_at: string;
  updated_at: string;
}

export interface ApiProjectDetail extends ApiProjectList {
  review_note: string;
}

export interface ApiProjectMini {
  id: string;
  title: string;
  status: ProjectStatusEnum;
}

// ── Proposals ──

export type ProposalStatusEnum =
  | 'PENDING'
  | 'SHORTLISTED'
  | 'SELECTED'
  | 'CONFIRMED'
  | 'DECLINED_BY_PROVIDER'
  | 'REFUSED'
  | 'REFUSED_AUTOCLOSE'
  | 'WITHDRAWN';

export interface ApiProposalList {
  id: string;
  project: ApiProjectMini;
  provider: ApiUserMini;
  price: string;
  duration_days: number;
  message: string;
  status: ProposalStatusEnum;
  status_display: string;
  decided_at: string | null;
  selected_at: string | null;
  selection_expires_at: string | null;
  decision_reason: string;
  created_at: string;
  updated_at: string;
}

export type ApiProposalDetail = ApiProposalList;

export interface ApiProposalCreateRequest {
  project_id: string;
  price: string;
  duration_days: number;
  message: string;
}

// ── Contracts ──

export type ContractStatusEnum = 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface ApiContractList {
  id: string;
  project: ApiProjectMini;
  client: ApiUserMini;
  provider: ApiUserMini;
  total_amount: string;
  funding_plan: string;
  funding_plan_display: string;
  status: ContractStatusEnum;
  status_display: string;
  start_at: string;
  end_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiContractDetail extends ApiContractList {
  proposal: { id: string; status: ProposalStatusEnum; price: string };
  provider_kind_snapshot: string;
}

// ── Freelancer Profile ──

export interface FreelanceDetails {
  first_name: string;
  last_name: string;
  business_name?: string;
}

export interface ApiFreelancerProfile {
  id: number;
  username: string;
  email: string;
  profile_picture: string | null;
  bio: string;
  hourly_rate: string | null;
  city_or_region: string;
  country: string;
  postal_code: string;
  phone: string;
  skills: ApiSkill[];
  speciality: ApiSpeciality;
  freelance_details: FreelanceDetails;
  created_at: string;
  updated_at: string;
}

// ── Conversations & Messages ──

export interface ApiConversation {
  id: string;
  proposal_id: string;
  proposal_status: string;
  client: ApiUserMini;
  provider: ApiUserMini;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ApiMessage {
  id: string;
  author: ApiUserMini;
  content: string;
  created_at: string;
}

// ── Public ──

export interface PublicStats {
  clients_count: number;
  providers_count: number;
  freelances_count: number;
  agencies_count: number;
}

export interface ChoiceItem {
  value: string;
  label: string;
}

export interface RegistrationOptions {
  roles: ChoiceItem[];
  provider_kinds: ChoiceItem[];
  rules: {
    provider_kind_required_if_role: string;
    provider_kind_forbidden_if_role: string;
  };
}

// ── Error ──

export interface ApiErrorResponse {
  detail?: string;
  [key: string]: unknown;
}
