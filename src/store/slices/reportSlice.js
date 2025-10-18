import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Upload report
export const uploadReport = createAsyncThunk(
  "reports/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.report;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Upload failed"
      );
    }
  }
);

// Get all reports
export const getReports = createAsyncThunk(
  "reports/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/reports", { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

// Get single report
export const getReportById = createAsyncThunk(
  "reports/getById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reports/${id}`);
      return data.report;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch report"
      );
    }
  }
);

// Delete report
export const deleteReport = createAsyncThunk(
  "reports/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reports/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete report"
      );
    }
  }
);

const initialState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
      })
      .addCase(uploadReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All
      .addCase(getReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get By ID
      .addCase(getReportById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(getReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentReport } = reportSlice.actions;
export default reportSlice.reducer;
