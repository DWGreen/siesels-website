"use client";

import { useEffect, useState } from "react";
import { ReservationType } from "@/data/storeLocations";
import { getReservationOrderingStatus } from "@/utils/reservationOrdering";

export function useReservationOrdering(type: ReservationType) {
  const [status, setStatus] = useState<ReturnType<typeof getReservationOrderingStatus>>({
    isOpen: false,
    message: null,
  });

  useEffect(() => {
    const refresh = () => setStatus(getReservationOrderingStatus(type));
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [type]);

  return status;
}