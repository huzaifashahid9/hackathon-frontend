import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const addVitals = createAsyncThunk(
  "vitals/add",
  async (vitalsData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/vitals", vitalsData);
      return data.vitals;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add vitals"
      );
    }
  }
);

export const getVitals = createAsyncThunk(
  "vitals/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/vitals", { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vitals"
      );
    }
  }
);

export const getVitalById = createAsyncThunk(
  "vitals/getById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/vitals/${id}`);
      return data.vital;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vital"
      );
    }
  }
);

export const deleteVital = createAsyncThunk(
  "vitals/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/vitals/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete vitals"
      );
    }
  }
);

const initialState = {
  vitals: [],
  currentVital: null,
  loading: false,
  error: null,
  total: 0,
};

const vitalsSlice = createSlice({
  name: "vitals",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addVitals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVitals.fulfilled, (state, action) => {
        state.loading = false;
        state.vitals.unshift(action.payload);
      })
      .addCase(addVitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All
      .addCase(getVitals.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVitals.fulfilled, (state, action) => {
        state.loading = false;
        state.vitals = action.payload.vitals;
        state.total = action.payload.total;
      })
      .addCase(getVitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get By ID
      .addCase(getVitalById.pending, (state) => {
        state.loading = true;
        state.currentVital = null;
      })
      .addCase(getVitalById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVital = action.payload;
      })
      .addCase(getVitalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteVital.fulfilled, (state, action) => {
        state.vitals = state.vitals.filter((v) => v._id !== action.payload);
        if (state.currentVital?._id === action.payload) {
          state.currentVital = null;
        }
      });
  },
});

export const { clearError } = vitalsSlice.actions;
export default vitalsSlice.reducer;
