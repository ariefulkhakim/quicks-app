import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Loader2 size={50} className="animate-spin" />
    </div>
  );
}
