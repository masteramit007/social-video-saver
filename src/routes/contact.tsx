import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: 'Contact Us | SocialMediaVideoDownload.com' },
      { name: 'description', content: 'Contact the SocialMediaVideoDownload.com team with questions or feedback about video and audio downloads.' },
      { property: 'og:title', content: 'Contact Us | SocialMediaVideoDownload.com' },
      { property: 'og:description', content: 'Send questions or feedback to the SocialMediaVideoDownload.com team.' },
      { property: 'og:url', content: 'https://socialmediavideodownload.com/contact' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'canonical', href: 'https://socialmediavideodownload.com/contact' }],
  }),
});
