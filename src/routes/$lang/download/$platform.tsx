import { createFileRoute } from "@tanstack/react-router";
import PSEOPage from "@/pages/PSEOPage";

export const Route = createFileRoute("/$lang/download/$platform")({
  component: PSEOPage,
});
