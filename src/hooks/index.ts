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
  useInitiatePayment,
  useCheckTransactionStatus,
  useConfirmOTP,
} from './useContracts';
export {
  useFreelanceProfile,
  useUpdateFreelanceProfile,
  useUpdateProfilePicture,
  useFreelanceDocuments,
  useUploadDocument,
  useDeleteDocument,
  useFreelanceDocument,
  usePatchFreelanceDocument,
  useClientProfile,
  useCreateClientProfile,
  useUpdateClientProfile,
  useClientCompanyDocuments,
  useUploadClientDocument,
  useDeleteClientDocument,
  useClientDocument,
  usePatchClientDocument,
} from './useProfile';
export { useProfileInit } from './useProfileInit';
export { useConversation, useMessages, useSendMessage } from './useMessages';
export { usePublicStats, useRegistrationOptions, useResendActivation } from './useAuth';
export { useSubscriptionPlans, useMySubscription, useSubscriptionUsage, useSubscriptionPayments, useSubscribe, useCancelSubscription } from './useSubscriptions';
export { useSkills, useSpecialities, useSkillsBySpeciality } from './useSkills';
export {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useDeleteNotification,
  useMarkAllRead,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useResetNotificationPreferences,
  useNotificationTypes,
} from './useNotifications';
