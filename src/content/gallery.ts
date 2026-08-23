import type { GalleryPhoto } from '@/lib/content/types'

/**
 * Starter gallery. These are the same three genuine Mother's Comfort
 * photographs already used elsewhere on the site (hero images, programme
 * cards) — reusing real photos of the charity's own work, not stock imagery.
 * Once staff add "Gallery photo" documents in the Studio, those replace this
 * list entirely; see getGalleryPhotos in src/lib/content/index.ts.
 */
export const galleryPhotos: GalleryPhoto[] = [
  {
    _id: 'gallery-volunteer',
    image: {
      url: '/images/volunteer.jpg',
      alt: "Mother's Comfort team supporting a mother at a clinic",
    },
    caption: "Mother's Comfort supporting a mother at a clinic visit",
    order: 1,
  },
  {
    _id: 'gallery-training',
    image: {
      url: '/images/training.JPG',
      alt: 'Women learning practical skills at sewing machines',
    },
    caption: 'Skills training in action — sewing machines in use',
    order: 2,
  },
  {
    _id: 'gallery-preparation',
    image: {
      url: '/images/preparation.jpg',
      alt: 'A prepared baby package of blankets, clothing and toiletries in a green tub',
    },
    caption: 'A maternity support package, ready for a mother in need',
    order: 3,
  },
]
