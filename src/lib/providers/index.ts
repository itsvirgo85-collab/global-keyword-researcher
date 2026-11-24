import { KeywordSuggestion, SearchPlatform } from "@/types";
import { harvestGoogleKeywordTree } from "./google-autocomplete";
import { harvestYouTubeKeywords } from "./youtube-autocomplete";
import { harvestAmazonKeywords } from "./amazon-autocomplete";

export async function fetchAggregatedKeywordSuggestions(
  query: string,
  countryCode: string,
  languageCode: string,
  platform: SearchPlatform = "google"
): Promise<KeywordSuggestion[]> {
  switch (platform) {
    case "youtube":
      return harvestYouTubeKeywords(query, countryCode, languageCode);
    case "amazon":
      return harvestAmazonKeywords(query);
    case "google":
    default:
      return harvestGoogleKeywordTree(query, countryCode, languageCode);
  }
}
