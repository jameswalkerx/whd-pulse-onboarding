import { useState, useMemo } from "react";

const STEPS = ["Client & Services", "Platform Details", "Budgets & Goals", "Team", "Review"];

const TIMEZONES = [
  "Australia/Sydney","Australia/Melbourne","Australia/Brisbane","Australia/Perth",
  "Australia/Adelaide","Australia/Hobart","Australia/Darwin","Pacific/Auckland","UTC",
];

const SERVICES = {
  ad_platforms: [
    { key: "meta_ads", label: "Meta Ads", idField: "meta_account_id", idLabel: "Meta Ad Account ID", idPlaceholder: "e.g. 444377223643024", idHelp: "Business Manager > Ad Accounts" },
    { key: "google_ads", label: "Google Ads", idField: "google_ads_customer_id", idLabel: "Google Ads Customer ID", idPlaceholder: "e.g. 2957841443", idHelp: "10-digit ID, no dashes" },
    { key: "tiktok_ads", label: "TikTok Ads", idField: "tiktok_advertiser_id", idLabel: "TikTok Advertiser ID", idPlaceholder: "e.g. 7052907678015766530", idHelp: "From TikTok Ads Manager" },
    { key: "linkedin_ads", label: "LinkedIn Ads", idField: "linkedin_ad_account_id", idLabel: "LinkedIn Ad Account ID", idPlaceholder: "e.g. 512345678", idHelp: "From LinkedIn Campaign Manager" },
    { key: "pinterest_ads", label: "Pinterest Ads", idField: "pinterest_ad_account_id", idLabel: "Pinterest Ad Account ID", idPlaceholder: "e.g. 549764811111", idHelp: "From Pinterest Ads Manager" },
    { key: "youtube_ads", label: "YouTube Ads", idField: "youtube_ads_customer_id", idLabel: "YouTube/Google Ads Customer ID", idPlaceholder: "e.g. 2957841443", idHelp: "Same as Google Ads if shared" },
  ],
  organic: [
    { key: "organic_social", label: "Organic Social" },
    { key: "tiktok_organic", label: "TikTok Organic" },
    { key: "organic_socials_shoot", label: "Organic Socials + Shoot" },
  ],
  recurring: [
    { key: "seo", label: "SEO" },
    { key: "email_marketing", label: "Email Marketing" },
    { key: "content_creation", label: "Content Creation" },
    { key: "marketing_advisory", label: "Marketing Advisory" },
    { key: "bvod", label: "BVOD" },
    { key: "attrakt", label: "Attrakt" },
    { key: "ambassadors", label: "Ambassadors" },
  ],
  one_off: [
    { key: "videoshoot", label: "Videoshoot" },
    { key: "landing_page", label: "Landing Page" },
    { key: "email_automation", label: "Email Automation" },
  ],
};

const ALL_SERVICES = [...SERVICES.ad_platforms, ...SERVICES.organic, ...SERVICES.recurring, ...SERVICES.one_off];

const GOAL_TYPES = ["Leads", "CPA", "ROAS", "MER", "Revenue"];
const SCALING_METRICS = ["CPA", "ROAS", "MER", "CPL"];

const TEAM_MEMBERS = {
  account_manager: ["Gigi Craig", "Eugenie Rident-Tiercelet"],
  performance_manager: ["James Walker", "Stewart Lucas", "Emma McEwan", "Patrick Du", "Jordan Routledge"],
  organic_social_manager: ["Kayla Sylvester", "Miller Kerta", "Natarsja Lopez", "Taylor"],
  creative_specialist: ["Jordan Routledge"],
  graphic_designer: ["Deanna Agosta", "Tom Norman"],
  videographer: ["Tiana Lazzaroni", "Stackd"],
  editor: ["Tiana Lazzaroni", "Kenny Rimba"],
};

const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAADICAYAAADvG90JAAAvF0lEQVR42u2deXyU1dXHf+fe55nJvrKHHRJCQLGyVK11iAsq1r0zWtfXvm9Fa6tt3TcmA7jv1bZqF2ttq2ZsLe4LAmOxVhS1SAIEERD2EEhIZpKZee497x9PAkHRJhBkEu738/Ef4iQzz9zfPeeeexbAYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwHNRwUPjmBS0wyDwMgyH1IT9Xyvb/4OOghWBQmEdjMKQilX4Jcg1sSfjKQ8cuum1amf+IgrYf+7lSGgEbDKlCMCjQamWPGDgwveTD4KyRTb9qLOEnuXjrAxtKF8+YWXLzqcN2udGVEsw92oU25wNDSuObF7Qi5SEHAEa9ce1pGFd0u+6TP8ZBMxiOQ/BYEh7Qtu075Lb4E3rBqkdrLnl8Wds5GBTSRrgGwzfpFp/7nIJmFP/6kuFyatlMNSj3PCUEtI47BJYgImhmllAEy5JIA3Y0tlBt9A/0jwXBmmte2opKv0QgrIxwDYb9CTMBYQEKKD8gq5bf/eNkn7SZnJeT6yCqSTEgSOzhdcyAgpCWhQyIuvrV/O7qc1ac+sDCnmh5LbNSDCnlFhM5ANSY164tXzK2311OUcFEB3GwalIkSEJ8ha0hIgIsaMUOdjiiMGeoPHLIG6VPXjFpGSpWgNGjxGsicIYUsLJBAWaKlIec0lln9i9ZeedjCd+wuYmivIlJHVVQDpMg2TEfkohI2FpFk1xYkMtHDrgbROzHmB7lXRpX2XAABQvyISgj5AafihcGL8XIghDn5/RzEGNSzHt0izuCZoa0Ieqj2/jSV0asCs9pAINA4L00billrY2rbDhAoq2UoICKIOSMeeHqiYnxRXfxgLxyhSRYRx0CWRC094aFAICJBVmxrBbPXv4G/s6F/oFpOWnRt371VF3bvxlX2XDwEQwKMAtQQB1y+Sn5pTW33xs/dvg7ekBeuYOYgkoyEVld4AtqgkfLaGLVpicWbAVzp6ytv9IvwEzJE4u+lZgyOMfdbDhlHqMRruEbO5b5OGghFNIg0sX/rvhBc+iEj1TxgKudTLKVjClikvtkZdsbdEHaghDWqsb7AbBvfoXszOvD/jIGEccOLTil6ZC8lAtqGVfZcPDBTEBYQEKKD8gq5bf/eNkn7SZnJeT6yCqSTEgSOzhdcyAgpCWhQyI";

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function Label({ children, sub, required }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <span style={{ color: "#e0e0e0", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {children}
        {required && <span style={{ color: "#00e676", marginLeft: 4 }}>*</span>}
      </span>
      {sub && <span style={{ color: "#777", fontSize: "0.7rem", display: "block", marginTop: 3, textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>{sub}</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text", required, ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      style={{
        width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #333",
        borderRadius: 8, color: "#fff", fontSize: "0.95rem", outline: "none",
        transition: "border-color 0.2s", boxSizing: "border-box",
        MozAppearance: "textfield", WebkitAppearance: "none",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#00e676")}
      onBlur={(e) => (e.target.style.borderColor = "#333")}
      {...props}
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "10px 14px", background: "#1a1a1a",
          border: `1px solid ${open ? "#00e676" : "#333"}`, borderRadius: 8,
          color: value ? "#fff" : "#666", fontSize: "0.95rem", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box",
        }}
      >
        <span>{value || placeholder || "Select..."}</span>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="#666" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M8 11L3 6h10z" />
        </svg>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, zIndex: 50, maxHeight: 200, overflowY: "auto", padding: 4 }}>
          {options.map((o) => (
            <div
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              style={{
                padding: "8px 12px", borderRadius: 6, cursor: "pointer", fontSize: "0.9rem",
                color: value === o ? "#000" : "#ccc",
                background: value === o ? "#00e676" : "transparent",
                fontWeight: value === o ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (value !== o) { e.target.style.background = "rgba(0,230,118,0.15)"; e.target.style.color = "#fff"; } }}
              onMouseLeave={(e) => { if (value !== o) { e.target.style.background = "transparent"; e.target.style.color = "#ccc"; } }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
      {open && <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />}
    </div>
  );
}

function FieldRow({ children }) {
  const count = Array.isArray(children) ? children.filter(Boolean).length : 1;
  return <div style={{ display: "grid", gridTemplateColumns: count > 2 ? "1fr 1fr 1fr" : count === 2 ? "1fr 1fr" : "1fr", gap: 16, alignItems: "start" }}>{children}</div>;
}

function SectionHeader({ children }) {
  return (
    <div style={{ borderBottom: "1px solid #2a2a2a", paddingBottom: 8, marginBottom: 24, marginTop: 32 }}>
      <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "#00e676", letterSpacing: "0.08em", textTransform: "uppercase" }}>{children}</h3>
    </div>
  );
}

function ServiceToggle({ label, enabled, onToggle, badge }) {
  return (
    <div onClick={onToggle} style={{
      padding: "12px 16px", borderRadius: 8, border: `1px solid ${enabled ? "#00e676" : "#2a2a2a"}`,
      background: enabled ? "rgba(0,230,118,0.06)" : "#111", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 4, border: `2px solid ${enabled ? "#00e676" : "#444"}`,
        background: enabled ? "#00e676" : "transparent", display: "flex", alignItems: "center",
        justifyContent: "center", transition: "all 0.2s", flexShrink: 0,
      }}>
        {enabled && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span style={{ fontWeight: 500, fontSize: "0.9rem", color: enabled ? "#fff" : "#888" }}>{label}</span>
      {badge && <span style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "2px 8px", borderRadius: 10, background: "#222", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{badge}</span>}
    </div>
  );
}

function ReviewSection({ title, items }) {
  const filtered = items.filter(([, v]) => v);
  if (filtered.length === 0) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#00e676", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{title}</div>
      <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 14 }}>
        {filtered.map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #222" }}>
            <span style={{ color: "#888", fontSize: "0.85rem" }}>{label}</span>
            <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientOnboardingForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const webhookUrl = "https://w-h-d.app.n8n.cloud/webhook/client-onboard";

  const [clientName, setClientName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [timezone, setTimezone] = useState("Australia/Sydney");
  const [dateStarted, setDateStarted] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [enabledServices, setEnabledServices] = useState({});
  const [serviceFees, setServiceFees] = useState({});

  const [platformIds, setPlatformIds] = useState({});
  const [ga4PropertyId, setGa4PropertyId] = useState("");
  const [shopifyDomain, setShopifyDomain] = useState("");
  const [facebookPageId, setFacebookPageId] = useState("");
  const [instagramAccountId, setInstagramAccountId] = useState("");

  const [adBudgets, setAdBudgets] = useState({});
  const [goalType, setGoalType] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [scalingMetric, setScalingMetric] = useState("");
  const [scalingThreshold, setScalingThreshold] = useState("");
  const [profitMarginPct, setProfitMarginPct] = useState("");
  const [avgDealValue, setAvgDealValue] = useState("");
  const [avgDealCloseDays, setAvgDealCloseDays] = useState("");

  const [teamAm, setTeamAm] = useState("");
  const [teamPms, setTeamPms] = useState({});
  const [teamOsm, setTeamOsm] = useState("");
  const [teamCreative, setTeamCreative] = useState("");
  const [teamDesigner, setTeamDesigner] = useState("");
  const [teamVideographer, setTeamVideographer] = useState("");
  const [teamEditor, setTeamEditor] = useState("");
  const [reportContacts, setReportContacts] = useState([{ name: "", email: "" }]);

  const clientId = useMemo(() => slugify(clientName), [clientName]);
  const activeServices = ALL_SERVICES.filter(s => enabledServices[s.key]);
  const activeAdPlatforms = SERVICES.ad_platforms.filter(s => enabledServices[s.key]);
  const hasAdPlatforms = activeAdPlatforms.length > 0;
  const isLeadGen = businessType === "Lead Gen";
  const isEcom = businessType === "Ecom";
  const hasOrganic = enabledServices["organic_social"] || enabledServices["tiktok_organic"] || enabledServices["organic_socials_shoot"];
  const oneOffKeys = SERVICES.one_off.map(s => s.key);
  const monthlyFees = activeServices.filter(s => !oneOffKeys.includes(s.key)).reduce((sum, s) => sum + (parseFloat(serviceFees[s.key]) || 0), 0);
  const projectFees = activeServices.filter(s => oneOffKeys.includes(s.key)).reduce((sum, s) => sum + (parseFloat(serviceFees[s.key]) || 0), 0);

  const toggleService = (key) => setEnabledServices(prev => ({ ...prev, [key]: !prev[key] }));
  const setServiceFee = (key, val) => setServiceFees(prev => ({ ...prev, [key]: val }));
  const setPlatformId = (field, val) => setPlatformIds(prev => ({ ...prev, [field]: val }));
  const setAdBudget = (key, val) => setAdBudgets(prev => ({ ...prev, [key]: val }));
  const setTeamPm = (platform, val) => setTeamPms(prev => ({ ...prev, [platform]: val }));

  function canProceed() {
    if (step === 0) return clientName.trim() && businessType && dateStarted && salesPerson && invoiceDate && activeServices.length > 0;
    if (step === 3) return teamAm;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    const payload = {
      client_name: clientName.trim(), client_id: clientId,
      business_type: businessType === "Lead Gen" ? "lead_gen" : "ecom",
      website_url: websiteUrl, timezone, date_started: dateStarted,
      sales_person: salesPerson, recurring_invoice_date: parseInt(invoiceDate) || 0,
      services: activeServices.map(s => ({ key: s.key, label: s.label, management_fee: parseFloat(serviceFees[s.key]) || 0 })),
      total_monthly_fee: monthlyFees, total_project_fee: projectFees, platform_ids: platformIds,
      ga4_property_id: ga4PropertyId, shopify_store_domain: shopifyDomain,
      facebook_page_id: facebookPageId, instagram_account_id: instagramAccountId,
      budgets: Object.fromEntries(activeAdPlatforms.map(p => [p.key, parseFloat(adBudgets[p.key]) || 0])),
      goal_type: goalType, goal_target: parseFloat(goalTarget) || 0,
      scaling_metric: scalingMetric, scaling_threshold: parseFloat(scalingThreshold) || 0,
      profit_margin_pct: parseFloat(profitMarginPct) || 0,
      avg_deal_value: parseFloat(avgDealValue) || 0, avg_deal_close_days: parseInt(avgDealCloseDays) || 0,
      team: { account_manager: teamAm, performance_managers: teamPms, organic_social_manager: teamOsm,
        creative_specialist: teamCreative, graphic_designer: teamDesigner,
        videographer: teamVideographer, editor: teamEditor },
      report_contacts: reportContacts.filter(c => c.name || c.email),
    };
    try {
      const res = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
    } catch (err) {
      setError(`Submission failed: ${err.message}`);
      console.log("PAYLOAD:", JSON.stringify(payload, null, 2));
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#00e676", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 style={{ color: "#fff", margin: "0 0 8px", fontSize: "1.5rem" }}>Client Onboarded</h2>
          <p style={{ color: "#888", margin: "0 0 24px" }}>{clientName} ({clientId}) has been submitted.</p>
          <button onClick={() => window.location.reload()} style={{ padding: "10px 28px", background: "#00e676", color: "#000", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Onboard Another Client</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } input[type=number] { -moz-appearance: textfield; }`}</style>

      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 24px", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={LOGO} alt="WHD" style={{ height: 48 }} />
          <span style={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: "0.2em" }}>PULSE</span>
          <span style={{ color: "#444", fontSize: "0.75rem", marginLeft: 2, paddingLeft: 12, borderLeft: "1px solid #333" }}>Client Onboarding</span>
        </div>
      </div>

      <div style={{ padding: "24px 24px 0", maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 3, borderRadius: 2, background: i <= step ? "#00e676" : "#222", transition: "background 0.3s", marginBottom: 8 }} />
              <span style={{ fontSize: "0.7rem", fontWeight: i === step ? 700 : 400, color: i <= step ? "#00e676" : "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 120px" }}>

        {step === 0 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Client Details & Services</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Basic client info and which services they are on.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <Label required>Client Name</Label>
                <Input value={clientName} onChange={setClientName} placeholder="e.g. SWAG Boxers" required />
                {clientId && <div style={{ marginTop: 6, fontSize: "0.75rem", color: "#555" }}>Client ID: <span style={{ color: "#00e676", fontFamily: "monospace" }}>{clientId}</span></div>}
              </div>
              <FieldRow>
                <div><Label required>Business Type</Label><Select value={businessType} onChange={setBusinessType} options={["Lead Gen", "Ecom"]} placeholder="Select type..." /></div>
                <div><Label>Timezone</Label><Select value={timezone} onChange={setTimezone} options={TIMEZONES} /></div>
              </FieldRow>
              <div><Label>Website URL</Label><Input value={websiteUrl} onChange={setWebsiteUrl} placeholder="https://www.example.com.au" /></div>
              <FieldRow>
                <div><Label required>Date Started</Label><Input type="date" value={dateStarted} onChange={setDateStarted} required /></div>
                <div><Label required>Sales Person</Label><Select value={salesPerson} onChange={setSalesPerson} options={["Lana Thomas", "Mark Munday"]} placeholder="Select..." /></div>
                <div><Label required>Recurring Invoice Date</Label><Input type="number" value={invoiceDate} onChange={setInvoiceDate} placeholder="Day of month (1-31)" required /></div>
              </FieldRow>
            </div>

            <SectionHeader>Services</SectionHeader>
            <p style={{ color: "#666", fontSize: "0.85rem", margin: "-12px 0 16px" }}>Select all services this client is on. A management fee is required for each.</p>

            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Ad Platforms</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {SERVICES.ad_platforms.map(s => <ServiceToggle key={s.key} label={s.label} enabled={!!enabledServices[s.key]} onToggle={() => toggleService(s.key)} />)}
            </div>

            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Organic</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {SERVICES.organic.map(s => <ServiceToggle key={s.key} label={s.label} enabled={!!enabledServices[s.key]} onToggle={() => toggleService(s.key)} />)}
            </div>

            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Other Recurring</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {SERVICES.recurring.map(s => <ServiceToggle key={s.key} label={s.label} enabled={!!enabledServices[s.key]} onToggle={() => toggleService(s.key)} />)}
            </div>

            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>One-off Projects</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {SERVICES.one_off.map(s => <ServiceToggle key={s.key} label={s.label} enabled={!!enabledServices[s.key]} onToggle={() => toggleService(s.key)} badge="Project" />)}
            </div>

            {activeServices.length > 0 && (
              <>
                <SectionHeader>Management Fees</SectionHeader>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {activeServices.map(s => (
                    <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "#ccc", fontSize: "0.9rem", minWidth: 200, fontWeight: 500 }}>{s.label}</span>
                      <div style={{ flex: 1, maxWidth: 200 }}>
                        <Input type="number" value={serviceFees[s.key] || ""} onChange={(v) => setServiceFee(s.key, v)} placeholder={SERVICES.one_off.some(o => o.key === s.key) ? "$ one-off" : "$ per month"} required />
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12, borderTop: "1px solid #2a2a2a" }}>
                    <span style={{ color: "#00e676", fontSize: "0.9rem", minWidth: 200, fontWeight: 700 }}>Total Monthly Recurring</span>
                    <span style={{ color: "#00e676", fontWeight: 700, fontSize: "1.1rem" }}>${monthlyFees.toLocaleString()}/mo</span>
                  </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Platform Details</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Account IDs and tracking for active platforms.</p>
            {activeAdPlatforms.length > 0 && (
              <>
                <SectionHeader>Ad Platform Account IDs</SectionHeader>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {activeAdPlatforms.map(p => (
                    <div key={p.key}><Label required sub={p.idHelp}>{p.idLabel}</Label><Input value={platformIds[p.idField] || ""} onChange={(v) => setPlatformId(p.idField, v)} placeholder={p.idPlaceholder} required /></div>
                  ))}
                </div>
              </>
            )}
            <SectionHeader>Analytics & Commerce</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div><Label sub="From GA4 Admin > Property Settings">GA4 Property ID</Label><Input value={ga4PropertyId} onChange={setGa4PropertyId} placeholder="e.g. 269420684" /></div>
              {isEcom && <div><Label sub="The .myshopify.com domain">Shopify Store Domain</Label><Input value={shopifyDomain} onChange={setShopifyDomain} placeholder="e.g. swag-boxers.myshopify.com" /></div>}
            </div>
            <SectionHeader>Organic Social</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div><Label sub="From Facebook Page > About > Page ID">Facebook Page ID</Label><Input value={facebookPageId} onChange={setFacebookPageId} placeholder="e.g. 179020012222696" /></div>
              <div><Label sub="From Instagram Professional Account settings">Instagram Account ID</Label><Input value={instagramAccountId} onChange={setInstagramAccountId} placeholder="e.g. 17841403606903299" /></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Budgets & Goals</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Monthly ad spend budgets and performance targets.</p>
            {hasAdPlatforms && (
              <>
                <SectionHeader>Monthly Ad Spend Budgets (AUD)</SectionHeader>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {activeAdPlatforms.map(p => (
                    <div key={p.key}><Label required>{p.label} Monthly Budget</Label><Input type="number" value={adBudgets[p.key] || ""} onChange={(v) => setAdBudget(p.key, v)} placeholder="e.g. 5000" required /></div>
                  ))}
                </div>
              </>
            )}
            <SectionHeader>Performance Goals</SectionHeader>
            <FieldRow>
              <div><Label required>Goal Type</Label><Select value={goalType} onChange={setGoalType} options={GOAL_TYPES} placeholder="Select goal..." /></div>
              <div><Label required>Goal Target</Label><Input type="number" value={goalTarget} onChange={setGoalTarget} placeholder="e.g. 50" required /></div>
            </FieldRow>
            <SectionHeader>Scaling Rules</SectionHeader>
            <FieldRow>
              <div><Label>Scaling Metric</Label><Select value={scalingMetric} onChange={setScalingMetric} options={SCALING_METRICS} placeholder="Select metric..." /></div>
              <div><Label>Scaling Threshold</Label><Input type="number" value={scalingThreshold} onChange={setScalingThreshold} placeholder="e.g. 3.5" /></div>
            </FieldRow>
            <SectionHeader>Commercial</SectionHeader>
            <div><Label>Profit Margin %</Label><Input type="number" value={profitMarginPct} onChange={setProfitMarginPct} placeholder="e.g. 20 (optional)" /></div>
            {isLeadGen && (
              <>
                <SectionHeader>Lead Gen Details</SectionHeader>
                <FieldRow>
                  <div><Label>Average Deal Value</Label><Input type="number" value={avgDealValue} onChange={setAvgDealValue} placeholder="e.g. 15000 (optional)" /></div>
                  <div><Label>Average Days to Close</Label><Input type="number" value={avgDealCloseDays} onChange={setAvgDealCloseDays} placeholder="e.g. 30 (optional)" /></div>
                </FieldRow>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Team Assignment</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Assign the WHD team members for this client.</p>
            <SectionHeader>Account Management</SectionHeader>
            <div><Label required>Account Manager</Label><Select value={teamAm} onChange={setTeamAm} options={TEAM_MEMBERS.account_manager} placeholder="Select AM..." /></div>
            {activeAdPlatforms.length > 0 && (
              <>
                <SectionHeader>Performance Managers (per platform)</SectionHeader>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {activeAdPlatforms.map(p => (
                    <div key={p.key}><Label required>{p.label} Performance Manager</Label><Select value={teamPms[p.key] || ""} onChange={(v) => setTeamPm(p.key, v)} options={TEAM_MEMBERS.performance_manager} placeholder={`Select ${p.label} PM...`} /></div>
                  ))}
                </div>
              </>
            )}
            {hasOrganic && <div style={{ marginTop: 20 }}><Label>Organic Social Manager</Label><Select value={teamOsm} onChange={setTeamOsm} options={TEAM_MEMBERS.organic_social_manager} placeholder="Select..." /></div>}
            <SectionHeader>Creative Team</SectionHeader>
            <FieldRow>
              <div><Label>Creative Specialist</Label><Select value={teamCreative} onChange={setTeamCreative} options={TEAM_MEMBERS.creative_specialist} placeholder="Select..." /></div>
              <div><Label>Graphic Designer</Label><Select value={teamDesigner} onChange={setTeamDesigner} options={TEAM_MEMBERS.graphic_designer} placeholder="Select..." /></div>
            </FieldRow>
            <div style={{ marginTop: 16 }}>
              <FieldRow>
                <div><Label>Videographer</Label><Select value={teamVideographer} onChange={setTeamVideographer} options={TEAM_MEMBERS.videographer} placeholder="Select..." /></div>
                <div><Label>Editor</Label><Select value={teamEditor} onChange={setTeamEditor} options={TEAM_MEMBERS.editor} placeholder="Select..." /></div>
              </FieldRow>
            </div>
            <SectionHeader>Report Delivery</SectionHeader>
            {reportContacts.map((c, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                {reportContacts.length > 1 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.75rem", color: "#555" }}>Contact {i + 1}</span>
                    <button onClick={() => setReportContacts(reportContacts.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#ff5252", fontSize: "0.75rem", cursor: "pointer" }}>Remove</button>
                  </div>
                )}
                <FieldRow>
                  <div><Label>Contact Name</Label><Input value={c.name} onChange={(v) => { const u = [...reportContacts]; u[i] = { ...u[i], name: v }; setReportContacts(u); }} placeholder="e.g. John Smith" /></div>
                  <div><Label>Contact Email</Label><Input value={c.email} onChange={(v) => { const u = [...reportContacts]; u[i] = { ...u[i], email: v }; setReportContacts(u); }} placeholder="e.g. john@client.com" /></div>
                </FieldRow>
              </div>
            ))}
            <button onClick={() => setReportContacts([...reportContacts, { name: "", email: "" }])} style={{ background: "none", border: "1px dashed #333", borderRadius: 8, color: "#00e676", padding: "8px 16px", fontSize: "0.8rem", cursor: "pointer", width: "100%", marginTop: 4 }}>+ Add Another Contact</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Review & Submit</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Check everything looks right before submitting.</p>
            <ReviewSection title="Client Details" items={[
              ["Client Name", clientName], ["Client ID", clientId], ["Business Type", businessType],
              ["Website", websiteUrl], ["Timezone", timezone], ["Date Started", dateStarted],
              ["Sales Person", salesPerson], ["Invoice Date", invoiceDate ? `${invoiceDate} of month` : ""],
            ]} />
            <ReviewSection title="Services & Fees" items={[
              ...activeServices.map(s => [s.label, serviceFees[s.key] ? `$${Number(serviceFees[s.key]).toLocaleString()}${SERVICES.one_off.some(o => o.key === s.key) ? " one-off" : "/mo"}` : ""]),
              ["Total Monthly Recurring", `$${monthlyFees.toLocaleString()}/mo`],
            ]} />
            <ReviewSection title="Platform IDs" items={[
              ...activeAdPlatforms.map(p => [p.label, platformIds[p.idField] || ""]),
              ["GA4 Property ID", ga4PropertyId],
              ...(isEcom ? [["Shopify Domain", shopifyDomain]] : []),
              ["Facebook Page ID", facebookPageId], ["Instagram Account ID", instagramAccountId],
            ]} />
            {hasAdPlatforms && <ReviewSection title="Ad Spend Budgets" items={activeAdPlatforms.map(p => [p.label, adBudgets[p.key] ? `$${Number(adBudgets[p.key]).toLocaleString()}/mo` : ""])} />}
            <ReviewSection title="Goals & Commercial" items={[
              ["Goal", goalType && goalTarget ? `${goalType}: ${goalTarget}` : ""],
              ["Scaling", scalingMetric && scalingThreshold ? `${scalingMetric} at ${scalingThreshold}` : ""],
              ["Profit Margin", profitMarginPct ? `${profitMarginPct}%` : ""],
              ...(isLeadGen ? [["Avg Deal Value", avgDealValue ? `$${Number(avgDealValue).toLocaleString()}` : ""], ["Avg Days to Close", avgDealCloseDays]] : []),
            ]} />
            <ReviewSection title="Team" items={[
              ["Account Manager", teamAm],
              ...activeAdPlatforms.map(p => [`${p.label} PM`, teamPms[p.key] || ""]),
              ["Organic Social Manager", teamOsm], ["Creative Specialist", teamCreative],
              ["Graphic Designer", teamDesigner], ["Videographer", teamVideographer], ["Editor", teamEditor],
            ]} />
            <ReviewSection title="Report Delivery" items={reportContacts.filter(c => c.name || c.email).map((c, i) => [`Contact ${i + 1}`, `${c.name} (${c.email})`])} />
            {error && <div style={{ padding: 12, background: "rgba(255,82,82,0.1)", border: "1px solid #ff5252", borderRadius: 8, color: "#ff5252", fontSize: "0.85rem", marginTop: 16 }}>{error}</div>}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 24px", background: "linear-gradient(transparent, #0d0d0d 30%)", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 780, margin: "0 auto" }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: "10px 24px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: step === 0 ? "#333" : "#888", fontWeight: 600, fontSize: "0.9rem", cursor: step === 0 ? "default" : "pointer" }}>Back</button>
        <span style={{ color: "#444", fontSize: "0.8rem" }}>{step + 1} of {STEPS.length}</span>
        {step < STEPS.length - 1 ? (
          <button onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()} style={{ padding: "10px 28px", background: canProceed() ? "#00e676" : "#1a1a1a", border: "none", borderRadius: 8, color: canProceed() ? "#000" : "#444", fontWeight: 700, fontSize: "0.9rem", cursor: canProceed() ? "pointer" : "default", transition: "all 0.2s" }}>Continue</button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} style={{ padding: "10px 28px", background: submitting ? "#1a1a1a" : "#00e676", border: "none", borderRadius: 8, color: submitting ? "#444" : "#000", fontWeight: 700, fontSize: "0.9rem", cursor: submitting ? "default" : "pointer", transition: "all 0.2s" }}>{submitting ? "Submitting..." : "Submit & Onboard"}</button>
        )}
      </div>
    </div>
  );
}
