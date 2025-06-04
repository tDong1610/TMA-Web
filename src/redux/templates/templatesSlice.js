import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTemplatesAPI, createTemplateAPI, getTemplateDetailsAPI, updateTemplateAPI, deleteTemplateAPI } from '~/apis';

// Async Thunks
export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (userId, { rejectWithValue }) => {
    try {
      // Assuming getTemplatesAPI needs userId or similar parameter to fetch user's templates
      const templates = await getTemplatesAPI(userId);
      return templates;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (templateData, { rejectWithValue }) => {
    try {
      const newTemplate = await createTemplateAPI(templateData);
      return newTemplate;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/updateTemplate',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updatedTemplate = await updateTemplateAPI(id, data);
      return updatedTemplate;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (templateId, { rejectWithValue }) => {
    try {
      // API call to delete template
      await deleteTemplateAPI(templateId);
      return templateId; // Return the ID of the deleted template
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const templatesSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
    loading: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // standard reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      .addCase(createTemplate.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.templates.push(action.payload); // Add new template to the list
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      .addCase(updateTemplate.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const index = state.templates.findIndex(template => template._id === action.payload._id);
        if (index !== -1) {
          state.templates[index] = action.payload; // Update template in the list
        }
      })
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.templates = state.templates.filter(template => template._id !== action.payload); // Remove deleted template
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export const { } = templatesSlice.actions; // Export standard reducers if any

export default templatesSlice.reducer; // Export the reducer 