import type { Story } from '@/lib/content/types'

/**
 * Stories migrated verbatim from the previous site (`stories.html` and
 * `blog.html`). Clear grammatical slips have been corrected; the voice,
 * substance and detail of each account are untouched.
 *
 * These are real people's testimony. Before publishing any of them on the new
 * site, confirm the consent on file still covers republication — the Sanity
 * `story` schema has a required `consentConfirmed` field for exactly this.
 */
export const stories: Story[] = [
  {
    _id: 'story-founder',
    title: "The founder's story and the birth of Mother's Comfort",
    slug: 'the-founders-story',
    motherName: 'Dian Nyasha Jose',
    role: "Founder of Mother's Comfort",
    publishAnonymously: false,
    // No portrait: the old site used a stock photograph of schoolchildren here.
    // Attributing it to a named real person would be a misrepresentation, so it
    // is left blank until the founder supplies her own photograph.
    portrait: null,
    excerpt:
      'Becoming a mom was life transforming for me. My birth experience led me on a journey with a focus on underprivileged pregnant women.',
    plainBody: [
      'Becoming a mom has been life transforming for me. My birth experience led me on a journey with a focus on underprivileged pregnant women.',
      'I had a very capable gynaecologist and chose a prestigious birthing centre to ensure I would experience a seamless birthing experience. However, at 33 weeks of pregnancy I had a near-death experience and had an emergency c-section after a severe case of pregnancy induced hypertension (PIH). Chances of survival for both my child and I were reducing, but my gynaecologist and the medical personnel attending to me worked hard to stabilise me. I received post-natal care and was in the HDU for a week, and my child was in the NNU for about a month.',
      'Based on that history of PIH, my gynaecologist advised me to get prenatal care in my future pregnancies so as to minimise the risk of developing PIH again. In the next two pregnancies I got prenatal care; my gynae and I took the necessary precautions. I ended up having an emergency c-section at 35 weeks on my second pregnancy and 36 weeks on the third pregnancy due to PIH, but these c-sections were not as high risk as the first one.',
      'From that experience I realised how important the role my gynaecologist had played in ensuring that I had a safe pregnancy journey. Without access to this critical and timely care, my children and I would not be here today.',
      'Following my experience with prenatal, antenatal and post-natal care, I had to put myself in the shoes of those mothers who are unable to access antenatal care for various reasons, including not affording the registration fees. I realised that some maternal deaths and infant deaths are avoidable, if only the mothers had the opportunity to get prenatal, antenatal and post-natal care.',
      "Many other women are not as fortunate. My story is not exceptional, nor is it unique — every woman has a story. Hence Mother's Comfort was born, to help improve the quality of life of underprivileged pregnant women.",
    ],
    publishedAt: '2023-01-15',
    featured: true,
    isFounderStory: true,
  },
  {
    _id: 'story-silvia',
    title: 'I could not be discharged until we settled the bill',
    slug: 'silvia',
    motherName: 'Silvia',
    publishAnonymously: false,
    portrait: null,
    excerpt:
      'I found out I was pregnant at seven months. I knew I had missed a lot of antenatal care, and I did not have the money to register at a local clinic.',
    plainBody: [
      'I was a mother of one and my husband was not working. Life was hard for us to an extent that putting food on the table was a challenge. This was the time I got pregnant with my second born child.',
      'I got to find out I was pregnant when I fell ill and went to the hospital, only to realise I was seven months pregnant. I got so worried because I knew I had missed a lot of antenatal care and I had to register my pregnancy at the earliest so I could at least get some care in the remaining two months. Besides worrying about the delay, I also got worried because I did not have money to register at a local clinic for antenatal care.',
      'I really hoped I could find the registration fees that month, but that was just a dream — my due date arrived before I could even register. My labour came and, unregistered as I was, I went to the nearest health facility. They attended to me and I had a safe delivery, however they could not discharge me before I settled my hospital bills.',
      'I spent an additional two days after my discharge date at the health facility as we did not have money to settle the bill. It was an emotional time for me: instead of enjoying being a mom, I was busy worrying about my bill and wondering when we would find the money so I could be discharged.',
    ],
    publishedAt: '2023-02-01',
    featured: true,
    isFounderStory: false,
  },
  {
    _id: 'story-lucy',
    title: 'I had to make a choice',
    slug: 'lucy',
    motherName: 'Lucy',
    publishAnonymously: false,
    portrait: null,
    excerpt:
      'I am a member of an apostolic sect. With placenta previa in my fifth pregnancy, I decided to go to a health facility against my religious belief.',
    plainBody: [
      'I am a member of an apostolic sect and we do not subscribe to the use of contraceptives or giving birth at a health facility. I got pregnant with my fifth child, however this pregnancy was different from the other four.',
      'I had placenta previa, and the older women who helped women give birth at the church did not know how to deal with the situation. I realised I had to make a choice, and I decided to go to a health facility against my religious belief.',
      'They advised me on self-care — not doing strenuous activities, avoiding sexual intercourse, avoiding standing for long periods — to help with my condition, and I also had to have a blood transfusion. I had a c-section at 36 weeks and gave birth to my beautiful baby girl, who is named Makanaka.',
    ],
    publishedAt: '2023-02-08',
    featured: true,
    isFounderStory: false,
  },
  {
    _id: 'story-mai-ethan',
    title: 'The classes taught me how to care for myself and my baby',
    slug: 'mai-ethan',
    motherName: 'Mai Ethan',
    publishAnonymously: false,
    portrait: null,
    excerpt:
      'I was a teen mother and hid my pregnancy for five months. Antenatal classes taught me what I did not know — including that I was anaemic.',
    plainBody: [
      'I was a teen mother and hid my pregnancy for five months from my parents. When they got to know I was pregnant they supported me and had my pregnancy registered at a local clinic, and I would attend my antenatal classes regularly.',
      'I realised I was anaemic during my second trimester, something that I did not know. I got folic acid to help with the anaemia.',
      'During our antenatal classes I was taught how I should take care of my health and my pregnancy. I was also told what labour would be like and what I would be expected to do during labour. Not only that, I was also taught how I should take care of my baby after I gave birth.',
      'This knowledge, on top of the support from my family, made me accept my pregnancy — which was unwanted for five months — and I love my son.',
    ],
    publishedAt: '2023-02-15',
    featured: false,
    isFounderStory: false,
  },
  {
    _id: 'story-anonymous',
    title: 'Our baby came and we only had one set of clothing',
    slug: 'one-set-of-clothing',
    motherName: 'Anonymous',
    publishAnonymously: true,
    portrait: null,
    excerpt:
      'We planned to buy the baby essentials month by month. For people surviving hand to mouth, it was a struggle.',
    plainBody: [
      'I got pregnant with my second born just about the same time my husband lost his job. We were struggling to make ends meet and life was so hard for us. We both resorted to vending — my husband was selling bread and I was selling vegetables.',
      'We managed to raise funds for the registration fees for antenatal care when my pregnancy was at four months, and we planned to buy the baby essentials monthly for the remaining five months. This seemed like a very easy plan to implement, but for people surviving hand to mouth it was a struggle.',
      'We could not get anything in the sixth month. In the seventh month we bought a dish for bathing the baby and a bucket. In the eighth month we decided to buy a tracksuit, hat and socks. Then the ninth month came, we raised money for transport to the clinic, and that was it.',
      'Our baby came and we only had one set of clothing. Ladies from our church ended up raising money to buy baby essentials and giving me pre-loved clothes, so my child could have something to put on.',
    ],
    publishedAt: '2023-02-22',
    featured: false,
    isFounderStory: false,
  },
]
