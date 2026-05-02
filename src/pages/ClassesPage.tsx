import { cmsValue, usePageContent } from '../lib/cms'

const CITIES = [
  { title: 'Cocktail Making Classes', titleKey: 'cocktail-making-classes-title', imageKey: 'cocktail-making-classes-image', img: 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Cocktail-Making-Classes-Scotland.png?strip=all' },
  { title: '21st Birthdays', titleKey: '21st-birthdays-title', imageKey: '21st-birthdays-image', img: 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/FD48F650-3EDF-4A0E-8EDB-2F0EC3150454-1.jpeg?strip=all' },
  { title: 'Mobile Bar Hire', titleKey: 'mobile-bar-hire-title', imageKey: 'mobile-bar-hire-image', img: 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Mobile-Bar.jpg?strip=all' },
  { title: 'Corporate Events', titleKey: 'corporate-events-title', imageKey: 'corporate-events-image', img: 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Corporate-4.jpg?strip=all' },
]

export default function ClassesPage() {
  const content = usePageContent('classes')

  return (
    <section id="classes" className="block bg-cream classes-standalone" style={{ paddingTop: '180px' }}>
      <div className="container">
        <div className="classes-row">
          <div className="classes-text">
            <h2>Cocktail<br/>Making<br/>Classes</h2>
            <p>Discover the craft of cocktail making with our hands-on mixology experiences delivered straight to your venue — no travel, no hassle, just great drinks.</p>
            <p>Whether you're planning the ultimate hen night, a milestone birthday, or a standout team event, our masterclasses bring the bar to you. Your guests will shake, muddle, and pour their way through expertly chosen recipes — guided every step of the way by our enthusiastic bartenders.</p>
          </div>
          <div className="classes-scroll">
            {CITIES.map(c => (
              <a className="polaroid" key={c.title} href="#">
                <div className="img-wrap"><img src={cmsValue(content, 'gallery', c.imageKey, c.img)} alt={cmsValue(content, 'gallery', c.titleKey, c.title)} loading="lazy" /></div>
                <h3>{cmsValue(content, 'gallery', c.titleKey, c.title)}</h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
