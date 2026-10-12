import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true только после гидратации, без setState в эффекте. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
