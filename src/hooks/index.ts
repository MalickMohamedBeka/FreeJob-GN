/**
 * Hooks Index
 * Central export point for all custom hooks
 */

export { useDebounce } from './useDebounce';
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from './useMediaQuery';
export { useIntersectionObserver } from './useIntersectionObserver';
import { useIsMobile } from './use-mobile';
export { useToast, toast } from './use-toast';
export {
  useProjects,
  useProject,
  useMyProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useSubmitProjectForReview,
} from './useProjects';
export { useFreelancers, useFreelancer } from './useFreelancers';
export {
  useProposals,
  useProposalsByProject,
  useCreateProposal,
  useWithdrawProposal,
  useConfirmProposal,
  useShortlistProposal,
  useUnshortlistProposal,
  useSelectProposal,
  useRefuseProposal,
} from './useProposals';
export {
  useContracts,
  useContractDetail,
  useContractSummary,
  useContractMilestones,
  useCreateMilestone,
  useDeliverMilestone,
  useReleaseMilestone,
} from './useContracts';
export {
  useFreelanceProfile,
  useUpdateFreelanceProfile,
  useUpdateProfilePicture,
  useFreelanceDocuments,
  useUploadDocument,
  useDeleteDocument,
  useClientProfile,
  useCreateClientProfile,
  useUpdateClientProfile,
} from './useProfile';
export { useProfileInit } from './useProfileInit';
export { useConversation, useMessages, useSendMessage } from './useMessages';
