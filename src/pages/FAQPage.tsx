import { useState } from 'react'

const FAQS = [
  {
    q: `Can I choose which cocktails are made?`,
    a: `Yes, you are welcome to select the cocktails for your masterclass and for bar hire from our menu. Please provide your choices to us at least 10 days prior to the event.`,
  },
  {
    q: "Can I still make a booking if I don't know the full address of my venue?",
    a: `Yes, you can still make a booking. We initially require the general area of the event to provide an accurate quote. The full address can be confirmed a few days before the event.`,
  },
  {
    q: `What do I need to provide?`,
    a: "All we require is a suitable table space — we'll take care of everything else. Access to a nearby sink is ideal, but we can make alternative arrangements if informed in advance.",
  },
  {
    q: `Do you provide any other drinks other than cocktails for my bar hire?`,
    a: `We specialise in cocktails and do not supply other beverages. However, if you provide additional drinks and appropriate glassware (e.g. gin & tonic, bottled beers, wine), we are happy to serve them to your guests.`,
  },
  {
    q: "What if some of my guests don't drink?",
    a: `We offer a selection of mocktails, and we can also prepare cocktails using alcohol-free spirits to accommodate non-drinking guests.`,
  },
  {
    q: `When will the bartender arrive?`,
    a: `Our bartender will typically arrive approximately 30 minutes before the start time to set up. This setup time does not reduce your booked service time. We also require around 30 minutes after the event to clear away.`,
  },
  {
    q: "I would like to make a booking but what if my numbers aren't finalised?",
    a: `You can secure your booking with a £20 deposit based on an estimated number of guests. Final guest numbers must be confirmed at least 10 days before the event, when the remaining balance is due. You may also adjust guests between cocktail and mocktail options at that time.`,
  },
  {
    q: `Can I have my booking outside?`,
    a: `Yes, outdoor bookings are possible, weather permitting. Ideally, access to a sink and cold water tap is preferred, but we can adapt if informed in advance.`,
  },
  {
    q: `Can I book at short notice?`,
    a: "Absolutely. For bookings made within 14 days of the event, we recommend contacting us via email to confirm availability before booking. Cocktail selections will also need to be confirmed at the time of booking if less than 10 days' notice is given, and full payment will need to be made to confirm your booking.",
  },
  {
    q: `What is your cancellation policy?`,
    a: `Cancellations made less than 10 days before the event are non-refundable. Cancellations made more than 10 days in advance will receive a full refund, excluding the £20 deposit.`,
  },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="block bg-cream faq-section" style={{ paddingTop: '180px' }}>
      <div className="container">
        <div className="faq-head">
          <h2>FAQ</h2>
          <p><strong>Please note:</strong> Our packages can be tailored to suit most requirements. If you have any additional questions, please feel free to contact us via WhatsApp or email.</p>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div className={`faq-item ${isOpen ? 'open' : ''}`} key={i}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="faq-answer"><p>{f.a}</p></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
