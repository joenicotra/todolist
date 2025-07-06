import { User } from '../types/core';
import { ApiResponse } from '../types/api';
import { apiClient } from './api';
import { MockStorage, STORAGE_KEYS, mockDelay, MockDataGenerator } from './mock';

// Collaboration types
export interface ShareRequest {
  entityType: 'task' | 'project' | 'area';
  entityId: string;
  userEmail: string;
  permission: 'read' | 'write' | 'admin';
}

export interface ShareResponse {
  id: string;
  entityType: string;
  entityId: string;
  userId: string;
  permission: string;
  createdAt: string;
}

export interface CollaboratorInfo {
  user: User;
  permission: 'read' | 'write' | 'admin';
  sharedAt: string;
}

// Collaboration service interface
export interface CollaborationService {
  shareEntity(request: ShareRequest): Promise<ShareResponse>;
  getCollaborators(entityType: string, entityId: string): Promise<CollaboratorInfo[]>;
  updatePermission(shareId: string, permission: string): Promise<ShareResponse>;
  removeCollaborator(shareId: string): Promise<void>;
  getSharedWithMe(): Promise<ShareResponse[]>;
  acceptShare(shareId: string): Promise<void>;
  rejectShare(shareId: string): Promise<void>;
}

// Mock implementation for development
class MockCollaborationService implements CollaborationService {
  private getShares(): ShareResponse[] {
    return MockStorage.get<ShareResponse[]>('todolist_mock_shares') || [];
  }

  private saveShares(shares: ShareResponse[]): void {
    MockStorage.set('todolist_mock_shares', shares);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  async shareEntity(request: ShareRequest): Promise<ShareResponse> {
    await mockDelay();

    const shares = this.getShares();
    const newShare: ShareResponse = {
      id: this.generateId(),
      entityType: request.entityType,
      entityId: request.entityId,
      userId: this.generateId(), // Mock user ID
      permission: request.permission,
      createdAt: new Date().toISOString(),
    };

    shares.push(newShare);
    this.saveShares(shares);

    return newShare;
  }

  async getCollaborators(entityType: string, entityId: string): Promise<CollaboratorInfo[]> {
    await mockDelay();

    const shares = this.getShares();
    const entityShares = shares.filter(
      share => share.entityType === entityType && share.entityId === entityId
    );

    // Generate mock collaborator info
    return entityShares.map(share => ({
      user: MockDataGenerator.generateUser(),
      permission: share.permission as 'read' | 'write' | 'admin',
      sharedAt: share.createdAt,
    }));
  }

  async updatePermission(shareId: string, permission: string): Promise<ShareResponse> {
    await mockDelay();

    const shares = this.getShares();
    const shareIndex = shares.findIndex(share => share.id === shareId);

    if (shareIndex === -1) {
      throw new Error(`Share with id ${shareId} not found`);
    }

    const existingShare = shares[shareIndex];
    if (!existingShare) {
      throw new Error(`Share with id ${shareId} not found`);
    }

    existingShare.permission = permission;
    this.saveShares(shares);

    return existingShare;
  }

  async removeCollaborator(shareId: string): Promise<void> {
    await mockDelay();

    const shares = this.getShares();
    const filteredShares = shares.filter(share => share.id !== shareId);

    if (filteredShares.length === shares.length) {
      throw new Error(`Share with id ${shareId} not found`);
    }

    this.saveShares(filteredShares);
  }

  async getSharedWithMe(): Promise<ShareResponse[]> {
    await mockDelay();

    // In a real implementation, this would filter by current user
    // For mock, return a subset of shares
    const shares = this.getShares();
    return shares.slice(0, 3); // Return first 3 as example
  }

  async acceptShare(shareId: string): Promise<void> {
    await mockDelay();
    // In mock implementation, just log the action
    console.log(`Accepted share: ${shareId}`);
  }

  async rejectShare(shareId: string): Promise<void> {
    await mockDelay();
    // In mock implementation, remove the share
    await this.removeCollaborator(shareId);
  }
}

// Production implementation
class ProductionCollaborationService implements CollaborationService {
  async shareEntity(request: ShareRequest): Promise<ShareResponse> {
    const response = await apiClient.post<ShareResponse>('/collaboration/share', request);
    return response.data;
  }

  async getCollaborators(entityType: string, entityId: string): Promise<CollaboratorInfo[]> {
    const response = await apiClient.get<CollaboratorInfo[]>(
      `/collaboration/${entityType}/${entityId}/collaborators`
    );
    return response.data;
  }

  async updatePermission(shareId: string, permission: string): Promise<ShareResponse> {
    const response = await apiClient.patch<ShareResponse>(
      `/collaboration/shares/${shareId}`,
      { permission }
    );
    return response.data;
  }

  async removeCollaborator(shareId: string): Promise<void> {
    await apiClient.delete(`/collaboration/shares/${shareId}`);
  }

  async getSharedWithMe(): Promise<ShareResponse[]> {
    const response = await apiClient.get<ShareResponse[]>('/collaboration/shared-with-me');
    return response.data;
  }

  async acceptShare(shareId: string): Promise<void> {
    await apiClient.post(`/collaboration/shares/${shareId}/accept`);
  }

  async rejectShare(shareId: string): Promise<void> {
    await apiClient.post(`/collaboration/shares/${shareId}/reject`);
  }
}

// Export the appropriate service based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
export const collaborationService: CollaborationService = isDevelopment
  ? new MockCollaborationService()
  : new ProductionCollaborationService();

// Export individual methods for convenience
export const shareEntity = (request: ShareRequest) => collaborationService.shareEntity(request);
export const getCollaborators = (entityType: string, entityId: string) =>
  collaborationService.getCollaborators(entityType, entityId);
export const updatePermission = (shareId: string, permission: string) =>
  collaborationService.updatePermission(shareId, permission);
export const removeCollaborator = (shareId: string) => collaborationService.removeCollaborator(shareId);
export const getSharedWithMe = () => collaborationService.getSharedWithMe();
export const acceptShare = (shareId: string) => collaborationService.acceptShare(shareId);
export const rejectShare = (shareId: string) => collaborationService.rejectShare(shareId);
