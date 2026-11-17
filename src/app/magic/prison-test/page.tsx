import { notFound } from "next/navigation";
import { PrisonLab } from "./prison-lab";

export const metadata = {
  title: "Forgotten Prison · Test lab",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
const PrisonTestPage = () => {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.FORGOTTEN_PRISON_LOCAL_ENABLED !== "1"
  )
    notFound();
  return <PrisonLab />;
};
export default PrisonTestPage;
