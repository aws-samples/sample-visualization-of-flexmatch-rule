import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RuleSet } from "../utils/definitions.tsx";
import {
  StoreState
} from "./types.tsx";
import { enrichTeamsForVisualization } from "./teamEnrichment.tsx";

const initialRuleSetState: StoreState = {
  enrichedTeamStructure: { teams: [] },
  typedStructure: { ruleLanguageVersion: "1.0", teams: [], rules: [] }
};

const jsonObjectSlice = createSlice({
  name: 'ruleSet',
  initialState: initialRuleSetState,

  reducers: {
    setObject: (state, action: PayloadAction<RuleSet>) => {
      state.enrichedTeamStructure = enrichTeamsForVisualization(action.payload);
      state.typedStructure = action.payload;
    },
  },
});


export const { setObject } = jsonObjectSlice.actions;

const jsonObjectStore = configureStore({
  reducer: jsonObjectSlice.reducer,
});

export default jsonObjectStore;
