import { createFileRoute } from "@tanstack/react-router";
import VideoCategory from "@/pages/VideoCategory";

export const Route = createFileRoute("/video-downloader")({
  component: VideoCategory,
});
