import { useState, useMemo, useEffect } from "react";

const STEPS = ["Client Details", "Platforms", "Budgets & Goals", "Team", "Review"];

const TIMEZONES = [
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Perth",
  "Australia/Adelaide",
  "Australia/Hobart",
  "Australia/Darwin",
  "Pacific/Auckland",
  "UTC",
];

const GOAL_TYPES = ["Leads", "CPA", "ROAS", "MER", "Revenue"];
const SCALING_METRICS = ["CPA", "ROAS", "MER", "CPL"];
const PLATFORMS = ["meta", "google", "tiktok"];

// Replace with your real team. Later this will come from dim_team via API.
const TEAM_MEMBERS = {
  account_manager: ["Gigi Craig", "Eugenie Rident-Tiercelet"],
  performance_manager: ["James Walker", "Steph McGrath", "Stewart Lucas", "Emma McEwan"],
  organic_social_manager: ["Kayla Sylvester", "Miller Kerta", "Natarsja Lopez", "Taylor"],
  creative_specialist: ["Jordan Routledge"],
  graphic_designer: ["Deanna Agosta", "Tom Norman"],
  videographer: ["Tiana Lazzaroni"],
  editor: ["Tiana Lazzaroni", "Kenny Rimba"],
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function Label({ children, sub }) {
  return (
    <label className="block" style={{ marginBottom: 10 }}>
      <span style={{ color: "#e0e0e0", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {children}
      </span>
      {sub && <span style={{ color: "#777", fontSize: "0.7rem", display: "block", marginTop: 3, textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>{sub}</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text", ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "10px 14px",
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: 8,
        color: "#fff",
        fontSize: "0.95rem",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
        MozAppearance: "textfield",
        WebkitAppearance: "none",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#00e676")}
      onBlur={(e) => (e.target.style.borderColor = "#333")}
      autoComplete="off"
      {...props}
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useState(null);
  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "#1a1a1a",
          border: `1px solid ${open ? "#00e676" : "#333"}`,
          borderRadius: 8,
          color: value ? "#fff" : "#666",
          fontSize: "0.95rem",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
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
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.9rem",
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
  return (
    <div style={{ display: "grid", gridTemplateColumns: children.length > 2 ? "1fr 1fr 1fr" : "1fr 1fr", gap: 16 }}>
      {children}
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{ borderBottom: "1px solid #2a2a2a", paddingBottom: 8, marginBottom: 24, marginTop: 32 }}>
      <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "#00e676", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {children}
      </h3>
    </div>
  );
}

function PlatformToggle({ platform, label, enabled, onToggle, idValue, onIdChange, idLabel, idPlaceholder }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        border: `1px solid ${enabled ? "#00e676" : "#2a2a2a"}`,
        background: enabled ? "rgba(0,230,118,0.04)" : "#111",
        transition: "all 0.25s",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: enabled ? 12 : 0 }} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              border: `2px solid ${enabled ? "#00e676" : "#444"}`,
              background: enabled ? "#00e676" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {enabled && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontWeight: 600, fontSize: "1rem", color: enabled ? "#fff" : "#888" }}>{label}</span>
        </div>
      </div>
      {enabled && (
        <div style={{ marginTop: 4 }}>
          <Label sub={idLabel}>{platform} Account ID</Label>
          <Input value={idValue} onChange={onIdChange} placeholder={idPlaceholder} />
        </div>
      )}
    </div>
  );
}

function ReviewSection({ title, items }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#00e676", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 14 }}>
        {items.filter(([, v]) => v).map(([label, value]) => (
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

  // Webhook URL - update this with your n8n webhook URL
  const [webhookUrl, setWebhookUrl] = useState("");
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);

  // Step 1: Client Details
  const [clientName, setClientName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [timezone, setTimezone] = useState("Australia/Sydney");

  // Step 2: Platforms
  const [metaEnabled, setMetaEnabled] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [tiktokEnabled, setTiktokEnabled] = useState(false);
  const [metaAccountId, setMetaAccountId] = useState("");
  const [googleAdsCustomerId, setGoogleAdsCustomerId] = useState("");
  const [tiktokAdvertiserId, setTiktokAdvertiserId] = useState("");
  const [ga4PropertyId, setGa4PropertyId] = useState("");
  const [shopifyDomain, setShopifyDomain] = useState("");
  const [facebookPageId, setFacebookPageId] = useState("");
  const [instagramAccountId, setInstagramAccountId] = useState("");
  const [fbPageId, setFbPageId] = useState("");
  const [fbPageName, setFbPageName] = useState("");
  const [igAccountId, setIgAccountId] = useState("");
  const [tiktokAccountId, setTiktokAccountId] = useState("");

  // Step 3: Budgets & Goals
  const [metaBudget, setMetaBudget] = useState("");
  const [googleBudget, setGoogleBudget] = useState("");
  const [tiktokBudget, setTiktokBudget] = useState("");
  const [goalType, setGoalType] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [managementFee, setManagementFee] = useState("");
  const [profitMarginPct, setProfitMarginPct] = useState("");
  const [scalingMetric, setScalingMetric] = useState("");
  const [scalingThreshold, setScalingThreshold] = useState("");
  const [avgDealValue, setAvgDealValue] = useState("");
  const [avgDealCloseDays, setAvgDealCloseDays] = useState("");

  // Step 4: Team
  const [teamAm, setTeamAm] = useState("");
  const [teamPmMeta, setTeamPmMeta] = useState("");
  const [teamPmGoogle, setTeamPmGoogle] = useState("");
  const [teamPmTiktok, setTeamPmTiktok] = useState("");
  const [teamCreative, setTeamCreative] = useState("");
  const [teamOsm, setTeamOsm] = useState("");
  const [teamDesigner, setTeamDesigner] = useState("");
  const [teamVideographer, setTeamVideographer] = useState("");
  const [teamEditor, setTeamEditor] = useState("");
  const [reportContacts, setReportContacts] = useState([{ name: "", email: "" }]);

  const clientId = useMemo(() => slugify(clientName), [clientName]);
  const activePlatforms = useMemo(() => {
    const p = [];
    if (metaEnabled) p.push("meta");
    if (googleEnabled) p.push("google");
    if (tiktokEnabled) p.push("tiktok");
    return p;
  }, [metaEnabled, googleEnabled, tiktokEnabled]);

  const isLeadGen = businessType === "Lead Gen";
  const isEcom = businessType === "Ecom";

  function canProceed() {
    if (step === 0) return clientName.trim() && businessType;
    if (step === 1) return activePlatforms.length > 0;
    if (step === 2) return true;
    if (step === 3) return teamAm;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    const payload = {
      client_name: clientName.trim(),
      client_id: clientId,
      business_type: businessType === "Lead Gen" ? "lead_gen" : "ecom",
      website_url: websiteUrl,
      date_started: dateStarted,
      sales_person: salesPerson,
      recurring_invoice_date: parseInt(invoiceDate) || 0,
      timezone,
      meta_account_id: metaEnabled ? metaAccountId : "",
      google_ads_customer_id: googleEnabled ? googleAdsCustomerId : "",
      tiktok_advertiser_id: tiktokEnabled ? tiktokAdvertiserId : "",
      ga4_property_id: ga4PropertyId,
      shopify_store_domain: shopifyDomain,
      facebook_page_id: facebookPageId,
      instagram_account_id: instagramAccountId,
      budgets: {
        ...(metaEnabled && { meta: parseFloat(metaBudget) || 0 }),
        ...(googleEnabled && { google: parseFloat(googleBudget) || 0 }),
        ...(tiktokEnabled && { tiktok: parseFloat(tiktokBudget) || 0 }),
      },
      goal_type: goalType,
      goal_target: parseFloat(goalTarget) || 0,
      management_fee: parseFloat(managementFee) || 0,
      profit_margin_pct: parseFloat(profitMarginPct) || 0,
      scaling_metric: scalingMetric,
      scaling_threshold: parseFloat(scalingThreshold) || 0,
      avg_deal_value: parseFloat(avgDealValue) || 0,
      avg_deal_close_days: parseInt(avgDealCloseDays) || 0,
      team: {
        account_manager: teamAm,
        pm_meta: metaEnabled ? teamPmMeta : "",
        pm_google: googleEnabled ? teamPmGoogle : "",
        pm_tiktok: tiktokEnabled ? teamPmTiktok : "",
        creative_specialist: teamCreative,
        organic_social_manager: teamOsm,
        graphic_designer: teamDesigner,
        videographer: teamVideographer,
        editor: teamEditor,
      },
      report_contacts: reportContacts.filter(c => c.name || c.email),
    };

    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
      } catch (err) {
        setError(`Submission failed: ${err.message}. Data logged to console.`);
        console.log("ONBOARDING PAYLOAD:", JSON.stringify(payload, null, 2));
        setSubmitting(false);
        return;
      }
    } else {
      console.log("ONBOARDING PAYLOAD (no webhook configured):", JSON.stringify(payload, null, 2));
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ color: "#fff", margin: "0 0 8px", fontSize: "1.5rem" }}>Client Onboarded</h2>
          <p style={{ color: "#888", margin: "0 0 24px" }}>{clientName} ({clientId}) has been submitted for setup.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 28px", background: "#00e676", color: "#000", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}
          >
            Onboard Another Client
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } input[type=number] { -moz-appearance: textfield; }`}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="data:image/png;base64,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" alt="WHD" style={{ height: 48 }} />
          <span style={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: "0.2em" }}>PULSE</span>
          <span style={{ color: "#444", fontSize: "0.75rem", marginLeft: 2, paddingLeft: 12, borderLeft: "1px solid #333" }}>Client Onboarding</span>
        </div>
        <button
          onClick={() => setShowWebhookConfig(!showWebhookConfig)}
          style={{ background: "none", border: "1px solid #333", borderRadius: 6, color: "#888", padding: "6px 12px", fontSize: "0.75rem", cursor: "pointer" }}
        >
          {webhookUrl ? "Webhook Connected" : "Configure Webhook"}
        </button>
      </div>

      {showWebhookConfig && (
        <div style={{ padding: "12px 24px", background: "#111", borderBottom: "1px solid #1a1a1a" }}>
          <Label sub="Paste your n8n webhook URL here">Webhook URL</Label>
          <Input value={webhookUrl} onChange={setWebhookUrl} placeholder="https://your-n8n.app.n8n.cloud/webhook/..." />
        </div>
      )}

      {/* Progress */}
      <div style={{ padding: "24px 24px 0", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: i <= step ? "#00e676" : "#222",
                  transition: "background 0.3s",
                  marginBottom: 8,
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: i === step ? 700 : 400,
                  color: i <= step ? "#00e676" : "#555",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 100px" }}>
        {/* STEP 0: Client Details */}
        {step === 0 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Client Details</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Basic information about the client.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <Label>Client Name</Label>
                <Input value={clientName} onChange={setClientName} placeholder="e.g. SWAG Boxers" />
                {clientId && (
                  <div style={{ marginTop: 6, fontSize: "0.75rem", color: "#555" }}>
                    Client ID: <span style={{ color: "#00e676", fontFamily: "monospace" }}>{clientId}</span>
                  </div>
                )}
              </div>
              <FieldRow>
                <div>
                  <Label>Business Type</Label>
                  <Select value={businessType} onChange={setBusinessType} options={["Lead Gen", "Ecom"]} placeholder="Select type..." />
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select value={timezone} onChange={setTimezone} options={TIMEZONES} />
                </div>
              </FieldRow>
              <div>
                <Label>Website URL</Label>
                <Input value={websiteUrl} onChange={setWebsiteUrl} placeholder="https://www.example.com.au" />
              </div>
              <FieldRow>
                <div>
                  <Label>Date Started</Label>
                  <Input type="date" value={dateStarted} onChange={setDateStarted} />
                </div>
                <div>
                  <Label>Sales Person</Label>
                  <Select value={salesPerson} onChange={setSalesPerson} options={["Lana Thomas", "Mark Munday"]} placeholder="Select..." />
                </div>
                <div>
                  <Label>Recurring Invoice Date</Label>
                  <Input type="number" value={invoiceDate} onChange={setInvoiceDate} placeholder="Day of month (1-31)" />
                </div>
              </FieldRow>
            </div>
          </div>
        )}

        {/* STEP 1: Platforms */}
        {step === 1 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Platform Accounts</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Select the platforms this client runs and enter account IDs.</p>

            <SectionHeader>Ad Platforms</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <PlatformToggle
                platform="Meta"
                label="Meta Ads"
                enabled={metaEnabled}
                onToggle={() => setMetaEnabled(!metaEnabled)}
                idValue={metaAccountId}
                onIdChange={setMetaAccountId}
                idLabel="Found in Meta Business Manager"
                idPlaceholder="e.g. 444377223643024"
              />
              <PlatformToggle
                platform="Google"
                label="Google Ads"
                enabled={googleEnabled}
                onToggle={() => setGoogleEnabled(!googleEnabled)}
                idValue={googleAdsCustomerId}
                onIdChange={setGoogleAdsCustomerId}
                idLabel="10-digit customer ID (no dashes)"
                idPlaceholder="e.g. 2957841443"
              />
              <PlatformToggle
                platform="TikTok"
                label="TikTok Ads"
                enabled={tiktokEnabled}
                onToggle={() => setTiktokEnabled(!tiktokEnabled)}
                idValue={tiktokAdvertiserId}
                onIdChange={setTiktokAdvertiserId}
                idLabel="Advertiser ID from TikTok Ads Manager"
                idPlaceholder="e.g. 7052907678015766530"
              />
            </div>

            <SectionHeader>Analytics and Commerce</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <Label sub="From GA4 Admin > Property Settings">GA4 Property ID</Label>
                <Input value={ga4PropertyId} onChange={setGa4PropertyId} placeholder="e.g. 269420684" />
              </div>
              {isEcom && (
                <div>
                  <Label sub="The .myshopify.com domain">Shopify Store Domain</Label>
                  <Input value={shopifyDomain} onChange={setShopifyDomain} placeholder="e.g. swag-boxers.myshopify.com" />
                </div>
              )}
            </div>

            <SectionHeader>Organic Social</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <Label sub="From Facebook Page > About > Page ID">Facebook Page ID</Label>
                <Input value={facebookPageId} onChange={setFacebookPageId} placeholder="e.g. 179020012222696" />
              </div>
              <div>
                <Label sub="From Instagram Professional Account settings">Instagram Account ID</Label>
                <Input value={instagramAccountId} onChange={setInstagramAccountId} placeholder="e.g. 17841403606903299" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Budgets & Goals */}
        {step === 2 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Budgets and Goals</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Monthly approved budgets and performance targets.</p>

            <SectionHeader>Monthly Ad Spend Budgets (AUD)</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {metaEnabled && (
                <div>
                  <Label>Meta Monthly Budget</Label>
                  <Input type="number" value={metaBudget} onChange={setMetaBudget} placeholder="e.g. 5000" />
                </div>
              )}
              {googleEnabled && (
                <div>
                  <Label>Google Monthly Budget</Label>
                  <Input type="number" value={googleBudget} onChange={setGoogleBudget} placeholder="e.g. 3000" />
                </div>
              )}
              {tiktokEnabled && (
                <div>
                  <Label>TikTok Monthly Budget</Label>
                  <Input type="number" value={tiktokBudget} onChange={setTiktokBudget} placeholder="e.g. 2000" />
                </div>
              )}
            </div>

            <SectionHeader>Performance Goals</SectionHeader>
            <FieldRow>
              <div>
                <Label>Goal Type</Label>
                <Select value={goalType} onChange={setGoalType} options={GOAL_TYPES} placeholder="Select goal..." />
              </div>
              <div>
                <Label sub="Target number for the goal type">Goal Target</Label>
                <Input type="number" value={goalTarget} onChange={setGoalTarget} placeholder="e.g. 50" />
              </div>
            </FieldRow>

            <SectionHeader>Scaling Rules</SectionHeader>
            <FieldRow>
              <div>
                <Label>Scaling Metric</Label>
                <Select value={scalingMetric} onChange={setScalingMetric} options={SCALING_METRICS} placeholder="Select metric..." />
              </div>
              <div>
                <Label sub="Scale when metric hits this value">Scaling Threshold</Label>
                <Input type="number" value={scalingThreshold} onChange={setScalingThreshold} placeholder="e.g. 3.5" />
              </div>
            </FieldRow>

            <SectionHeader>Commercial</SectionHeader>
            <FieldRow>
              <div>
                <Label>Management Fee (AUD/month)</Label>
                <Input type="number" value={managementFee} onChange={setManagementFee} placeholder="e.g. 2500" />
              </div>
              <div>
                <Label>Profit Margin %</Label>
                <Input type="number" value={profitMarginPct} onChange={setProfitMarginPct} placeholder="e.g. 20" />
              </div>
            </FieldRow>

            {isLeadGen && (
              <>
                <SectionHeader>Lead Gen Details</SectionHeader>
                <FieldRow>
                  <div>
                    <Label>Average Deal Value (AUD)</Label>
                    <Input type="number" value={avgDealValue} onChange={setAvgDealValue} placeholder="e.g. 15000" />
                  </div>
                  <div>
                    <Label>Average Days to Close</Label>
                    <Input type="number" value={avgDealCloseDays} onChange={setAvgDealCloseDays} placeholder="e.g. 30" />
                  </div>
                </FieldRow>
              </>
            )}
          </div>
        )}

        {/* STEP 3: Team */}
        {step === 3 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Team Assignment</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Assign the WHD team members for this client.</p>

            <SectionHeader>Account Management</SectionHeader>
            <div style={{ marginBottom: 16 }}>
              <Label>Account Manager</Label>
              <Select value={teamAm} onChange={setTeamAm} options={TEAM_MEMBERS.account_manager} placeholder="Select AM..." />
            </div>

            <SectionHeader>Performance Managers (per platform)</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {metaEnabled && (
                <div>
                  <Label>Meta Performance Manager</Label>
                  <Select value={teamPmMeta} onChange={setTeamPmMeta} options={TEAM_MEMBERS.performance_manager} placeholder="Select Meta PM..." />
                </div>
              )}
              {googleEnabled && (
                <div>
                  <Label>Google Performance Manager</Label>
                  <Select value={teamPmGoogle} onChange={setTeamPmGoogle} options={TEAM_MEMBERS.performance_manager} placeholder="Select Google PM..." />
                </div>
              )}
              {tiktokEnabled && (
                <div>
                  <Label>TikTok Performance Manager</Label>
                  <Select value={teamPmTiktok} onChange={setTeamPmTiktok} options={TEAM_MEMBERS.performance_manager} placeholder="Select TikTok PM..." />
                </div>
              )}
              <div>
                <Label>Organic Social Manager</Label>
                <Select value={teamOsm} onChange={setTeamOsm} options={TEAM_MEMBERS.organic_social_manager} placeholder="Select..." />
              </div>
            </div>

            <SectionHeader>Creative Team</SectionHeader>
            <FieldRow>
              <div>
                <Label>Creative Specialist</Label>
                <Select value={teamCreative} onChange={setTeamCreative} options={TEAM_MEMBERS.creative_specialist} placeholder="Select..." />
              </div>
              <div>
                <Label>Graphic Designer</Label>
                <Select value={teamDesigner} onChange={setTeamDesigner} options={TEAM_MEMBERS.graphic_designer} placeholder="Select..." />
              </div>
            </FieldRow>
            <div style={{ marginTop: 16 }}>
              <FieldRow>
                <div>
                  <Label>Videographer</Label>
                  <Select value={teamVideographer} onChange={setTeamVideographer} options={TEAM_MEMBERS.videographer} placeholder="Select..." />
                </div>
                <div>
                  <Label>Editor</Label>
                  <Select value={teamEditor} onChange={setTeamEditor} options={TEAM_MEMBERS.editor} placeholder="Select..." />
                </div>
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
                  <div>
                    <Label>Contact Name</Label>
                    <Input value={c.name} onChange={(v) => { const u = [...reportContacts]; u[i] = { ...u[i], name: v }; setReportContacts(u); }} placeholder="e.g. John Smith" />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input value={c.email} onChange={(v) => { const u = [...reportContacts]; u[i] = { ...u[i], email: v }; setReportContacts(u); }} placeholder="e.g. john@client.com" />
                  </div>
                </FieldRow>
              </div>
            ))}
            <button
              onClick={() => setReportContacts([...reportContacts, { name: "", email: "" }])}
              style={{ background: "none", border: "1px dashed #333", borderRadius: 8, color: "#00e676", padding: "8px 16px", fontSize: "0.8rem", cursor: "pointer", width: "100%", marginTop: 4 }}
            >
              + Add Another Contact
            </button>
          </div>
        )}

        {/* STEP 4: Review */}
        {step === 4 && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "1.4rem" }}>Review and Submit</h2>
            <p style={{ color: "#666", margin: "0 0 28px", fontSize: "0.9rem" }}>Check everything looks right before submitting.</p>

            <ReviewSection
              title="Client Details"
              items={[
                ["Client Name", clientName],
                ["Client ID", clientId],
                ["Business Type", businessType],
                ["Website", websiteUrl],
                ["Timezone", timezone],
                ["Date Started", dateStarted],
                ["Sales Person", salesPerson],
                ["Invoice Date", invoiceDate ? `${invoiceDate}${["st","nd","rd"][((invoiceDate % 100) - 20) % 10] || ["st","nd","rd"][(invoiceDate % 100) - 1] || "th"} of month` : ""],
              ]}
            />

            <ReviewSection
              title="Platform Accounts"
              items={[
                metaEnabled && ["Meta Ad Account", metaAccountId],
                googleEnabled && ["Google Ads Customer ID", googleAdsCustomerId],
                tiktokEnabled && ["TikTok Advertiser ID", tiktokAdvertiserId],
                ["GA4 Property ID", ga4PropertyId],
                isEcom && ["Shopify Domain", shopifyDomain],
                ["Facebook Page ID", facebookPageId],
                ["Instagram Account ID", instagramAccountId],
              ].filter(Boolean)}
            />

            <ReviewSection
              title="Budgets and Goals"
              items={[
                metaEnabled && ["Meta Budget", metaBudget ? `$${Number(metaBudget).toLocaleString()}` : ""],
                googleEnabled && ["Google Budget", googleBudget ? `$${Number(googleBudget).toLocaleString()}` : ""],
                tiktokEnabled && ["TikTok Budget", tiktokBudget ? `$${Number(tiktokBudget).toLocaleString()}` : ""],
                ["Goal", goalType && goalTarget ? `${goalType}: ${goalTarget}` : ""],
                ["Scaling", scalingMetric && scalingThreshold ? `${scalingMetric} at ${scalingThreshold}` : ""],
                ["Management Fee", managementFee ? `$${Number(managementFee).toLocaleString()}/mo` : ""],
                ["Profit Margin", profitMarginPct ? `${profitMarginPct}%` : ""],
                isLeadGen && ["Avg Deal Value", avgDealValue ? `$${Number(avgDealValue).toLocaleString()}` : ""],
                isLeadGen && ["Avg Days to Close", avgDealCloseDays],
              ].filter(Boolean)}
            />

            <ReviewSection
              title="Team"
              items={[
                ["Account Manager", teamAm],
                metaEnabled && ["Meta PM", teamPmMeta],
                googleEnabled && ["Google PM", teamPmGoogle],
                tiktokEnabled && ["TikTok PM", teamPmTiktok],
                ["Creative Specialist", teamCreative],
                ["Organic Social Manager", teamOsm],
                ["Graphic Designer", teamDesigner],
                ["Videographer", teamVideographer],
                ["Editor", teamEditor],
              ].filter(Boolean)}
            />

            <ReviewSection
              title="Report Delivery"
              items={reportContacts.filter(c => c.name || c.email).map((c, i) => [`Contact ${i + 1}`, `${c.name} (${c.email})`])}
            />

            {error && (
              <div style={{ padding: 12, background: "rgba(255,82,82,0.1)", border: "1px solid #ff5252", borderRadius: 8, color: "#ff5252", fontSize: "0.85rem", marginTop: 16 }}>
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 24px",
          background: "linear-gradient(transparent, #0d0d0d 30%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{
            padding: "10px 24px",
            background: "transparent",
            border: "1px solid #333",
            borderRadius: 8,
            color: step === 0 ? "#333" : "#888",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: step === 0 ? "default" : "pointer",
          }}
        >
          Back
        </button>
        <span style={{ color: "#444", fontSize: "0.8rem" }}>
          {step + 1} of {STEPS.length}
        </span>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => canProceed() && setStep(step + 1)}
            disabled={!canProceed()}
            style={{
              padding: "10px 28px",
              background: canProceed() ? "#00e676" : "#1a1a1a",
              border: "none",
              borderRadius: 8,
              color: canProceed() ? "#000" : "#444",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: canProceed() ? "pointer" : "default",
              transition: "all 0.2s",
            }}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "10px 28px",
              background: submitting ? "#1a1a1a" : "#00e676",
              border: "none",
              borderRadius: 8,
              color: submitting ? "#444" : "#000",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: submitting ? "default" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {submitting ? "Submitting..." : "Submit and Onboard"}
          </button>
        )}
      </div>
    </div>
  );
}
