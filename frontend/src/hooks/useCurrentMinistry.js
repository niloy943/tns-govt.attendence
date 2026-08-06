import { useMemo } from "react";
import { useMinistries } from "./useMinistries";
import { useAuth } from "../context/AuthContext";

/**
 * Convenience hook that returns the currently selected ministry object
 * along with a helper to look up any ministry by ID.
 *
 * This replaces the pattern of importing dummyMinistries directly and calling
 * dummyMinistries.find(m => m.id === Number(selectedMinistryId))
 * that was scattered across 14+ page/component files.
 */
export function useCurrentMinistry() {
  const { selectedMinistryId } = useAuth();
  const { data: ministries = [] } = useMinistries();

  const currentMinistry = useMemo(() => {
    if (!selectedMinistryId || selectedMinistryId === "all") return null;
    return ministries.find((m) => m.id === Number(selectedMinistryId)) || null;
  }, [ministries, selectedMinistryId]);

  const getMinistryById = (id) => {
    return ministries.find((m) => m.id === Number(id)) || null;
  };

  return {
    /** The currently selected ministry object, or null if "all" / central view */
    currentMinistry,
    /** All loaded ministries array */
    ministries,
    /** Look up any ministry by ID */
    getMinistryById,
  };
}
