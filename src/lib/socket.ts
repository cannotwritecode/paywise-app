import { io, type Socket } from "socket.io-client"
import { useAuthStore } from "./store/authStore"

let socket: Socket | null = null

export const initSocket = (): Socket => {
  const token = useAuthStore.getState().token
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001"

  if (!socket) {
    socket = io(wsUrl, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socket.on("connect", () => {
      console.log("[Socket] Connected")
    })

    socket.on("auth:error", () => {
      console.log("[Socket] Auth error - attempting refresh")
      handleAuthError()
    })

    socket.on("disconnect", () => {
      console.log("[Socket] Disconnected")
    })
  }

  return socket
}

export const getSocket = (): Socket | null => socket

export const handleAuthError = async () => {
  const refreshToken = localStorage.getItem("refresh_token")
  if (refreshToken && socket) {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      })
      const { token } = await response.json()
      useAuthStore.getState().setToken(token)
      localStorage.setItem("auth_token", token)
      socket.auth = { token }
      socket.disconnect().connect()
    } catch (error) {
      useAuthStore.getState().logout()
    }
  }
}

export const joinRoom = (room: string) => {
  const socket = getSocket()
  if (socket) {
    socket.emit("join", { room })
  }
}

export const leaveRoom = (room: string) => {
  const socket = getSocket()
  if (socket) {
    socket.emit("leave", { room })
  }
}
