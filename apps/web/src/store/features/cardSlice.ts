import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const CardStates = {
  COLLAPSED: "collapsed",
  HALF_OPEN: "half-open",
  EXPANDED: "expanded",
} as const;

export const CardStatesList = Object.values(CardStates);

export type CardStatus = (typeof CardStates)[keyof typeof CardStates];

interface CardState {
  midSnapPoint: number | null;
  bottomSnapPoint: number | null;
  cardStatus: CardStatus;
}

const initialState: CardState = {
  midSnapPoint: null,
  bottomSnapPoint: null,
  cardStatus: CardStates.HALF_OPEN,
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setInfoCardStatus(state, action: PayloadAction<CardStatus>) {
      state.cardStatus = action.payload;
    },
    setMidSnapPoint(state, action: PayloadAction<number>) {
      state.midSnapPoint = action.payload;
    },
    setBottomSnapPoint(state, action: PayloadAction<number>) {
      state.bottomSnapPoint = action.payload;
      console.log("Setting bottom snap point to " + action.payload);
    },
  },
  selectors: {
    selectCardCollapsed: (state) => state.cardStatus === CardStates.COLLAPSED,
  },
});

export const { setInfoCardStatus, setMidSnapPoint, setBottomSnapPoint } = cardSlice.actions;
export const { selectCardCollapsed } = cardSlice.selectors;
export default cardSlice.reducer;
