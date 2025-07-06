import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area } from '@/types/core';

interface AreasState {
  byId: Record<string, Area>;
  allIds: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AreasState = {
  byId: {},
  allIds: [],
  isLoading: false,
  error: null,
};

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAreas: (state, action: PayloadAction<Area[]>) => {
      state.byId = {};
      state.allIds = [];
      action.payload.forEach((area) => {
        state.byId[area.id] = area;
        state.allIds.push(area.id);
      });
    },
    addArea: (state, action: PayloadAction<Area>) => {
      const area = action.payload;
      state.byId[area.id] = area;
      if (!state.allIds.includes(area.id)) {
        state.allIds.push(area.id);
      }
    },
    updateArea: (state, action: PayloadAction<{ id: string; updates: Partial<Area> }>) => {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },
    removeArea: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((areaId) => areaId !== id);
    },
    reorderAreas: (state, action: PayloadAction<{ areaIds: string[]; newOrder: number[] }>) => {
      const { areaIds, newOrder } = action.payload;
      areaIds.forEach((areaId, index) => {
        if (state.byId[areaId]) {
          state.byId[areaId].sort_order = newOrder[index] || 0;
        }
      });
    },
  },
});

export const {
  setLoading,
  setError,
  setAreas,
  addArea,
  updateArea,
  removeArea,
  reorderAreas,
} = areasSlice.actions;

export default areasSlice.reducer;
