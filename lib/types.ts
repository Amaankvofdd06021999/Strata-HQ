// StrataHQ - Core Type Definitions

export type UserRole = 'council_member' | 'property_manager' | 'resident' | 'vendor' | 'admin';

export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type RequestStatus = 'submitted' | 'under_review' | 'approved' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
export type ViolationStatus = 'reported' | 'investigating' | 'confirmed' | 'warning_issued' | 'resolved' | 'dismissed';
export type MeetingType = 'agm' | 'special' | 'council' | 'committee';
export type TaskStatus = 'todo' | 'inprogress' | 'review' | 'completed' | 'blocked';
export type PollStatus = 'draft' | 'active' | 'closed';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unit?: string;
  phone?: string;
  avatar?: string;
  isCouncilMember?: boolean;
  councilPosition?: string;
  joinedDate: string;
  status: 'active' | 'inactive';
}

export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  type: 'residential' | 'mixed_use' | 'commercial';
  yearBuilt: number;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'landscaping' | 'security' | 'common_area' | 'other';
  priority: Priority;
  status: RequestStatus;
  location: string;
  unit?: string;
  submittedBy: string;
  submittedDate: string;
  assignedTo?: string;
  assignedVendor?: string;
  dueDate?: string;
  completedDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  attachments?: Attachment[];
  comments?: Comment[];
  timeline?: TimelineEvent[];
}

export interface Violation {
  id: string;
  title: string;
  description: string;
  category: 'noise' | 'parking' | 'pet' | 'alteration' | 'common_area_misuse' | 'rental' | 'smoking' | 'other';
  status: ViolationStatus;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  reportedBy: string;
  reportedDate: string;
  violator?: string;
  unit?: string;
  location: string;
  evidence?: Attachment[];
  actionTaken?: string;
  resolution?: string;
  resolvedDate?: string;
  fineAmount?: number;
  comments?: Comment[];
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  organizer: string;
  attendees: string[];
  agenda: AgendaItem[];
  minutes?: string;
  documents?: Attachment[];
  decisions?: Decision[];
  actionItems?: ActionItem[];
}

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  presenter: string;
  order: number;
  attachments?: Attachment[];
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  type: 'motion' | 'resolution' | 'approval';
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  passed: boolean;
  meetingId: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: TaskStatus;
  priority: Priority;
  meetingId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignedTo: string[];
  createdBy: string;
  createdDate: string;
  dueDate: string;
  category: string;
  tags: string[];
  progress: number; // 0-100
  subtasks?: SubTask[];
  attachments?: Attachment[];
  comments?: Comment[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Document {
  id: string;
  title: string;
  type: 'bylaw' | 'policy' | 'financial' | 'meeting_minutes' | 'contract' | 'insurance' | 'other';
  category: string;
  uploadedBy: string;
  uploadedDate: string;
  lastModified: string;
  version: string;
  size: number; // in bytes
  fileType: string;
  url: string;
  isPublic: boolean;
  accessLevel: 'all' | 'council' | 'manager' | 'specific_users';
  tags: string[];
  description?: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  type: 'single_choice' | 'multiple_choice' | 'yes_no' | 'rating';
  status: PollStatus;
  createdBy: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  targetAudience: 'all_residents' | 'council' | 'owners_only' | 'specific_units';
  options: PollOption[];
  totalVotes: number;
  isAnonymous: boolean;
  requiresQuorum: boolean;
  quorumPercentage?: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface Amenity {
  id: string;
  name: string;
  type: 'gym' | 'pool' | 'party_room' | 'guest_suite' | 'rooftop' | 'theater' | 'bike_storage' | 'other';
  description: string;
  capacity: number;
  bookingDuration: number; // in hours
  advanceBookingDays: number;
  openingHours: string;
  closingHours: string;
  daysAvailable: string[];
  amenities: string[];
  rules: string[];
  deposit?: number;
  hourlyRate?: number;
  images?: string[];
  isActive: boolean;
}

export interface Booking {
  id: string;
  amenityId: string;
  amenityName: string;
  userId: string;
  userName: string;
  unit: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  purpose: string;
  guests: number;
  specialRequests?: string;
  depositPaid: boolean;
  createdDate: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'maintenance' | 'events' | 'marketplace' | 'questions' | 'suggestions';
  author: string;
  authorId: string;
  createdDate: string;
  lastActivity: string;
  views: number;
  replies: number;
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
  attachments?: Attachment[];
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorId: string;
  createdDate: string;
  likes: number;
  isEdited: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: 'plumber' | 'electrician' | 'hvac' | 'landscaping' | 'cleaning' | 'security' | 'general_contractor' | 'other';
  description: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  address: string;
  rating: number;
  reviewCount: number;
  services: string[];
  availability: string;
  hourlyRate?: number;
  insurance: boolean;
  licensed: boolean;
  preferredVendor: boolean;
  lastUsed?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  type: 'emergency_services' | 'property_manager' | 'council' | 'security' | 'maintenance' | 'utility';
  phone: string;
  email?: string;
  available247: boolean;
  description: string;
  order: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  category: 'maintenance' | 'violation' | 'meeting' | 'poll' | 'document' | 'booking' | 'general';
  isRead: boolean;
  createdDate: string;
  actionUrl?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedDate: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdDate: string;
  isInternal?: boolean; // Only visible to council/managers
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'status_change' | 'assignment' | 'comment' | 'completion';
  user: string;
}

export interface DashboardStats {
  pendingRequests: number;
  activeViolations: number;
  upcomingMeetings: number;
  overdueTasksCount: number;
  totalTasks: number;
  completedThisMonth: number;
  budgetUtilization: number;
  activePolls: number;
}

export interface Activity {
  id: string;
  type: 'request' | 'violation' | 'meeting' | 'task' | 'document' | 'poll' | 'booking';
  title: string;
  description: string;
  date: string;
  user: string;
  status?: string;
  priority?: Priority;
}

// Bylaw Types
export interface Bylaw {
  id: string;
  title: string;
  section: string;
  content: string;
  category: 'general' | 'pets' | 'parking' | 'noise' | 'alterations' | 'rentals' | 'common_areas' | 'governance' | 'financial' | 'other';
  effectiveDate: string;
  lastAmended?: string;
  amendmentHistory?: BylawAmendment[];
  relatedDocuments?: string[];
}

export interface BylawAmendment {
  id: string;
  date: string;
  description: string;
  approvedBy: string;
  voteCount?: {
    for: number;
    against: number;
    abstain: number;
  };
}

export interface BylawSection {
  id: string;
  number: string;
  title: string;
  content: string;
  subsections?: BylawSubsection[];
}

export interface BylawSubsection {
  id: string;
  number: string;
  content: string;
}

// AI Context Settings Types
export interface AIContextSettings {
  id: string;
  buildingId: string;
  geographic: GeographicSettings;
  building: BuildingContextSettings;
  amenities: AmenitySettings;
  parking: ParkingSettings;
  pets: PetSettings;
  rentals: RentalSettings;
  customRules: CustomRule[];
  lastUpdated: string;
}

export interface GeographicSettings {
  province: string;
  city: string;
  jurisdiction: string;
  applicableLaws: string[];
  climateZone?: string;
}

export interface BuildingContextSettings {
  isMultiBuildingComplex: boolean;
  numberOfBuildings?: number;
  buildingNames?: string[];
  totalUnits: number;
  floors: number;
  buildingType: 'highrise' | 'lowrise' | 'townhouse' | 'mixed';
  yearBuilt: number;
  hasElevator: boolean;
  hasStairs: boolean;
}

export interface AmenitySettings {
  hasGym: boolean;
  hasPool: boolean;
  hasHotTub: boolean;
  hasSauna: boolean;
  hasPartyRoom: boolean;
  hasGuestSuite: boolean;
  hasRooftop: boolean;
  hasGarden: boolean;
  hasBikeStorage: boolean;
  hasStorage: boolean;
  hasTheater: boolean;
  hasCoWorking: boolean;
  customAmenities: string[];
}

export interface ParkingSettings {
  hasParkingGarage: boolean;
  hasEVCharging: boolean;
  numberOfEVSpots?: number;
  hasVisitorParking: boolean;
  parkingRules: string[];
  parkingAssignmentType: 'assigned' | 'first_come' | 'permit' | 'mixed';
}

export interface PetSettings {
  petsAllowed: boolean;
  allowedPetTypes: ('dog' | 'cat' | 'bird' | 'fish' | 'other')[];
  maxPetsPerUnit?: number;
  weightLimit?: number;
  breedRestrictions: string[];
  petDeposit?: number;
  additionalRules: string[];
}

export interface RentalSettings {
  rentalsAllowed: boolean;
  rentalRestrictions: 'none' | 'short_term_banned' | 'all_regulated' | 'owner_occupied_only';
  minimumRentalPeriod?: number;
  rentalApprovalRequired: boolean;
  rentalCapPercentage?: number;
}

export interface CustomRule {
  id: string;
  category: string;
  title: string;
  description: string;
  enforcementLevel: 'strict' | 'moderate' | 'guidance';
}

// Onboarding Types
export interface OnboardingProgress {
  userId: string;
  buildingId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  data: Partial<OnboardingData>;
  startedDate: string;
  completedDate?: string;
}

export interface OnboardingData {
  buildingInfo: {
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    totalUnits: number;
    floors: number;
    yearBuilt: number;
    buildingType: string;
  };
  complexInfo: {
    isComplex: boolean;
    numberOfBuildings?: number;
    buildingNames?: string[];
  };
  amenities: string[];
  parking: {
    hasParking: boolean;
    hasEVCharging: boolean;
    parkingType: string;
  };
  pets: {
    allowed: boolean;
    types?: string[];
    restrictions?: string;
  };
  rentals: {
    allowed: boolean;
    restrictions?: string;
  };
  governance: {
    councilSize: number;
    meetingFrequency: string;
    fiscalYearEnd: string;
  };
}

// Manager Forum Types
export interface ManagerForumPost {
  id: string;
  title: string;
  content: string;
  category: 'best_practices' | 'legal' | 'financial' | 'maintenance' | 'conflict_resolution' | 'technology' | 'general';
  authorRole: 'council_member' | 'property_manager';
  authorRegion?: string;
  createdDate: string;
  lastActivity: string;
  views: number;
  replies: number;
  isPinned: boolean;
  tags: string[];
  isAnonymous: boolean;
}

export interface ManagerForumReply {
  id: string;
  postId: string;
  content: string;
  authorRole: 'council_member' | 'property_manager';
  authorRegion?: string;
  createdDate: string;
  likes: number;
  isAnonymous: boolean;
  isHelpful: boolean;
}
