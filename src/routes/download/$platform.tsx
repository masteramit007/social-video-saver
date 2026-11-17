import { createFileRoute } from "@tanstack/react-router";
import PlatformPage from "@/pages/PlatformPage";
import RegionPage from "@/pages/RegionPage";
import { REGION_BY_ID } from "@/data/regions";

// /download/<region> (china, india, …) shows a region hub; anything else is a platform page.
function DownloadRoute() {
  const { platform } = Route.useParams();
  return REGION_BY_ID[platform] ? <RegionPage /> : <PlatformPage />;
}

export const Route = createFileRoute("/download/$platform")({
  component: DownloadRoute,
});
