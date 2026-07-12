import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type BookingItem = {
  type:       "flight" | "hotel" | "tour" | "car"
  item:       any
  details:    any
  totalPrice: number
}

interface BookingState {
  current: BookingItem | null
  searchParams: any
}

const loadPersistedState = (): BookingState => {
  try {
    const raw = localStorage.getItem("safarni-booking")
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.state) {
        return {
          current: parsed.state.current || null,
          searchParams: parsed.state.searchParams || {},
        }
      }
    }
  } catch (e) {
    console.error("Failed to load persisted state", e)
  }
  return {
    current: null,
    searchParams: {},
  }
}

const saveState = (state: BookingState) => {
  try {
    localStorage.setItem("safarni-booking", JSON.stringify({
      state: {
        current: state.current,
        searchParams: state.searchParams,
      },
      version: 0
    }))
  } catch (e) {
    console.error("Failed to save state", e)
  }
}

const initialState: BookingState = loadPersistedState()

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (state, action: PayloadAction<BookingItem>) => {
      state.current = action.payload
      saveState(state)
    },
    clearBooking: (state) => {
      state.current = null
      saveState(state)
    },
    setSearchParams: (state, action: PayloadAction<any>) => {
      state.searchParams = action.payload
      saveState(state)
    },
  },
})

export const { setBooking, clearBooking, setSearchParams } = bookingSlice.actions
export default bookingSlice.reducer
