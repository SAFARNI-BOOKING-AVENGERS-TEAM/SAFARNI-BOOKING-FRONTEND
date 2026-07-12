import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import { setBooking, clearBooking, setSearchParams, BookingItem } from "./bookingSlice"

type BookingStateAndActions = {
  current: BookingItem | null
  searchParams: any
  setBooking: (item: BookingItem) => void
  clearBooking: () => void
  setSearchParams: (params: any) => void
}

export function useBookingStore<T = BookingStateAndActions>(
  selector?: (state: BookingStateAndActions) => T
): T {
  const dispatch = useDispatch()
  const current = useSelector((state: RootState) => state.booking.current)
  const searchParams = useSelector((state: RootState) => state.booking.searchParams)

  const stateAndActions: BookingStateAndActions = {
    current,
    searchParams,
    setBooking: (item: BookingItem) => dispatch(setBooking(item)),
    clearBooking: () => dispatch(clearBooking()),
    setSearchParams: (params: any) => dispatch(setSearchParams(params)),
  }

  if (selector) {
    return selector(stateAndActions)
  }
  return stateAndActions as unknown as T
}

export type { BookingItem }