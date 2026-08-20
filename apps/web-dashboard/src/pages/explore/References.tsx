const REFERENCES = [
  {
    text: 'Trip.com. (n.d.). Singapore three cultural districts 4 hr private chartered tour (English-speaking driver). https://sg.trip.com/things-to-do/detail/108001587/',
    url: 'https://sg.trip.com/things-to-do/detail/108001587/',
  },
  {
    text: 'Casa Mia. (n.d.). Top highlights of Little India, Singapore. https://www.casamia.co/page/little-india',
    url: 'https://www.casamia.co/page/little-india',
  },
  {
    text: 'TourHQ. (n.d.). 4-hour Kampong Glam walking tour with Sultan Mosque and Haji Lane. https://www.tourhq.com/tours/50184/4-hour-private-walking-tour-of-the-vibrant-kampong-glam',
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
