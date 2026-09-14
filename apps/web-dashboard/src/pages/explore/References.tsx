const REFERENCES = [
  {
    text: 'Trip.com. (n.d.). Singapore three cultural districts 4 hr private chartered tour (English speaking driver). https://sg.trip.com/things-to-do/detail/108001587/',
    url: 'https://sg.trip.com/things-to-do/detail/108001587/',
  },
  {
    text: 'Casa Mia. (n.d.). Top highlights of Little India, Singapore. https://www.casamia.co/page/little-india',
    url: 'https://www.casamia.co/page/little-india',
  },
  {
    text: 'TourHQ. (n.d.). 4 hour Kampong Glam walking tour with Sultan Mosque and Haji Lane. https://www.tourhq.com/tours/50184/4-hour-private-walking-tour-of-the-vibrant-kampong-glam',
    url: 'https://www.tourhq.com/tours/50184/4-hour-private-walking-tour-of-the-vibrant-kampong-glam',
  },
  {
    text: 'Eu Yan Sang TCM Clinic. (n.d.). How TCM works. https://sg.euyansangclinic.com/health-articles/how-tcm-works',
    url: 'https://sg.euyansangclinic.com/health-articles/how-tcm-works',
  },
  {
    text: 'TripSavvy. (n.d.). Ordering teh tarik in Malaysia & Singapore. https://www.tripsavvy.com/ordering-teh-tarik-in-malaysia-1629522',
    url: 'https://www.tripsavvy.com/ordering-teh-tarik-in-malaysia-1629522',
  },
  {
    text: "National Heritage Board. (n.d.). Kiah's Gallery. https://www.roots.gov.sg/places/places-landing/trails/landmarks/kampong-gelam-citizen-engagement/kiahs-gallery",
    url: 'https://www.roots.gov.sg/places/places-landing/trails/landmarks/kampong-gelam-citizen-engagement/kiahs-gallery',
  },
  {
    text: 'The Qi. (n.d.). The history and healing power of chrysanthemum. https://the-qi.com/blogs/journal/the-history-and-healing-power-of-chrysanthemum',
    url: 'https://the-qi.com/blogs/journal/the-history-and-healing-power-of-chrysanthemum',
  },
  {
    text: 'South China Morning Post. (n.d.). Goji berries are a superfood: here\'s why you should eat them in moderation. https://www.scmp.com/lifestyle/health-wellness/article/3298004/goji-berries-are-superfood-heres-why-you-should-eat-them-moderation',
    url: 'https://www.scmp.com/lifestyle/health-wellness/article/3298004/goji-berries-are-superfood-heres-why-you-should-eat-them-moderation',
  },
  {
    text: 'Thomson Medical. (n.d.). 10 restorative herbs recommended by our TCM physicians. https://www.thomsonmedical.com/blog/10-restorative-herbs-recommended-by-our-tcm-physicians',
    url: 'https://www.thomsonmedical.com/blog/10-restorative-herbs-recommended-by-our-tcm-physicians',
  },
  {
    text: 'Berry Ltd. (n.d.). Hawthorn: a prized little fruit high in vitamin C. https://www.berryltd.co.uk/products/hawthorn-a-prized-little-fruit-high-in-vitamin-c/',
    url: 'https://www.berryltd.co.uk/products/hawthorn-a-prized-little-fruit-high-in-vitamin-c/',
  },
  {
    text: 'LJH. (n.d.). Mint local leaf 300g. https://ljh.com.sg/products/mint-local-leaf-300g-%E6%9C%AC%E5%9C%B0%E8%96%84%E8%8D%B7%E5%8F%B6',
    url: 'https://ljh.com.sg/products/mint-local-leaf-300g-%E6%9C%AC%E5%9C%B0%E8%96%84%E8%8D%B7%E5%8F%B6',
  },
  {
    text: 'Michelin Guide. (n.d.). Ingredient: Tangerine peel. https://guide.michelin.com/sg/en/article/dining-in/ingredient-tangerine-peel',
    url: 'https://guide.michelin.com/sg/en/article/dining-in/ingredient-tangerine-peel',
  },
  {
    text: 'Unsplash. (n.d.). A bunch of red lanterns hanging from a ceiling [Photograph]. https://unsplash.com/photos/a-bunch-of-red-lanterns-hanging-from-a-ceiling-_VHun2XySEs',
    url: 'https://unsplash.com/photos/a-bunch-of-red-lanterns-hanging-from-a-ceiling-_VHun2XySEs',
  },
  {
    text: 'Home & Decor Singapore. (n.d.). Buying a shophouse in Singapore? 5 things to know. https://www.homeanddecor.com.sg/property/buying-shophouse-singapore',
    url: 'https://www.homeanddecor.com.sg/property/buying-shophouse-singapore',
  },
  {
    text: 'Ostrich Trails. (n.d.). Little India walking trail, Singapore. https://www.ostrichtrails.com/asia/singapore/little-india-walking-trail/',
    url: 'https://www.ostrichtrails.com/asia/singapore/little-india-walking-trail/',
  },
  {
    text: 'Pelago. (n.d.). Little India, Singapore guide. https://www.pelago.com/en/articles/little-india-singapore-guide/',
    url: 'https://www.pelago.com/en/articles/little-india-singapore-guide/',
  },
  {
    text: 'Wikipedia. (n.d.). Sri Veeramakaliamman Temple. https://en.wikipedia.org/wiki/Sri_Veeramakaliamman_Temple',
    url: 'https://en.wikipedia.org/wiki/Sri_Veeramakaliamman_Temple',
  },
  {
    text: 'AFAR. (n.d.). Little India, Singapore. https://www.afar.com/places/little-india-singapore-3',
    url: 'https://www.afar.com/places/little-india-singapore-3',
  },
  {
    text: 'Tripadvisor. (n.d.). Moghul Sweets, Singapore. https://www.tripadvisor.com/Restaurant_Review-g294265-d11803564-Reviews-Moghul_Sweets-Singapore.html',
    url: 'https://www.tripadvisor.com/Restaurant_Review-g294265-d11803564-Reviews-Moghul_Sweets-Singapore.html',
  },
];

export default function References() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-heading font-extrabold text-3xl text-navy mb-2">References</h1>
        <p className="font-body text-navy/60 text-sm max-w-md mx-auto">
          Sources cited in this heritage explorer, formatted in APA 7th edition.
        </p>
      </div>

      <ol className="space-y-4 list-none">
        {REFERENCES.map((ref, i) => (
          <li
            key={ref.url}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p className="font-body text-sm text-navy/80 leading-relaxed">
              <span className="font-heading font-bold text-navy mr-2">{i + 1}.</span>
              {ref.text.replace(ref.url, '')}
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:underline break-all"
              >
                {ref.url}
              </a>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
