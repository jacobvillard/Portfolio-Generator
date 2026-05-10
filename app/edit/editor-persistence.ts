"use client";

import type { PortfolioEditorConfig } from "./types";

const STORAGE_PREFIX = "portfolio-generator:config";

export function getPortfolioStorageKey(username: string) {
  return `${STORAGE_PREFIX}:${username.trim().toLowerCase()}`;
}

export function loadStoredPortfolioConfig(username: string) {
  if (typeof window === "undefined" || !username.trim()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(getPortfolioStorageKey(username));

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as PortfolioEditorConfig;
  } catch {
    return null;
  }
}

export function saveStoredPortfolioConfig(
  username: string,
  config: PortfolioEditorConfig,
) {
  if (typeof window === "undefined" || !username.trim()) {
    return;
  }

  window.localStorage.setItem(
    getPortfolioStorageKey(username),
    JSON.stringify(config),
  );
}

export function clearStoredPortfolioConfig(username: string) {
  if (typeof window === "undefined" || !username.trim()) {
    return;
  }

  window.localStorage.removeItem(getPortfolioStorageKey(username));
}
