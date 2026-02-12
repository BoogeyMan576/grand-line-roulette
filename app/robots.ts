import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',     // Applies to all bots (Google, Bing, etc.)
      allow: '/',         // Allow them to see your home, game, and rules
      disallow: [
        '/api/',          // Prevent bots from hitting your character database directly
        '/admin/',        // Hide any private admin pages
        '/private/',      
      ],
    },
    sitemap: 'https://www.grandlineroulette.com/sitemap.xml',
  };
}