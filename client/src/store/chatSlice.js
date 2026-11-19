import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
  name: "chat",
  initialState: { messages: [] },
  reducers: {
    sendMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        user: "Aurelius_Dev",
        role: "Pacesetter",
        roleColor: "bg-primary-container text-on-primary-container",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "AD",
        text: action.payload,
        reactions: [],
        isSelf: true,
      })
    },
    toggleReaction: (state, action) => {
      const { msgId, emoji } = action.payload
      const msg = state.messages.find(m => m.id === msgId)
      if (!msg) return
      const r = msg.reactions.find(r => r.emoji === emoji)
      if (r) r.count += 1
      else msg.reactions.push({ emoji, count: 1 })
    },
  },
})

export const { sendMessage, toggleReaction } = chatSlice.actions
export default chatSlice.reducer