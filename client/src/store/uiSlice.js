import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isAuthenticated: Boolean(localStorage.getItem('orbit_auth') || localStorage.getItem('aura_auth')),
    currentUser: JSON.parse(localStorage.getItem('orbit_user') || localStorage.getItem('aura_user') || 'null'),
    activeServerId: null,
    activeChannelId: null,
    activeChannel: 'executive-briefing',
    activeView: 'channels',
    memberListOpen: true,
    mobileNavOpen: false,
    isAuthChecking: true,
    inviteModalOpen: false,
  },
  reducers: {
    setAuthChecking: (state, action) => {
      state.isAuthChecking = action.payload
    },
    login: (state, action) => {
      state.isAuthenticated = true
      state.isAuthChecking = false
      if (action.payload) {
        state.currentUser = action.payload
        localStorage.setItem('orbit_user', JSON.stringify(action.payload))
      }
      localStorage.setItem('orbit_auth', '1')
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.isAuthChecking = false
      state.currentUser = null
      state.activeServerId = null
      state.activeChannelId = null
      state.inviteModalOpen = false
      localStorage.removeItem('orbit_auth')
      localStorage.removeItem('orbit_user')
      localStorage.removeItem('aura_auth')
      localStorage.removeItem('aura_user')
    },
    setUser: (state, action) => {
      state.currentUser = action.payload
      if (action.payload) localStorage.setItem('orbit_user', JSON.stringify(action.payload))
    },
    setActiveServerId:  (state, action) => { state.activeServerId  = action.payload },
    setActiveChannelId: (state, action) => { state.activeChannelId = action.payload },
    setActiveChannel:   (state, action) => { state.activeChannel   = action.payload },
    setActiveView:      (state, action) => { state.activeView      = action.payload },
    toggleMemberList:   (state)         => { state.memberListOpen  = !state.memberListOpen },
    toggleMobileNav:    (state)         => { state.mobileNavOpen   = !state.mobileNavOpen },
    closeMobileNav:     (state)         => { state.mobileNavOpen   = false },
    openInviteModal:    (state)         => { state.inviteModalOpen = true },
    closeInviteModal:   (state)         => { state.inviteModalOpen = false },
  },
})

export const {
  setAuthChecking,
  login,
  logout,
  setUser,
  setActiveServerId,
  setActiveChannelId,
  setActiveChannel,
  setActiveView,
  toggleMemberList,
  toggleMobileNav,
  closeMobileNav,
  openInviteModal,
  closeInviteModal,
} = uiSlice.actions
export default uiSlice.reducer