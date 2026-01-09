import { geminiService } from "./geminiService";
import { storageService } from "./storageService";
import { Post } from "../types";

export const newsAgentService = {
    /**
     * Scrapes the CNN front page using a proxy to bypass CORS,
     * extracts the top "World" headline, and uses Gemini to write a full article.
     */
    async syncCnnWorldNews(): Promise<Post | null> {
        try {
            // 1. Fetch CNN Front Page (using allorigins proxy for demo/frontend safety)
            const targetUrl = encodeURIComponent('https://edition.cnn.com/world');
            const proxyUrl = `https://api.allorigins.win/get?url=${targetUrl}`;

            const response = await fetch(proxyUrl);
            const data = await response.json();
            const html = data.contents;

            // 2. Simple extraction of the first major headline
            // Note: In a production environment, we'd use a more robust parser or RSS feed.
            // For this implementation, we send the raw-ish HTML/Text snippet to Gemini to "know" the top story.
            const textContext = html.substring(0, 10000); // Send first 10k chars to Gemini

            const prompt = `Based on this HTML/Text snippet from the CNN World section, identify the single most important BREAKING WORLD NEWS headline right now. 
      Write a full 400-word investigative article for "The Nation's Eyes" about this news.
      
      CNN Data: ${textContext}`;

            // 3. Use AI Writer to generate the full post
            const aiPost = await geminiService.generatePostFromTopic(prompt);

            if (aiPost) {
                const finalPost: Post = {
                    ...aiPost,
                    category: 'World',
                    status: 'published', // Agent publishes automatically
                    date: new Date().toISOString(),
                    id: `cnn-${Date.now()}`
                };

                await storageService.savePost(finalPost);
                return finalPost;
            }

            return null;
        } catch (e) {
            console.error("News Agent failed to sync:", e);
            throw e;
        }
    }
};
