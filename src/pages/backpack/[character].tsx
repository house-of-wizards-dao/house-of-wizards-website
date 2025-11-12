import { useRouter } from "next/router";
import ErrorBoundary from "@/components/ErrorBoundary";
import DefaultLayout from "@/layouts/default";

export default function CharacterBackpack() {
  const router = useRouter();
  const { character } = router.query;

  return (
    <DefaultLayout>
      <ErrorBoundary>
        <div>{character}</div>
      </ErrorBoundary>
    </DefaultLayout>
  );
}
