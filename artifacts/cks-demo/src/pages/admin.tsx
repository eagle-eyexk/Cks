import { useState } from 'react';
import { Activity, ArrowUpRight, Database, LockKeyhole, ShieldCheck, ToggleLeft } from 'lucide-react';
import { PageHead } from '@/components/shell';
import { useLanguage } from '@/lib/i18n';

const initialControls = [
  { id: 'markets', title: 'Demo market feed', detail: 'Fixed sample prices shown in the demo markets area.', enabled: true },
  { id: 'trading', title: 'Simulated trading', detail: 'Browser-only buy and sell previews using fixed demo values.', enabled: true },
  { id: 'wallet', title: 'Wallet send preview', detail: 'Non-routable send flow; no blockchain or money movement.', enabled: true },
  { id: 'signups', title: 'Demo profile registration', detail: 'Managed sign-in for demo access; no financial account is created.', enabled: true },
];

const auditEntries = [
  { time: '09:41', title: 'Sample market data refreshed', detail: 'Fixed illustrative dataset · no external provider', Icon: Activity },
  { time: '09:18', title: 'Demo workflow checks passed', detail: 'UI preview only · no customer operations', Icon: ShieldCheck },
  { time: '08:52', title: 'Local demo storage available', detail: 'Browser simulation · no server ledger', Icon: Database },
];

export default function AdminPage() {
  const { t, locale } = useLanguage();
  const [controls, setControls] = useState(initialControls);

  const toggleControl = (id: string) => {
    setControls((current) => current.map((control) =>
      control.id === id ? { ...control, enabled: !control.enabled } : control,
    ));
  };

  return (
    <main className="page">
      <PageHead
        eyebrow="Admin preview"
        title="A fictional operations workspace."
        description="Explore how a control room could be organized. The metrics and switches below are sample UI state, not a live admin system."
        aside={<span className="admin-status"><i />{t('Demo systems ready')}</span>}
      />
      <div className="admin-notice">
        <strong>{t('Preview only — no administrative privileges')}</strong>
        <br />
        {t('This page is visible as a product concept. It contains no real customer records, financial controls, provider connections, or privileged operations. Switches change only this page in your browser.')}
      </div>

      <section className="admin-kpi-grid" aria-label={t('Fictional sample metrics')}>
        <article className="card admin-kpi">
          <div className="admin-kpi-label">{t('Sample profiles')}</div>
          <div className="admin-kpi-value">1,284</div>
          <div className="admin-kpi-note">{t('Illustrative count · not real users')}</div>
        </article>
        <article className="card admin-kpi">
          <div className="admin-kpi-label">{t('Demo portfolios')}</div>
          <div className="admin-kpi-value">{new Intl.NumberFormat(locale,{style:'currency',currency:'EUR',notation:'compact',maximumFractionDigits:2}).format(2480000)}</div>
          <div className="admin-kpi-note">{t('Fictional display value')}</div>
        </article>
        <article className="card admin-kpi">
          <div className="admin-kpi-label">{t('Demo actions today')}</div>
          <div className="admin-kpi-value">3,906</div>
          <div className="admin-kpi-note">{t('Illustrative event count')}</div>
        </article>
        <article className="card admin-kpi">
          <div className="admin-kpi-label">{t('External connections')}</div>
          <div className="admin-kpi-value">0</div>
          <div className="admin-kpi-note">{t('No market, payment, or chain provider')}</div>
        </article>
      </section>

      <section className="admin-content-grid">
        <div className="card card-pad">
          <div className="flex-between">
            <div>
              <div className="eyebrow">{t('Local demo controls')}</div>
              <h2 className="section-title">{t('Product feature previews')}</h2>
            </div>
            <ToggleLeft size={19} color="#728391" />
          </div>
          {controls.map((control) => (
            <div className="admin-flag-row" key={control.id}>
              <div>
                <strong>{t(control.title)}</strong>
                <p>{t(control.detail)}</p>
              </div>
              <button
                className={`switch ${control.enabled ? 'on' : ''}`}
                type="button"
                role="switch"
                aria-checked={control.enabled}
                aria-label={t(control.title)}
                onClick={() => toggleControl(control.id)}
              />
            </div>
          ))}
          <p className="hint" style={{ marginTop: 15 }}>
            {t('Switches are temporary browser state. Reloading restores the sample defaults.')}
          </p>
        </div>

        <div className="card card-pad">
          <div className="eyebrow">{t('Fictional activity log')}</div>
          <h2 className="section-title">{t('System events')}</h2>
          <p className="section-sub">{t('Curated sample events for the operations concept.')}</p>
          <div className="divider" />
          {auditEntries.map(({ time, title, detail, Icon }) => (
            <div className="admin-audit-item" key={title}>
              <i aria-hidden="true" />
              <div>
                <strong><Icon size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />{t(title)}</strong>
                <span>{t(detail)}</span>
              </div>
              <time>{time}</time>
            </div>
          ))}
          <div className="warning-note" style={{ marginTop: 16 }}>
            <LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {t('This log is fictional display content, not a security or audit record.')}
          </div>
        </div>
      </section>

      <section className="card card-pad" style={{ marginTop: 18 }}>
        <div className="flex-between" style={{ flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow">{t('Standalone product concept')}</div>
            <h2 className="section-title">{t('A connected demo workflow, not a financial backend.')}</h2>
            <p className="section-sub" style={{ maxWidth: 760, lineHeight: 1.65 }}>
              {t('The concept connects the public homepage, user dashboard, market explorer, wallet preview, activity journal, and this operations view. Authentication is for demo access; balances and actions are illustrative browser data.')}
            </p>
          </div>
          <ArrowUpRight size={20} color="#9a8154" />
        </div>
      </section>
    </main>
  );
}
