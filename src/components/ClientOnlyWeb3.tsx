// Client-only wrapper for Web3 components that use Wagmi hooks
import { useSyncExternalStore, ReactNode } from "react";

const subscribe = () => () => {};

type ClientOnlyWeb3Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export const ClientOnlyWeb3 = ({
  children,
  fallback = null,
}: ClientOnlyWeb3Props) => {
  const hasMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
