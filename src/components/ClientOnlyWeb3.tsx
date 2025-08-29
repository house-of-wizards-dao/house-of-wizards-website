// Client-only wrapper for Web3 components that use Wagmi hooks
import { useEffect, useState, ReactNode } from "react";

interface ClientOnlyWeb3Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnlyWeb3({
  children,
  fallback = null,
}: ClientOnlyWeb3Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
