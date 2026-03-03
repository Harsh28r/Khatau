import Container from '../components/ui/Container'

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 antialiased">
      {/* Hero */}
      <header className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-stone-950" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

        <p className="relative z-10 mb-8 text-xs font-semibold uppercase tracking-[0.45em] text-amber-400/90">
          Mumbai-style street food · Marriage · Kitty · Buffet orders
        </p>
        <h1 className="relative z-10 font-display max-w-4xl text-center text-5xl font-semibold leading-[1.08] tracking-tight md:text-7xl lg:text-8xl">
          <span className="text-white">Khatau</span>
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            Bhelpuriwala
          </span>
        </h1>
        <p className="relative z-10 mt-10 max-w-lg text-center text-lg leading-relaxed text-stone-400">
          Chaat, bhel & a variety of sandwiches — fresh, hygienic, delivered. We take orders for marriage, kitty party, buffet & all occasions.
        </p>
        <p className="relative z-10 mt-6 text-center text-sm font-medium text-amber-400/90">
          We’re coming online soon — order on mobile, web & more. Till then, call us to order.
        </p>
        <div className="relative z-10 mt-14 flex flex-wrap items-center justify-center gap-4">
          <a href="#contact" className="rounded-full bg-amber-500 px-8 py-4 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 hover:shadow-amber-500/30">
            Contact us
          </a>
          <a href="#serve" className="rounded-full border border-stone-500/50 px-8 py-4 text-sm font-medium text-stone-300 transition hover:border-amber-500/50 hover:text-white">
            What we serve
          </a>
        </div>
      </header>

      {/* We take orders for — marriage, kitty, buffet, all */}
      <section id="orders" className="relative border-t border-stone-800 bg-stone-900/50 py-24">
        <Container className="relative max-w-4xl">
          <h2 className="font-display text-center text-3xl font-semibold text-white md:text-4xl">
            We take orders for
          </h2>
          <p className="mt-4 text-center text-stone-400">
            Same fresh chaat & sandwiches, scaled for your occasion.
          </p>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Marriage', desc: 'Wedding & reception catering' },
              { label: 'Kitty party', desc: 'Light, shareable spreads' },
              { label: 'Buffet', desc: 'Full buffet-style setup' },
              { label: 'Birthday & more', desc: 'Any occasion, any scale' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-stone-700/60 bg-stone-800/40 p-6 text-center transition hover:border-amber-500/30 hover:bg-stone-800/60"
              >
                <div className="font-display text-lg font-semibold text-white">{item.label}</div>
                <div className="mt-2 text-sm text-stone-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* About */}
      <section id="about" className="relative border-t border-stone-800 py-28">
        <Container className="relative max-w-3xl">
          <h2 className="font-display text-center text-3xl font-semibold text-white md:text-4xl">Who we are</h2>
          <p className="mt-8 text-center text-lg leading-relaxed text-stone-400">
            Your neighbourhood fix for Mumbai-style chaat, bhel, and grilled sandwiches. Clean, spicy, honest — delivered or set up for marriage, kitty, buffet & all events.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              { label: 'Fresh & hygienic', detail: 'Quality ingredients, no shortcuts.', icon: '◆' },
              { label: 'Fast delivery', detail: 'Hot and crisp at your door.', icon: '◇' },
              { label: 'Bulk & party orders', detail: 'Marriage, kitty, buffet, birthday.', icon: '◆' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-stone-700/60 bg-stone-800/40 p-8 text-center transition hover:border-amber-500/30 hover:bg-stone-800/60"
              >
                <span className="text-amber-500/80 text-lg">{item.icon}</span>
                <div className="mt-4 font-display text-base font-semibold text-white">{item.label}</div>
                <div className="mt-2 text-sm text-stone-500">{item.detail}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What we serve — variety of sandwiches + chaat + more */}
      <section id="serve" className="border-t border-stone-800 bg-stone-900/50 py-24">
        <Container className="max-w-4xl">
          <h2 className="font-display text-center text-3xl font-semibold text-white md:text-4xl">What we serve</h2>
          <p className="mt-4 text-center text-stone-400">
            Chaat, bhel & a full variety of sandwiches and more.
          </p>

          <div className="mt-16 space-y-12">
            {/* Chaat & Bhel */}
            <div>
              <h3 className="font-display text-lg font-semibold text-amber-400/90 mb-4">Chaat & Bhel</h3>
              <div className="flex flex-wrap gap-2">
                {['Panipuri', 'Sevpuri', 'Dahi puri', 'Khachuri', 'Bhel', 'Sukha bhel', 'Papdi chaat', 'Samosa chaat', 'Aloo tikki', 'Ragda pattice'].map((item) => (
                  <span key={item} className="rounded-full border border-stone-600/80 bg-stone-800/50 px-4 py-2 text-sm font-medium text-stone-300">{item}</span>
                ))}
              </div>
            </div>

            {/* Variety of Sandwiches */}
            <div>
              <h3 className="font-display text-lg font-semibold text-amber-400/90 mb-4">Variety of Sandwiches</h3>
              <div className="flex flex-wrap gap-2">
                {['Cheese grill', 'Mayonnaise sandwich', 'Chocolate sandwich', 'Veg grill', 'Paneer sandwich', 'Corn sandwich', 'Mix veg sandwich', 'Grilled cheese', 'Bombay sandwich', 'Club sandwich', 'Toast sandwich', 'And more'].map((item) => (
                  <span key={item} className="rounded-full border border-stone-600/80 bg-stone-800/50 px-4 py-2 text-sm font-medium text-stone-300">{item}</span>
                ))}
              </div>
            </div>

            {/* Beverages & more */}
            <div>
              <h3 className="font-display text-lg font-semibold text-amber-400/90 mb-4">Beverages & more</h3>
              <div className="flex flex-wrap gap-2">
                {['Cold drinks', 'Lassi', 'Shikanji', 'Tea', 'Coffee', 'Juices', 'And more'].map((item) => (
                  <span key={item} className="rounded-full border border-stone-600/80 bg-stone-800/50 px-4 py-2 text-sm font-medium text-stone-300">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="relative border-t border-stone-800 overflow-hidden py-28">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/15 to-transparent" />
        <Container className="relative max-w-2xl">
          <h2 className="font-display text-center text-3xl font-semibold text-white md:text-4xl">Contact us</h2>
          <p className="mt-4 text-center text-stone-400">For orders — marriage, kitty, buffet, birthday & all.</p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <a
              href="tel:+919699619702"
              className="group rounded-2xl border border-stone-700/60 bg-stone-800/40 p-8 text-center transition hover:border-amber-500/40 hover:bg-stone-800/60"
            >
              <div className="font-display text-xl font-semibold text-white group-hover:text-amber-400">Sunil Gupta</div>
              <div className="mt-3 text-lg font-medium text-amber-400/90 tracking-wide">96996 19702</div>
              <div className="mt-2 text-sm text-stone-500">Tap to call</div>
            </a>
            <a
              href="tel:+917822952756"
              className="group rounded-2xl border border-stone-700/60 bg-stone-800/40 p-8 text-center transition hover:border-amber-500/40 hover:bg-stone-800/60"
            >
              <div className="font-display text-xl font-semibold text-white group-hover:text-amber-400">Harsh Gupta</div>
              <div className="mt-3 text-lg font-medium text-amber-400/90 tracking-wide">78229 52756</div>
              <div className="mt-2 text-sm text-stone-500">Tap to call</div>
            </a>
          </div>
        </Container>
      </section>

      {/* Coming online — phrase */}
      <section className="border-t border-stone-800 bg-stone-900/30 py-16">
        <Container className="max-w-2xl text-center">
          <p className="font-display text-xl font-semibold text-white md:text-2xl">
            We’re coming online soon
          </p>
          <p className="mt-3 text-stone-400">
            Order on mobile, web & more — we’re getting there. Till then, call us for orders (marriage, kitty, buffet & all).
          </p>
        </Container>
      </section>

      {/* Footer */}
      <section className="border-t border-stone-800 py-12">
        <Container className="text-center">
          <p className="font-display text-lg font-semibold text-white">Khatau Bhelpuriwala</p>
          <p className="mt-2 text-sm text-stone-500">Marriage · Kitty · Buffet · Birthday & all. Coming online — mobile, web & more. Reach out to order.</p>
        </Container>
      </section>
    </div>
  )
}
