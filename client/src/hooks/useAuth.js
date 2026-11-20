import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { disconnectSocket } from "../services/socketService";
import {
  login as loginAction,
  logout as logoutAction,
  setAuthChecking,
  setActiveView,
} from "../store/uiSlice";

export const AUTH_KEYS = {
  currentUser: ["currentUser"],
};

export function useAuthSession() {
  const dispatch = useDispatch();

  useEffect(() => {
    let isSubscribed = true;

    async function checkSession() {
      try {
        const meRes = await userService.getMe();
        const user = meRes?.user || meRes?.data || meRes;
        if (isSubscribed) {
          if (user && (user.id || user._id || user.email || user.username)) {
            dispatch(loginAction(user));
          } else {
            dispatch(logoutAction());
          }
        }
      } catch {
        if (isSubscribed) {
          dispatch(logoutAction());
        }
      } finally {
        if (isSubscribed) {
          dispatch(setAuthChecking(false));
        }
      }
    }

    checkSession();

    return () => {
      isSubscribed = false;
    };
  }, [dispatch]);
}

export function useCurrentUserQuery() {
  const isAuthenticated = useSelector((s) => s.ui.isAuthenticated);
  return useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: async () => {
      const data = await userService.getMe();
      return data?.user || data?.data || data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLoginMutation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      return authService.login(credentials);
    },
    onSuccess: async (_, variables) => {
      let profile = null;
      try {
        const meRes = await userService.getMe();
        profile = meRes?.user || meRes?.data || null;
      } catch {
      }

      dispatch(
        loginAction(
          profile || {
            email: variables.email,
            fullname: variables.email.split("@")[0],
          }
        )
      );
      dispatch(setActiveView("channels"));
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });
      const target = location.state?.from?.pathname || "/app";
      navigate(target, { replace: true });
    },
  });
}

export function useRegisterMutation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return authService.register(payload);
    },
    onSuccess: async (_, variables) => {
      let profile = null;
      try {
        const meRes = await userService.getMe();
        profile = meRes?.user || meRes?.data || null;
      } catch {
      }

      dispatch(
        loginAction(
          profile || {
            fullname: variables.fullname,
            username: variables.username,
            email: variables.email,
          }
        )
      );
      dispatch(setActiveView("channels"));
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });
      const target = location.state?.from?.pathname || "/app";
      navigate(target, { replace: true });
    },
  });
}

export function useLogoutMutation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return authService.logout();
    },
    onSettled: () => {
      disconnectSocket();
      dispatch(logoutAction());
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
}