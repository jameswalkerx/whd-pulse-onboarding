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
    <label className="block mb-1">
      <span style={{ color: "#e0e0e0", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {children}
      </span>
      {sub && <span style={{ color: "#777", fontSize: "0.7rem", display: "block", marginTop: 2, textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>{sub}</span>}
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
      }}
      onFocus={(e) => (e.target.style.borderColor = "#00e676")}
      onBlur={(e) => (e.target.style.borderColor = "#333")}
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
    <div style={{ borderBottom: "1px solid #2a2a2a", paddingBottom: 8, marginBottom: 20, marginTop: 28 }}>
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
  const [facebookPageName, setFacebookPageName] = useState("");
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
      facebook_page_name: facebookPageName,
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

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAoCAYAAABuIqMUAAAHJElEQVR42u1Yf2xVZxl+3vc759xfvfQXZW7NNnp7QQOYGGnCpi4dwz+2MUWd3EXDzLKMLTFmDBaM0yy3dzjUsUnBdoYE/8C4ZGs3QwRlOhboZBp13fyDjWXQ28GwSqGlvW3vueee832vf9xbVgjQWqFK0jc5Ocl3vnPO877f+73P873ArM3arM3af2QCapa0BUnztQW8Y7U63xGhayDaQpCOceDcOPz8/fNPPvXJ8xyYxBFrZoCWQVJKnxsjEgC6of+nt1Fl5Bk4oVs4dv1ocqT1wWOgl5fKDrubyP/fgRchoIXOgS7lNAMwC06F5+vKygyF7TWABUERrGIVQvlKoIO7KeUvOrw5ufi9d3o7U5165sGXoiuNwz/7Mutg6CitfwOAgQhpeu4GMCdN4A9APMNifWDcU23ZqsdfBICGoWe+6NnhBzqXdK6BpBmUMVcfvHSopTjL3ejTyYGaG0zcboMTWqXhI+H9fC+KXmuW6PUscAjArRe+nux7us7MqXiQwvFNxuT3l0YX09WPPJXyuhvQAGDyz31BOXNXBeasD8BiJ3qPOOqeBq/9LTLBfgL3Bn7QTxAhy24kRbdootvZDtcBBDZwZy7nBUiMtH5TjBVueqhrV7dH/SZS0AAYRGRMXgNgckJNFuY1+d4/B9lRRRWq+oRgPK09GO0WWUVsKe2PqwhehJrRov51JhopxqO7KRS/g2DQ/cJtj4lvjgA+AwQIDEBUctEY7Z3+Rc3hgfWDS2rbBPpbxuT9Eh5RAFR57mWNr8Sm7KJMoObmPfLNHtGeGBR82KFPczSeEtEEiBA7TGwzWACw8t3Cju6mTB6EqhJYWCBYIJoySfE0UoMAYLWUmLExt31tYnDLyvcoU8zG17XK6Nj9pJUlMFob14eIMMdYfO9tFAtvEBwCtCFLVUKECDDTjRtPY1MKAOrHIgIACXGDXT1/b2Nu28MA0Fu14QWM5L9OWhkCWwQH4uZ33vTm6WXC1EWwDcFmBcXlUooZAb/0rXS0/I50AQYC4v7R5wN36Ptwwt9ODLWmEz0/rsxWr/81xoZXkZDLHCYp5H/TtTwTwEidQoUSP/93pYu9AGAAuUzxkumDlw5VukpqL3djbGEit3XXxCnHbvzeyZ7o2h/1hB/5DInZEwYqk7ItlK3cuI9GRleKDgJEnDoIiAM5rQuDm/SbZ249WrUhCwAkl0wbI4A9/WozgdabJW31ndA5Ne/6NQmvLZSl76QAIPnB03UyL/Y47Oifex54bS86P6bynuqNBxv+kblDReJViECCA4Objy/PFAAgKdtCx2idd5HqJUIUEJyQBCNHS4Pv0qVo5eKahAiNQ1tT0PxRT+26P40/ahzddifZke+asdF3qt3Yk931j+QTw1vvonjsd0ZLPwXFg6T5t9bA6H7NwqirfVK0u68n9uhuAFhw4of1Mre2RQf+L3vnPPrHRGH7S2RX3CtwfQOxiZVSiMF4ub86Z3J3v1//xOAEqTGVyHcyAI14aC1xbEXCa/8LtLyC0WB3T8W6VwG8muzbsmjMP10JOVDM0vJ9DYPPfomra/bACqUASRUdyQHGt+3K2kAXugAgkdv6NR2JbWcrXC/u2V8BgBDFFceUgSgFggTeGVMc3ukeObMp25TJQ56gS23sSUhKhgRa4NjLCM4yY+c3NXjth9inF9F3quP9hZlceaW4l2hvYmDLN1BVtctwEWSrOQAjwIg+R56OWmlZtfUaQ0AwTqj6kNBIQbT3IQL5G065r2eTG/snZIBMK+cFpAggMUXfwCeyKMQIr4DDK0zDdVsSbtvv4ctL4YMtr+VP/qSeYhV3GgkUGTCgBYAmJguQstbxntL61Nuw+CtkAhcAeuc8tvni+j9lJiulU5UHTAQFI2LgGgFAlqpiK3Yfwua+wufnniBCNVnROGR0QqEbPwmxAMCHNRuPA2gH0I50+bwqaQYWUzPepa6DAG5v0SDSUwFlTSISDSAyYYBQWg3AaDEYM2CAbOcmwCAwI5rKIuz875TAQ3bYzegrccS4Pi/fu87NzkyZdyZJG0QJTAIEJCDQBF4oAVQQQCQwgBAxq5LLulxixQBgA1P+T590USa4UiL28iQVmMMSBIHiaIjYYZCICAJcSCxUjrY2moJgmDmqmMOKVNgmEMEPhsuHCsEVNLqsACPIwtPPfkrHIl+FTfeKxUsJYQiKEOObMruXos0E0lIIj8jnXMssIUc9DKIY5f0f9Gwd/ANaWuS/1TJTBz/+dMLvFgy3LdMOrRaLVrFlJ0sHZw/G6ICYLIYDx8X8I9GHjs9EU2Jy7SxpbgZ4Yq7efCAdVp+tXU4hKyUKd5EVuU5QBFxvpz3mbqiYW1XoRp8GZQykQ53X8phR8Bc4UjrSfezIosPpmuLN8+6GH3x0rGZd1+XX7v+kt3hOcV6suXTtNEml3CS91oDP2qzN2ozavwHlUUwtMOJqYgAAAABJRU5ErkJggg==" alt="WHD" style={{ height: 48 }} />
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

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
                  <Input type="number" value={invoiceDate} onChange={setInvoiceDate} placeholder="Day of month (1-28)" />
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Label sub="From Facebook Page > About > Page ID">Facebook Page ID</Label>
                <Input value={facebookPageId} onChange={setFacebookPageId} placeholder="e.g. 179020012222696" />
              </div>
              <div>
                <Label>Facebook Page Name</Label>
                <Input value={facebookPageName} onChange={setFacebookPageName} placeholder="e.g. Fair Dinkum Builds" />
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                ["Facebook Page Name", facebookPageName],
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
