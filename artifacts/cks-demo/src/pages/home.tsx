import { useState } from 'react';
import { ArrowDownRight, ArrowRight, Menu, X } from 'lucide-react';
import { usePageMetadata } from '@/components/shell';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/lib/i18n';
import './home.css';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const route = (path: string) => `${base}${path}`;
const logo = `${base}/cks-logo-reference.jpeg`;

function Brand() {
  const { t } = useLanguage();
  return (
    <a className="cks-brand" href={route('/')} aria-label={t('CKS Crypto Klein Shop home')} data-testid="link-home-brand">
      <img src={logo} alt={t('CKS Crypto Klein Shop logo')} />
      <span><strong>CKS</strong><span>Crypto Klein Shop</span></span>
    </a>
  );
}

function PortfolioPreview() {
  const { t, locale } = useLanguage();
  const money = (amount: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount);
  return (
    <div className="cks-preview cks-enter-delay" aria-label={t('Illustrative portfolio dashboard preview')}>
      <div className="cks-preview-head">
        <span className="cks-preview-label">{t('Portfolio overview')}</span>
        <span className="cks-sandbox-chip"><i className="cks-note-dot" /> {t('DEMO ENVIRONMENT')}</span>
      </div>
      <div className="cks-preview-balance">
        <small>{t('Illustrative total value')}</small>
        <strong>{money(24680.42)}</strong>
        <span>{t('Example balance · no real assets')}</span>
      </div>
      <svg className="cks-chart" viewBox="0 0 440 125" role="img" aria-label={t('Decorative example portfolio line chart')}>
        <defs>
          <linearGradient id="cks-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8eb1d1" stopOpacity=".3" />
            <stop offset="100%" stopColor="#8eb1d1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="cks-chart-grid">
          <line x1="0" y1="20" x2="440" y2="20" /><line x1="0" y1="55" x2="440" y2="55" />
          <line x1="0" y1="90" x2="440" y2="90" />
        </g>
        <path className="cks-chart-fill" d="M0 88 C22 82 31 92 51 73 S81 81 102 62 S131 73 150 54 S180 59 199 47 S229 62 249 39 S279 55 299 35 S325 49 344 28 S377 38 394 22 S423 29 440 11 L440 125 L0 125Z" />
        <path className="cks-chart-line" d="M0 88 C22 82 31 92 51 73 S81 81 102 62 S131 73 150 54 S180 59 199 47 S229 62 249 39 S279 55 299 35 S325 49 344 28 S377 38 394 22 S423 29 440 11" />
      </svg>
      <div className="cks-chart-labels">{['MON','TUE','WED','THU','FRI','SAT','SUN'].map(day=><span key={day}>{t(day)}</span>)}</div>
      <div className="cks-preview-assets">
        <div className="cks-mini-asset"><span className="cks-coin">₿</span><span><strong>Bitcoin</strong><small>BTC · 0.184</small></span></div>
        <div className="cks-mini-asset"><span className="cks-coin">Ξ</span><span><strong>Ethereum</strong><small>ETH · 2.45</small></span></div>
        <div className="cks-mini-asset"><span className="cks-coin">S</span><span><strong>Solana</strong><small>SOL · 18.0</small></span></div>
        <span className="cks-preview-legend">{t('Sample data')}</span>
      </div>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const { t } = useLanguage();
  usePageMetadata(
    t('Explore the CKS crypto demo'),
    t('Explore the CKS Crypto Klein Shop sandbox with transparent sample balances and simulated actions. No real funds or assets are handled.'),
  );

  return (
    <main className="cks-home">
      <header className="cks-topbar">
        <nav className="cks-nav cks-wrap" aria-label="Main navigation">
          <Brand />
          <div className={`cks-navlinks${menuOpen ? ' is-open' : ''}`}>
            <a href="#about" onClick={closeMenu}>{t('About CKS')}</a>
            <a href="#explore" onClick={closeMenu}>{t('Explore the demo')}</a>
            <a href="#how-it-works" onClick={closeMenu}>{t('How it works')}</a>
            <a href="#questions" onClick={closeMenu}>{t('Questions')}</a>
            <LanguageSwitcher className="cks-mobile-language" />
            <a className="cks-mobile-auth" href={route('/sign-in')} onClick={closeMenu}>{t('Log in')}</a>
            <a className="cks-mobile-auth is-primary" href={route('/sign-up')} onClick={closeMenu}>{t('Create account')}</a>
          </div>
          <div className="cks-nav-actions">
            <LanguageSwitcher className="cks-desktop-language" />
            <a className="cks-button cks-button-quiet" href={route('/sign-in')} data-testid="link-sign-in">{t('Log in')}</a>
            <a className="cks-button cks-button-primary" href={route('/sign-up')} data-testid="link-sign-up">{t('Create account')}</a>
            <button className="cks-mobile-toggle" aria-label={menuOpen ? t('Close navigation menu') : t('Open navigation menu')} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>
      </header>

      <section className="cks-hero">
        <div className="cks-wrap cks-hero-grid">
          <div className="cks-enter">
            <span className="cks-kicker">{t('A clearer way to explore crypto')}</span>
            <h1>{t('Get familiar with digital assets, at your own pace.')}</h1>
            <p className="cks-hero-copy">{t('CKS is a transparent crypto-finance sandbox. Explore an example portfolio and simulated actions in a space designed to make the mechanics easier to understand.')}</p>
            <div className="cks-hero-actions">
              <a className="cks-button cks-button-primary" href={route('/dashboard')} data-testid="link-enter-demo">{t('Explore the demo')} <ArrowRight size={15} /></a>
              <a className="cks-button cks-button-quiet" href={route('/sign-up')} data-testid="link-hero-sign-up">{t('Create account')}</a>
            </div>
            <div className="cks-hero-note"><span className="cks-note-dot" />{t('An illustrative environment — no real funds or assets.')}</div>
          </div>
          <PortfolioPreview />
        </div>
      </section>

      <section className="cks-proofbar" aria-label="CKS sandbox details">
        <div className="cks-wrap cks-proof-inner">
          <div className="cks-proof-intro"><strong>{t('Clarity before complexity.')}</strong>{t('A practical place to look around and learn the interface.')}</div>
          <div className="cks-proof-item"><span className="cks-proof-number">01</span><span>{t('Sample prices and balances')}</span></div>
          <div className="cks-proof-item"><span className="cks-proof-number">02</span><span>{t('Simulated actions only')}</span></div>
          <div className="cks-proof-item"><span className="cks-proof-number">03</span><span>{t('Simple, readable portfolio views')}</span></div>
        </div>
      </section>

      <section className="cks-section cks-why" id="about">
        <div className="cks-wrap cks-why-grid">
          <div className="cks-section-heading">
            <span className="cks-kicker">{t('A practical introduction')}</span>
            <h2>{t('Understand the experience before anything else.')}</h2>
            <p>{t('Digital assets can feel unfamiliar. CKS gives you room to inspect a portfolio-style interface, follow example activity, and learn what the controls represent.')}</p>
          </div>
          <div>
            <div className="cks-why-aside"><strong>{t('Built to demonstrate, not to promise.')}</strong>{t('Nothing in the sandbox represents an offer, a forecast, or a live financial service. Values and market movements are illustrative.')}</div>
            <div className="cks-principles">
              <article className="cks-principle"><span className="cks-principle-index">01</span><div><h3>{t('See what is simulated')}</h3><p>{t('Sample data and demo actions are identified as illustrative, rather than presented as live activity.')}</p></div></article>
              <article className="cks-principle"><span className="cks-principle-index">02</span><div><h3>{t('Move at your pace')}</h3><p>{t('Browse the example experience without pressure to make a trade or deposit funds.')}</p></div></article>
              <article className="cks-principle"><span className="cks-principle-index">03</span><div><h3>{t('Follow the details')}</h3><p>{t('Explore portfolio views, asset lists, and a simulated activity history in one place.')}</p></div></article>
              <article className="cks-principle"><span className="cks-principle-index">04</span><div><h3>{t('Keep expectations clear')}</h3><p>{t('CKS is a learning demonstration, not an exchange, wallet, or investment service.')}</p></div></article>
            </div>
          </div>
        </div>
      </section>

      <section className="cks-section cks-explore" id="explore">
        <div className="cks-wrap cks-explore-layout">
          <div className="cks-explore-copy">
            <span className="cks-kicker">{t('Inside the sandbox')}</span>
            <h2>{t('A familiar portfolio view. Example data throughout.')}</h2>
            <p>{t('Open the demo to see how a digital-asset dashboard can organize balances, asset values, and activity. Its numbers are sample values, not market quotes.')}</p>
            <ul className="cks-list">
              <li><span className="cks-check">✓</span><span>{t('Compare example asset balances in one view.')}</span></li>
              <li><span className="cks-check">✓</span><span>{t('Try simulated buy, sell, and send flows.')}</span></li>
              <li><span className="cks-check">✓</span><span>{t('Review a local, illustrative activity journal.')}</span></li>
            </ul>
            <a className="cks-button cks-button-primary" style={{ marginTop: 26 }} href={route('/dashboard')} data-testid="link-explore-dashboard">{t('Open the demo')} <ArrowRight size={15} /></a>
          </div>
          <div className="cks-asset-board" aria-label={t('Example asset list')}>
            <div className="cks-board-head"><h3>{t('Example asset overview')}</h3><span>{t('ILLUSTRATIVE VALUES')}</span></div>
            <div className="cks-asset-row cks-asset-title"><div>{t('Asset')}</div><div>{t('Sample balance')}</div><div>{t('Example value')}</div></div>
            <div className="cks-asset-row"><div className="cks-asset-name"><span className="cks-coin">₿</span><span><strong>Bitcoin</strong><small>BTC</small></span></div><div className="cks-asset-value">0.184 BTC</div><div><div className="cks-asset-value">{money(12340)}</div><div className="cks-asset-change">{t('Example')}</div></div></div>
            <div className="cks-asset-row"><div className="cks-asset-name"><span className="cks-coin">Ξ</span><span><strong>Ethereum</strong><small>ETH</small></span></div><div className="cks-asset-value">2.450 ETH</div><div><div className="cks-asset-value">{money(7915)}</div><div className="cks-asset-change">{t('Example')}</div></div></div>
            <div className="cks-asset-row"><div className="cks-asset-name"><span className="cks-coin">S</span><span><strong>Solana</strong><small>SOL</small></span></div><div className="cks-asset-value">18.000 SOL</div><div><div className="cks-asset-value">{money(4425)}</div><div className="cks-asset-change">{t('Example')}</div></div></div>
            <div className="cks-board-foot"><span className="cks-info-dot">i</span>{t('Assets, balances, and values shown are fictional sample data for demonstration.')}</div>
          </div>
        </div>
      </section>

      <section className="cks-section cks-steps" id="how-it-works">
        <div className="cks-wrap">
          <div className="cks-section-heading">
            <span className="cks-kicker">{t('Getting started')}</span>
            <h2>{t('Three small steps. No real-money commitment.')}</h2>
            <p>{t('Take a look around, learn the terms, then decide whether the demo is useful to you.')}</p>
          </div>
          <div className="cks-steps-grid">
            <article className="cks-step"><span className="cks-step-num">{t('STEP 01')}</span><h3>{t('Enter the demo')}</h3><p>{t('Go straight to the dashboard and look through the pre-filled example portfolio.')}</p></article>
            <article className="cks-step"><span className="cks-step-num">{t('STEP 02')}</span><h3>{t('Explore the controls')}</h3><p>{t('Try simulated actions and review how a typical portfolio interface is arranged.')}</p></article>
            <article className="cks-step"><span className="cks-step-num">{t('STEP 03')}</span><h3>{t('Keep learning')}</h3><p>{t('Return to the sandbox whenever you like. Demo data may be stored in this browser.')}</p></article>
          </div>
        </div>
      </section>

      <section className="cks-not-real" aria-label="Important information about the sandbox">
        <div className="cks-wrap cks-not-real-inner">
        <div className="cks-not-real-copy"><span className="cks-not-real-icon">i</span><div><strong>{t('This is a demonstration environment.')}</strong><p>{t('CKS does not handle real funds or execute transactions. Market values, portfolio data, and simulated actions are examples only; they are not live provider data or financial advice.')}</p></div></div>
          <a href={route('/dashboard')} data-testid="link-sandbox-details">{t('See the demo')} <ArrowRight size={13} /></a>
        </div>
      </section>

      <section className="cks-section cks-faq" id="questions">
        <div className="cks-wrap cks-faq-grid">
          <div className="cks-section-heading">
            <span className="cks-kicker">{t('Good to know')}</span>
            <h2>{t('A few straight answers.')}</h2>
            <p>{t('Clear boundaries are part of the experience. Here is what to expect from CKS.')}</p>
          </div>
          <div className="cks-faq-list">
            <details><summary>{t('Does CKS use real money or real crypto?')}</summary><p>{t('No. CKS is a sandbox. The displayed balances and values are illustrative, and actions in the demo do not move real funds or assets.')}</p></details>
            <details><summary>{t('Are the displayed prices live market prices?')}</summary><p>{t('No. Prices and portfolio movements in the current demo are sample values. They are not connected to a live market-data provider.')}</p></details>
            <details><summary>{t('What happens when I try a demo action?')}</summary><p>{t('Buy, sell, and send flows are simulated. Demo information may be saved in your browser for the sandbox experience; it is not an authoritative account ledger.')}</p></details>
            <details><summary>{t('Is CKS a crypto exchange or wallet?')}</summary><p>{t('No. CKS demonstrates interface concepts. It does not provide exchange execution, custody, deposits, or withdrawals.')}</p></details>
          </div>
        </div>
      </section>

      <section className="cks-final">
        <div className="cks-wrap cks-final-inner">
          <div>
            <span className="cks-kicker">{t('Take a closer look')}</span>
            <h2>{t('Curiosity is a good place to start.')}</h2>
            <p>{t('Step into the CKS demo and explore at your own pace. No real funds. No pressure.')}</p>
          </div>
          <div className="cks-final-actions">
            <a className="cks-button cks-button-primary" href={route('/dashboard')} data-testid="link-final-demo">{t('Enter the demo')} <ArrowRight size={15} /></a>
            <a className="cks-button cks-button-quiet" href={route('/sign-up')} data-testid="link-final-sign-up">{t('Create account')}</a>
          </div>
        </div>
      </section>

      <footer className="cks-footer">
        <div className="cks-wrap cks-footer-inner">
          <Brand />
          <div className="cks-footer-note">{t('CKS Crypto Klein Shop is a crypto-finance sandbox for demonstration purposes. All displayed data is illustrative. No real financial services are provided.')}</div>
          <a href={route('/sign-in')} style={{ fontSize: 11, fontWeight: 700 }} data-testid="link-footer-sign-in">{t('Log in')} <ArrowDownRight size={13} /></a>
        </div>
      </footer>
    </main>
  );
}

export default Home;
