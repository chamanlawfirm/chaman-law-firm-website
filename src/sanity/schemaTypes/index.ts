import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {seoType} from './seoType'
import {siteSettingsType} from './siteSettingsType'
import {homepageType} from './homepageType'
import {pageType} from './pageType'
import {practiceAreaType} from './practiceAreaType'
import {lawyerType} from './lawyerType'
import {articleType} from './articleType'
import {downloadType} from './downloadType'
import {faqType} from './faqType'
import {testimonialType} from './testimonialType'
import {landingPageType} from './landingPageType'
import {officeLocationType} from './officeLocationType'
import {mediaItemType} from './mediaItemType'
import {careerPathType} from './careerPathType'
import {legalNewsType} from './legalNewsType'
import {courtUpdateType} from './courtUpdateType'
import {podcastType} from './podcastType'
import {videoType} from './videoType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    seoType,
    siteSettingsType,
    homepageType,
    pageType,
    practiceAreaType,
    lawyerType,
    articleType,
    downloadType,
    faqType,
    testimonialType,
    landingPageType,
    officeLocationType,
    mediaItemType,
    careerPathType,
    legalNewsType,
    courtUpdateType,
    podcastType,
    videoType,
    categoryType,
    authorType,
    postType,
  ],
}
