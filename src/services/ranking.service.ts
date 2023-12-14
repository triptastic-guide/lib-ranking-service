import { Logger } from '@npm-shared-services/lib-logger-service'

// weights
const VIEWS_RANK_PERCENTAGE = 0.2 // no views now on LP
const PAGE_LENGTH_RANK_PERCENTAGE = 0.1
const RANK_ARTICLE_IMAGE_COUNT_PERCENTAGE = 0.1
const AI_GENERATED_SCORE_RANK_PERCENTAGE = 0.3
const IS_ATTRACTION_RANK_PERCENTAGE = 0.3

// normalized values
const VIEWS_RANGE_UPPER_BOUND = 1000 // reduced from 1000000 to 100000 because usually have less views. 1000000 is too big. these values need adjusting
const PAGE_LENGTH_RANGE_UPPER_BOUND = 20000
const RANK_ARTICLE_IMAGE_COUNT_RANGE_UPPER_BOUND = 15
const AI_GENERATED_SCORE_RANGE_UPPER_BOUND = 10

// IDEA: if attraction, then boost by 15%
// TODO: move this separatelly and make aiGeneratedScore optional
//       we need the same logic when first fetching articles from provider (svc-api-text-content)
export const getRank = (
  articleSectionsSize: number,
  views: number,
  imageCount: number,
  aiGeneratedScore?: number,
  isAttraction?: boolean
) => {
  const viewsRank = (views / VIEWS_RANGE_UPPER_BOUND) * VIEWS_RANK_PERCENTAGE
  Logger.debug(`viewsRank: ${viewsRank}`)

  const pageLengthRank =
    (articleSectionsSize / PAGE_LENGTH_RANGE_UPPER_BOUND) *
    PAGE_LENGTH_RANK_PERCENTAGE
  Logger.debug(`pageLengthRank: ${pageLengthRank}`)

  const imageCountRank =
    (imageCount / RANK_ARTICLE_IMAGE_COUNT_RANGE_UPPER_BOUND) *
    RANK_ARTICLE_IMAGE_COUNT_PERCENTAGE
  Logger.debug(`imageCountRank: ${imageCountRank}`)

  const aiGeneratedScoreRank = aiGeneratedScore
    ? (aiGeneratedScore / AI_GENERATED_SCORE_RANGE_UPPER_BOUND) *
      AI_GENERATED_SCORE_RANK_PERCENTAGE
    : 0
  Logger.debug(`aiGeneratedScoreRank: ${aiGeneratedScoreRank}`)

  const isAttractionRank = isAttraction ? IS_ATTRACTION_RANK_PERCENTAGE : 0
  Logger.debug(`isAttractionRank: ${IS_ATTRACTION_RANK_PERCENTAGE}`)

  const result =
    viewsRank +
    pageLengthRank +
    imageCountRank +
    aiGeneratedScoreRank +
    isAttractionRank

  return result
}
