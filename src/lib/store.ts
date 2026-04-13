import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import truckReducer from './features/truck/truckSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      truck: truckReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
