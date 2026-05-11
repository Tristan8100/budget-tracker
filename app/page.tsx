import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-['DM_Sans',sans-serif]">

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

        .playfair { font-family: 'Playfair Display', serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .anim-1 { animation: fadeUp .7s ease both; }
        .anim-2 { animation: fadeUp .7s .15s ease both; }
        .anim-3 { animation: fadeUp .7s .3s ease both; }
        .anim-4 { animation: fadeUp .7s .45s ease both; }
        .anim-5 { animation: fadeUp .7s .6s ease both; }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #a0a0a0 40%, #fff 60%, #a0a0a0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .card-glow:hover {
          box-shadow: 0 0 40px rgba(255,255,255,0.05);
        }

        .btn-primary {
          background: #fff;
          color: #0a0a0a;
          font-weight: 600;
          letter-spacing: -0.01em;
          transition: background .2s, transform .15s;
        }
        .btn-primary:hover {
          background: #e5e5e5;
          transform: translateY(-1px);
        }

        .btn-ghost {
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
          transition: border-color .2s, color .2s;
        }
        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.4);
          color: #fff;
        }

        .feature-card {
          background: #111;
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color .25s, transform .25s;
        }
        .feature-card:hover {
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-3px);
        }

        .stat-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
        }

        .noise-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/[0.06] backdrop-blur-md bg-[#0a0a0a]/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
            <span className="text-[#0a0a0a] font-bold text-xs">₱</span>
          </div>
          <span className="font-semibold tracking-tight text-sm">Trackr</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="#preview" className="hover:text-white transition-colors">Preview</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-ghost text-xs px-4 py-2 rounded-full">
            Sign in
          </Link>
          <Link href="/dashboard" className="btn-primary text-xs px-4 py-2 rounded-full">
            Get started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative noise-bg min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-16 px-6">
        {/* glow blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="anim-1 stat-pill text-xs px-4 py-1.5 rounded-full text-white/60 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Personal finance — simplified
          </div>

          <h1 className="anim-2 playfair text-5xl md:text-7xl leading-[1.05] tracking-tight">
            Know exactly where<br />
            <em className="shimmer-text not-italic">your money goes.</em>
          </h1>

          <p className="anim-3 text-white/50 text-base md:text-lg max-w-lg leading-relaxed font-light">
            Trackr helps you manage wallets, log transactions, and see your spending clearly — all in one clean dashboard.
          </p>

          <div className="anim-4 flex flex-col sm:flex-row items-center gap-3">
            <Link href="/dashboard" className="btn-primary px-7 py-3 rounded-full text-sm">
              Start tracking free
            </Link>
            <a href="#preview" className="btn-ghost px-7 py-3 rounded-full text-sm">
              See the app →
            </a>
          </div>

          {/* floating stats */}
          <div className="anim-5 flex flex-wrap justify-center gap-3 mt-4">
            {[
              { label: 'Net flow today', value: '+₱4,200.00', color: 'text-green-400' },
              { label: 'Wallets tracked', value: '3 active', color: 'text-white' },
              { label: 'Transactions logged', value: '128 this month', color: 'text-white' },
            ].map((s) => (
              <div key={s.label} className="stat-pill px-4 py-2 rounded-xl text-left">
                <p className="text-white/40 text-xs">{s.label}</p>
                <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* hero mockup image */}
        <div className="relative z-10 mt-16 w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <Image
            src="/layoutOverlay.png"
            alt="Trackr app mockup"
            width={1200}
            height={700}
            className="w-full object-cover"
            priority
          />
          {/* overlay gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">What's inside</p>
          <h2 className="playfair text-4xl md:text-5xl">Everything you need,<br /><em className="text-white/50 not-italic">nothing you don't.</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: '💳',
              title: 'Multi-Wallet Support',
              desc: 'Create as many wallets as you need — cash, bank, e-wallet. Each one tracks its own running balance automatically.',
            },
            {
              icon: '↕️',
              title: 'Cash In & Cash Out',
              desc: 'Log transactions with a type, name, and description. Wallet balance updates instantly. Amounts are locked once saved.',
            },
            {
              icon: '📊',
              title: 'Analytics Dashboard',
              desc: 'See total balance, net flow, biggest expense, and most active wallet — filtered by today, week, month, or custom range.',
            },
            {
              icon: '📈',
              title: 'Daily Flow Chart',
              desc: 'Bar chart showing Cash In vs Cash Out grouped by day. Spot overspending patterns before they become a problem.',
            },
            {
              icon: '🗂️',
              title: "Today's Transactions",
              desc: "Every transaction page defaults to today's activity. Clean table view with instant edit and delete with balance rollback.",
            },
            {
              icon: '🔒',
              title: 'Secure by Default',
              desc: 'Built on Supabase with Row Level Security. Your data is yours — nobody else can read or write to your records.',
            },
          ].map((f) => (
            <div key={f.title} className="feature-card card-glow rounded-2xl p-6 flex flex-col gap-3">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-semibold text-base tracking-tight">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 md:px-12 py-24 bg-[#0d0d0d] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-3">How it works</p>
            <h2 className="playfair text-4xl md:text-5xl">Up and running<br /><em className="text-white/50 not-italic">in three steps.</em></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your wallets',
                desc: 'Add your cash, bank accounts, or e-wallets. Set an initial balance and give each one a name.',
                img: '/images/step-wallets.png',
              },
              {
                step: '02',
                title: 'Log transactions',
                desc: 'Record every cash in or cash out. Pick the wallet, enter the amount, and your balance updates automatically.',
                img: '/images/step-transactions.png',
              },
              {
                step: '03',
                title: 'Read your dashboard',
                desc: 'Switch between Today, This Week, or This Month to see where your money is going and how your wallets are doing.',
                img: '/images/step-dashboard.png',
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col gap-4">
                <div className="rounded-xl overflow-hidden border border-white/08 aspect-video bg-[#111] relative">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover opacity-80"
                  />
                </div>
                <div>
                  <span className="text-white/20 text-xs font-mono">{s.step}</span>
                  <h3 className="font-semibold mt-1 mb-1">{s.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed font-light">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW / SCREENSHOT */}
      <section id="preview" className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">App preview</p>
          <h2 className="playfair text-4xl md:text-5xl">Designed to stay<br /><em className="text-white/50 not-italic">out of your way.</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* big left */}
          <div className="rounded-2xl overflow-hidden border border-white/08 relative aspect-[4/5] bg-[#111]">
            <Image
              src="/images/preview-dashboard.png"
              alt="Dashboard preview"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Dashboard</p>
              <p className="font-medium">Full analytics at a glance</p>
            </div>
          </div>

          {/* right stack */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden border border-white/08 relative aspect-video bg-[#111]">
              <Image
                src="/images/preview-transactions.png"
                alt="Transactions preview"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5">Transactions</p>
                <p className="text-sm font-medium">Today's activity, always first</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/08 relative aspect-video bg-[#111]">
              <Image
                src="/images/preview-wallets.png"
                alt="Wallets preview"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5">Wallets</p>
                <p className="text-sm font-medium">All your accounts in one place</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIFESTYLE IMAGE BREAK */}
      <section className="relative h-[50vh] overflow-hidden border-y border-white/[0.06]">
        <Image
          src="/images/lifestyle-desk.png"
          alt="Finance tracking lifestyle"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <blockquote className="playfair text-3xl md:text-5xl text-center max-w-2xl px-6 leading-snug">
            <em>"A budget isn't about restriction.<br />It's about intention."</em>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-32 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <h2 className="playfair text-4xl md:text-6xl leading-tight">
            Start knowing your<br /><em className="text-white/40 not-italic">numbers today.</em>
          </h2>
          <p className="text-white/45 text-sm leading-relaxed font-light">
            No subscriptions. No complexity. Just clear, honest tracking of where your money is going.
          </p>
          <Link href="/dashboard" className="btn-primary px-9 py-3.5 rounded-full text-sm mt-2">
            Open Trackr →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white flex items-center justify-center">
            <span className="text-[#0a0a0a] font-bold text-[9px]">₱</span>
          </div>
          <span>Trackr</span>
        </div>
        <p>Built with Next.js + Supabase</p>
        <div className="flex gap-6">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/wallets" className="hover:text-white transition-colors">Wallets</Link>
          <Link href="/transactions" className="hover:text-white transition-colors">Transactions</Link>
        </div>
      </footer>
    </main>
  );
}