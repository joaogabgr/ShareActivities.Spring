export interface Family {
  id: string;
  name: string;
  description?: string;
  isOwner: boolean;
}

export interface FamilyMember {
  id: string;
  email: string;
  name: string;
  role: 'OWNER' | 'MEMBER';
}

export interface CreateFamilyRequest {
  name: string;
  description?: string;
}

export interface UpdateFamilyRequest {
  id: string;
  name: string;
  description?: string;
}

export interface InviteMemberRequest {
  familyId: string;
  userEmail: string;
  invitedEmail: string;
}

export interface FamilyInvitation {
  id: string;
  familyId: string;
  familyName: string;
  invitedBy: string;
  invitedByName: string;
  invitedUserEmail: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface InvitationResponseUser {
  id: string;
  name: string;
  cpf: string;
  email: string;
  expoToken: string | null;
  role: string;
}

export interface InvitationResponseFamily {
  id: string;
  name: string;
}

export interface InvitationResponse {
  id: string;
  invitedUser: InvitationResponseUser;
  user: InvitationResponseUser;
  family: InvitationResponseFamily;
}

export interface InvitationsResponseData {
  status: number;
  model: InvitationResponse[];
}

export interface FamilyMemberResponse {
  userId: string;
  userName: string;
  userEmail: string;
  isAdmin: boolean;
}

export interface FamilyMembersResponseData {
  status: number;
  model: FamilyMemberResponse[];
} 