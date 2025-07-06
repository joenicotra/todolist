import { Area } from '../types/core';
import {
  CreateAreaRequest,
  UpdateAreaRequest,
  GetAreasParams,
  ApiResponse
} from '../types/api';
import { apiClient } from './api';
import { MockStorage, STORAGE_KEYS, mockDelay } from './mock';

// Area service interface
export interface AreaService {
  getAreas(params?: GetAreasParams): Promise<Area[]>;
  getAreaById(id: string): Promise<Area | null>;
  createArea(area: CreateAreaRequest): Promise<Area>;
  updateArea(id: string, updates: UpdateAreaRequest): Promise<Area>;
  deleteArea(id: string): Promise<void>;
  reorderAreas(areaIds: string[]): Promise<Area[]>;
}

// Mock implementation for development
class MockAreaService implements AreaService {
  private getStoredAreas(): Area[] {
    return MockStorage.get<Area[]>(STORAGE_KEYS.AREAS) || [];
  }

  private saveAreas(areas: Area[]): void {
    MockStorage.set(STORAGE_KEYS.AREAS, areas);
  }

  async getAreas(params?: GetAreasParams): Promise<Area[]> {
    await mockDelay();
    return this.getStoredAreas();
  }

  async getAreaById(id: string): Promise<Area | null> {
    await mockDelay(100, 300);
    const areas = this.getStoredAreas();
    return areas.find(area => area.id === id) || null;
  }

  async createArea(areaData: CreateAreaRequest): Promise<Area> {
    await mockDelay();

    const areas = this.getStoredAreas();
    const newArea: Area = {
      id: Math.random().toString(36).substr(2, 9),
      name: areaData.name,
      organization_id: 'mock_org_id',
      created_by: 'mock_user_id',
      sort_order: areas.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (areaData.notes !== undefined) {
      newArea.notes = areaData.notes;
    }

    areas.push(newArea);
    this.saveAreas(areas);

    return newArea;
  }

  async updateArea(id: string, updates: UpdateAreaRequest): Promise<Area> {
    await mockDelay();

    const areas = this.getStoredAreas();
    const areaIndex = areas.findIndex(area => area.id === id);

    if (areaIndex === -1) {
      throw new Error(`Area with id ${id} not found`);
    }

    const existingArea = areas[areaIndex];
    if (!existingArea) {
      throw new Error('Area not found');
    }

    const updatedArea: Area = {
      id: existingArea.id,
      name: updates.name !== undefined ? updates.name : existingArea.name,
      organization_id: existingArea.organization_id,
      created_by: existingArea.created_by,
      sort_order: updates.sort_order !== undefined ? updates.sort_order : existingArea.sort_order,
      created_at: existingArea.created_at,
      updated_at: new Date().toISOString(),
    };

    if (updates.notes !== undefined) {
      updatedArea.notes = updates.notes;
    } else if (existingArea.notes !== undefined) {
      updatedArea.notes = existingArea.notes;
    }

    areas[areaIndex] = updatedArea;
    this.saveAreas(areas);

    return updatedArea;
  }

  async deleteArea(id: string): Promise<void> {
    await mockDelay();

    const areas = this.getStoredAreas();
    const filteredAreas = areas.filter(area => area.id !== id);

    if (filteredAreas.length === areas.length) {
      throw new Error(`Area with id ${id} not found`);
    }

    this.saveAreas(filteredAreas);
  }

  async reorderAreas(areaIds: string[]): Promise<Area[]> {
    await mockDelay();

    const areas = this.getStoredAreas();
    const reorderedAreas: Area[] = [];

    areaIds.forEach((id, index) => {
      const area = areas.find(a => a.id === id);
      if (area) {
        const updatedArea: Area = {
          ...area,
          sort_order: index,
          updated_at: new Date().toISOString(),
        };
        const areaIndex = areas.findIndex(a => a.id === id);
        areas[areaIndex] = updatedArea;
        reorderedAreas.push(updatedArea);
      }
    });

    this.saveAreas(areas);
    return reorderedAreas;
  }
}

// Production implementation
class ProductionAreaService implements AreaService {
  async getAreas(params?: GetAreasParams): Promise<Area[]> {
    const config = params ? { params } : {};
    const response = await apiClient.get<Area[]>('/areas', config);
    return response.data;
  }

  async getAreaById(id: string): Promise<Area | null> {
    try {
      const response = await apiClient.get<Area>(`/areas/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createArea(area: CreateAreaRequest): Promise<Area> {
    const response = await apiClient.post<Area>('/areas', area);
    return response.data;
  }

  async updateArea(id: string, updates: UpdateAreaRequest): Promise<Area> {
    const response = await apiClient.patch<Area>(`/areas/${id}`, updates);
    return response.data;
  }

  async deleteArea(id: string): Promise<void> {
    await apiClient.delete(`/areas/${id}`);
  }

  async reorderAreas(areaIds: string[]): Promise<Area[]> {
    const response = await apiClient.patch<Area[]>('/areas/reorder', { areaIds });
    return response.data;
  }
}

// Export the appropriate service based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
export const areaService: AreaService = isDevelopment
  ? new MockAreaService()
  : new ProductionAreaService();

// Export individual methods for convenience
export const getAreas = (params?: GetAreasParams) => areaService.getAreas(params);
export const getAreaById = (id: string) => areaService.getAreaById(id);
export const createArea = (area: CreateAreaRequest) => areaService.createArea(area);
export const updateArea = (id: string, updates: UpdateAreaRequest) => areaService.updateArea(id, updates);
export const deleteArea = (id: string) => areaService.deleteArea(id);
export const reorderAreas = (areaIds: string[]) => areaService.reorderAreas(areaIds);
