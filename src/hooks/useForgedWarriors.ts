import { useEffect, useState } from "react";
import type { WarriorGraphQLResponse } from "@/lib/frwc-graphql";

export function useForgedWarriors() {
  const [data, setData] = useState<WarriorGraphQLResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/warriors/forged");

        if (!response.ok) {
          throw new Error(`Failed to fetch warriors: ${response.statusText}`);
        }

        const json = await response.json();
        setData(json.Warrior || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        console.error("Error fetching warriors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
