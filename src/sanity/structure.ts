import type {StructureResolver} from 'sanity/structure'

const primaryTypes = [
  'siteSettings',
  'homepage',
  'page',
  'practiceArea',
  'lawyer',
  'article',
  'download',
  'faq',
  'testimonial',
  'landingPage',
  'officeLocation',
  'mediaItem',
  'legalNews',
  'courtUpdate',
  'podcast',
  'video',
  'careerPath',
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Chaman Law Firm CMS')
    .items([
      S.documentTypeListItem('siteSettings').title('Site Settings'),
      S.documentTypeListItem('homepage').title('Homepage'),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('practiceArea').title('Practice Areas'),
      S.documentTypeListItem('lawyer').title('Lawyers'),
      S.documentTypeListItem('landingPage').title('Landing Pages'),
      S.divider(),
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('legalNews').title('Legal News'),
      S.documentTypeListItem('courtUpdate').title('Court Updates'),
      S.documentTypeListItem('podcast').title('Podcast Episodes'),
      S.documentTypeListItem('video').title('Legal Videos'),
      S.documentTypeListItem('download').title('Downloads'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('mediaItem').title('Media Items'),
      S.documentTypeListItem('careerPath').title('Career Paths'),
      S.documentTypeListItem('officeLocation').title('Office Locations'),
      S.divider(),
      S.documentTypeListItem('post').title('Legacy Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() && ![...primaryTypes, 'post', 'category', 'author'].includes(item.getId()!),
      ),
    ])
