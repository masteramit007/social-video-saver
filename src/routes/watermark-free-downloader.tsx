import { createFileRoute } from "@tanstack/react-router";
import WatermarkFreePage from "@/pages/WatermarkFreePage";

export const Route = createFileRoute("/watermark-free-downloader")({
  component: WatermarkFreePage,
});
