import { createFileRoute } from "@tanstack/react-router";
import AudioPlatformPage from "@/pages/AudioPlatformPage";

export const Route = createFileRoute("/audio/$platform")({
  component: AudioPlatformPage,
});
