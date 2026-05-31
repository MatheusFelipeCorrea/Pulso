import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        // transactions: transactionReducer,
        // goals: goalReducer,
        // trips: tripReducer,
        // insights: insightReducer,
        // reminders: reminderReducer,
        // transport: transportReducer,
        // gamification: gamificationReducer,
    },
})