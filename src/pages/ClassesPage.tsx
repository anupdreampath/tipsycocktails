const CITIES = [
  { title: 'Cocktail Making Classes', img: 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Cocktail-Making-Classes-Scotland.png?strip=all' },
  { title: '21st Birthdays', img: 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/FD48F650-3EDF-4A0E-8EDB-2F0EC3150454-1.jpeg?strip=all' },
  { title: 'Mobile Bar Hire', img: 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Mobile-Bar.jpg?strip=all' },
  { title: 'Corporate Events', img: 'https://e4yma3cntkc.exactdn.com/wp-content/uploads/Corporate-4.jpg?strip=all' },
]

export default function ClassesPage() {
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
                <div className="img-wrap"><img src={c.img} alt={c.title} loading="lazy" /></div>
                <h3>{c.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
