import Loader from "@/components/ui/loader";

export default function LoadingPage({ loadingText }: { loadingText?: string }) {
  return (
    <div className="w-full h-[85vh] grid place-content-center place-items-center">
      <Loader loadingText={loadingText} removeWrapper={true} />
    </div>
  );
}
