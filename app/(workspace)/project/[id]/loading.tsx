import { Spinner } from "@/components/ui/spinner";

export default function ProjectLoading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
