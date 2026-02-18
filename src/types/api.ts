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

// ── Client Profile ──

export interface ApiClientProfileData {
  id: number;
  client_type: 'INDIVIDUAL' | 'COMPANY';
  city_or_region: string;
  country: string;
  postal_code: string;
  phone: string;
  profile_picture: string | null;
  details: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ApiClientProfile {
  user: {
    id: number;
    email: string;
    username: string;
    role: 'CLIENT' | 'PROVIDER';
  };
  client_profile: ApiClientProfileData | null;
}

export interface ClientProfileIndividualCreateRequest {
  client_type: 'INDIVIDUAL';
  city_or_region: string;
  country: string;
  first_name: string;
  last_name: string;
  postal_code?: string;
  phone?: string;
}

export interface ClientProfileCompanyCreateRequest {
  client_type: 'COMPANY';
  city_or_region: string;
  country: string;
  company_name: string;
  postal_code?: string;
  phone?: string;
}

export type ClientProfileCreateRequest =
  | ClientProfileIndividualCreateRequest
  | ClientProfileCompanyCreateRequest;

export interface PatchedClientProfileUpdateRequest {
  city_or_region?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
}

// ── Contract Summary ──

export interface ContractSummary {
  total_amount: string;
  total_funded: string;
  total_released: string;
  total_refunded: string;
  remaining_to_fund: string;
  remaining_in_escrow: string;
  milestones_count: number;
  milestones_by_status: Record<string, number>;
}

// ── Milestones ──

export type MilestoneStatusEnum =
  | 'PENDING'
  | 'FUNDED'
  | 'DELIVERED'
  | 'RELEASED'
  | 'REFUNDED'
  | 'CANCELLED';

export interface ApiMilestone {
  id: string;
  order: number;
  title: string;
  description: string;
  amount: string;
  due_date: string | null;
  status: MilestoneStatusEnum;
  status_display: string;
  funded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MilestoneCreateRequest {
  title: string;
  amount: string;
  description?: string;
  due_date?: string | null;
  order?: number;
}

// ── Project Write ──

export interface ApiProjectCreateRequest {
  title: string;
  description: string;
  category_id: string;
  budget_band: BudgetBandEnum;
  budget_amount: string;
  skill_ids?: number[];
  speciality_id?: number | null;
  deadline?: string | null;
}

export interface ApiProjectPatchRequest {
  title?: string;
  description?: string;
  category_id?: string;
  budget_band?: BudgetBandEnum;
  budget_amount?: string;
  skill_ids?: number[];
  speciality_id?: number | null;
  deadline?: string | null;
}

// ── Freelance Profile Update ──

export interface FreelanceProfilePatchRequest {
  bio?: string;
  hourly_rate?: string | null;
  city_or_region?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  skill_ids?: number[];
  speciality_id?: number | null;
  freelance?: {
    first_name?: string;
    last_name?: string;
    business_name?: string;
  };
}

// ── Freelance Documents ──

export type FreelanceDocTypeEnum =
  | 'CV'
  | 'CERTIFICATION'
  | 'PORTFOLIO'
  | 'IDENTITY'
  | 'OTHER'
  | 'RCCM'
  | 'STATUTES'
  | 'TAX';

export interface ApiFreelanceDocument {
  id: number;
  doc_type: FreelanceDocTypeEnum;
  file: string;
  title: string;
  reference_number: string;
  issued_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Error ──

export interface ApiErrorResponse {
  detail?: string;
  [key: string]: unknown;
}
