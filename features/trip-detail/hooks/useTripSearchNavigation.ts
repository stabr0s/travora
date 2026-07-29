"use client";

import { useEffect, useRef, useState } from "react";

import type { TripDetailTabId } from "@/features/trip-detail/types/trip-detail";

const highlightClasses = ["ring-2", "ring-inset", "ring-primary/30"];

export function useTripSearchNavigation(initialTab: TripDetailTabId) {
  const [activeTab, setActiveTab] = useState<TripDetailTabId>(initialTab);
  const [pendingAnchor, setPendingAnchor] = useState<{
    id: string;
    requestId: number;
  } | null>(null);
  const navigationId = useRef(0);

  useEffect(() => {
    if (!pendingAnchor) return;

    let target: HTMLElement | null = null;
    let highlightTimeout: number | undefined;
    const frame = window.requestAnimationFrame(() => {
      target = document.getElementById(pendingAnchor.id);
      if (!target) return;

      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add(...highlightClasses);
      highlightTimeout = window.setTimeout(() => {
        target?.classList.remove(...highlightClasses);
      }, 2000);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (highlightTimeout) window.clearTimeout(highlightTimeout);
      target?.classList.remove(...highlightClasses);
    };
  }, [activeTab, pendingAnchor]);

  function handleTabChange(tab: TripDetailTabId) {
    setPendingAnchor(null);
    setActiveTab(tab);
  }

  function handleSearchNavigate(tab: TripDetailTabId, anchor?: string) {
    setActiveTab(tab);
    setPendingAnchor(anchor ? {
      id: anchor,
      requestId: ++navigationId.current,
    } : null);
  }

  return { activeTab, handleSearchNavigate, handleTabChange };
}
