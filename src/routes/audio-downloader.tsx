import { createFileRoute } from "@tanstack/react-router";
import AudioCategory from "@/pages/AudioCategory";

export const Route = createFileRoute("/audio-downloader")({
  component: AudioCategory,
});
