import { useState, useEffect, useRef, useCallback } from "react";
import { Room, RoomEvent, Track } from "livekit-client";
import { voiceService } from "../services/voiceService";

export function useVoice(channelId, username) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [participants, setParticipants] = useState([]);

  const roomRef = useRef(null);
  const audioElementsRef = useRef(new Map());

  const updateParticipants = useCallback(() => {
    if (!roomRef.current) return;
    const room = roomRef.current;
    const list = [];

    if (room.localParticipant) {
      list.push({
        id: room.localParticipant.identity,
        name: room.localParticipant.name || username || "You",
        isLocal: true,
        isSpeaking: room.localParticipant.isSpeaking,
        isMuted: !room.localParticipant.isMicrophoneEnabled,
        participant: room.localParticipant,
      });
    }

    room.remoteParticipants.forEach((p) => {
      list.push({
        id: p.identity,
        name: p.name || p.identity || "Member",
        isLocal: false,
        isSpeaking: p.isSpeaking,
        isMuted: !p.isMicrophoneEnabled,
        participant: p,
      });
    });

    setParticipants(list);
  }, [username]);

  const connect = useCallback(async () => {
    if (!channelId || isConnecting || isConnected) return;
    setIsConnecting(true);
    setError(null);

    try {
      const res = await voiceService.getJoinToken(channelId, username);
      const data = res.data || res;
      const { token, url } = data;

      if (!token || !url) {
        throw new Error("Missing LiveKit token or URL from voice service");
      }

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
      roomRef.current = room;

      room.on(RoomEvent.Connected, () => {
        setIsConnected(true);
        setIsConnecting(false);
        updateParticipants();
      });

      room.on(RoomEvent.Disconnected, () => {
        setIsConnected(false);
        setIsConnecting(false);
        setParticipants([]);
        setSharing(false);
        audioElementsRef.current.forEach((el) => el.remove());
        audioElementsRef.current.clear();
      });

      room.on(RoomEvent.ParticipantConnected, updateParticipants);
      room.on(RoomEvent.ParticipantDisconnected, updateParticipants);
      room.on(RoomEvent.ActiveSpeakersChanged, updateParticipants);
      room.on(RoomEvent.TrackMuted, updateParticipants);
      room.on(RoomEvent.TrackUnmuted, updateParticipants);

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) {
          const el = track.attach();
          el.muted = deafened;
          audioElementsRef.current.set(track.sid, el);
        }
        updateParticipants();
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach((el) => el.remove());
        audioElementsRef.current.delete(track.sid);
        updateParticipants();
      });

      await room.connect(url, token);
      await room.localParticipant.setMicrophoneEnabled(true);
      setMuted(false);
    } catch (err) {
      console.error("Failed to connect to voice room:", err);
      setError(err.message || "Failed to join voice");
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [channelId, username, isConnecting, isConnected, deafened, updateParticipants]);

  const disconnect = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setParticipants([]);
    setSharing(false);
    audioElementsRef.current.forEach((el) => el.remove());
    audioElementsRef.current.clear();
  }, []);

  const toggleMute = useCallback(async () => {
    if (!roomRef.current?.localParticipant) return;
    const nextMuted = !muted;
    try {
      await roomRef.current.localParticipant.setMicrophoneEnabled(!nextMuted);
      setMuted(nextMuted);
      updateParticipants();
    } catch (err) {
      console.error("Failed to toggle microphone:", err);
    }
  }, [muted, updateParticipants]);

  const toggleDeafen = useCallback(() => {
    const nextDeafened = !deafened;
    setDeafened(nextDeafened);
    audioElementsRef.current.forEach((el) => {
      el.muted = nextDeafened;
    });
  }, [deafened]);

  const toggleScreenShare = useCallback(async () => {
    if (!roomRef.current?.localParticipant) return;
    const nextSharing = !sharing;
    try {
      await roomRef.current.localParticipant.setScreenShareEnabled(nextSharing);
      setSharing(nextSharing);
      updateParticipants();
    } catch (err) {
      console.error("Failed to toggle screen share:", err);
    }
  }, [sharing, updateParticipants]);

  useEffect(() => {
    const audioElements = audioElementsRef.current;
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
      audioElements.forEach((el) => el.remove());
      audioElements.clear();
    };
  }, [channelId]);

  return {
    isConnected,
    isConnecting,
    error,
    muted,
    deafened,
    sharing,
    participants,
    connect,
    disconnect,
    toggleMute,
    toggleDeafen,
    toggleScreenShare,
  };
}
