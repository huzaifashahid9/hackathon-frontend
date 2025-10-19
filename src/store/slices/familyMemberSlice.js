import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Async thunks
export const fetchFamilyMembers = createAsyncThunk(
  "familyMembers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/family-members");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch family members"
      );
    }
  }
);

export const createFamilyMember = createAsyncThunk(
  "familyMembers/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/family-members", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create family member"
      );
    }
  }
);

export const updateFamilyMember = createAsyncThunk(
  "familyMembers/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/family-members/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update family member"
      );
    }
  }
);

export const deleteFamilyMember = createAsyncThunk(
  "familyMembers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/family-members/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete family member"
      );
    }
  }
);

export const deleteFamilyMemberImage = createAsyncThunk(
  "familyMembers/deleteImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/family-members/${id}/image`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete image"
      );
    }
  }
);

const familyMemberSlice = createSlice({
  name: "familyMembers",
  initialState: {
    members: [],
    selectedMember: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedMember: (state, action) => {
      state.selectedMember = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch family members
      .addCase(fetchFamilyMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
        // Auto-select first member if none selected
        if (!state.selectedMember && action.payload.length > 0) {
          state.selectedMember = action.payload[0];
        }
      })
      .addCase(fetchFamilyMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create family member
      .addCase(createFamilyMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFamilyMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.push(action.payload);
        // Auto-select newly created member
        state.selectedMember = action.payload;
      })
      .addCase(createFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update family member
      .addCase(updateFamilyMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFamilyMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.members.findIndex(
          (m) => m._id === action.payload._id
        );
        if (index !== -1) {
          state.members[index] = action.payload;
        }
        if (state.selectedMember?._id === action.payload._id) {
          state.selectedMember = action.payload;
        }
      })
      .addCase(updateFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete family member
      .addCase(deleteFamilyMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFamilyMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter((m) => m._id !== action.payload);
        if (state.selectedMember?._id === action.payload) {
          state.selectedMember = state.members[0] || null;
        }
      })
      .addCase(deleteFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete family member image
      .addCase(deleteFamilyMemberImage.fulfilled, (state, action) => {
        const member = state.members.find((m) => m._id === action.payload.id);
        if (member) {
          member.profileImage = undefined;
        }
        if (state.selectedMember?._id === action.payload.id) {
          state.selectedMember.profileImage = undefined;
        }
      });
  },
});

export const { setSelectedMember, clearError } = familyMemberSlice.actions;
export default familyMemberSlice.reducer;
