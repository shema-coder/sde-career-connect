import { useMemo, useState } from "react";
import "./URApplicationSupport.css";
import {
  UR_APPLICATION_STEPS,
  UR_CURRENT_INTAKE,
  UR_DOCUMENTS,
  UR_GENERAL_REQUIREMENTS,
  UR_PROGRAMMES,
  UR_SOURCES,
  type URApplicantRoute,
  type URLanguage,
} from "../data/universities/urData";

const copy = {
  en: {
    support: "SDE APPLICATION SUPPORT",
    title: "University of Rwanda Application Support",
    subtitle:
      "SDE Career Connect helps you understand UR requirements, prepare your information and documents, explore programmes and navigate your application step by step.",
    sde:
      "SDE Career Connect will guide you through the application preparation process. We help you understand and prepare your application; the University of Rwanda remains responsible for admission decisions.",
    closed: "Latest undergraduate call is closed",
    current: "Latest published intake",
    programmeCount: "programmes",
    choices: "programme choices",
    start: "Check My UR Options",
    whatsapp: "Talk to SDE",
    language: "Language",
    profile: "Applicant route",
    qualification: "Qualification",
    programme: "Programme",
    documents: "Documents",
    review: "Review",
    chooseRoute: "Which application route describes you?",
    national: "Rwandan / NESA applicant",
    international: "International applicant",
    equivalence: "Rwandan applicant with equivalence",
    transfer: "Transfer applicant",
    tvet: "TVET applicant",
    chooseCombination: "Select your combination",
    search: "Search the UR programme catalogue...",
    all: "All programmes",
    compatible: "Combination appears compatible",
    notCompatible: "Combination not listed for this programme",
    historical: "Historical cutoff",
    noCutoff: "No historical cutoff loaded",
    requirements: "What you should prepare",
    official: "Official UR information",
    fee: "Application fee",
    feeText:
      "Rwandan and EAC applicants: RWF 5,000. Non-EAC applicants: RWF 6,000. The fee is non-refundable.",
    reference:
      "UR requires applicants to generate and keep a Reference Number and PIN before continuing.",
    next: "Continue",
    back: "Back",
    contact: "Continue with SDE Support",
    verify:
      "Requirements and cut-offs can change by academic year. Historical cut-offs are shown only as reference and are not guarantees of admission.",
    source: "Source",
  },
  rw: {
    support: "UBUFASHA BWA SDE MU GUSABA KWIGA",
    title: "Ubufasha bwa SDE mu Gusaba Kwiga muri University of Rwanda",
    subtitle:
      "SDE Career Connect igufasha kumva ibisabwa muri UR, gutegura amakuru n'inyandiko, kureba programmes no gukurikira application yawe intambwe ku yindi.",
    sde:
      "SDE Career Connect izagufasha gutegura application yawe. Turagufasha kumva no gutegura dosiye, ariko University of Rwanda ni yo ifata icyemezo cyo kukwakira.",
    closed: "Itangazo rya nyuma rya undergraduate ryarafunzwe",
    current: "Intake iheruka gutangazwa",
    programmeCount: "programmes",
    choices: "programmes ushobora guhitamo",
    start: "Reba amahitamo yanjye muri UR",
    whatsapp: "Ganira na SDE",
    language: "Ururimi",
    profile: "Ubwoko bwa application",
    qualification: "Qualification",
    programme: "Programme",
    documents: "Inyandiko",
    review: "Isuzuma",
    chooseRoute: "Ni iyihe nzira ikureba?",
    national: "Umunyarwanda / NESA",
    international: "Umunyeshuri mpuzamahanga",
    equivalence: "Umunyarwanda ufite equivalence",
    transfer: "Ushaka kwimukira muri UR",
    tvet: "Umunyeshuri wa TVET",
    chooseCombination: "Hitamo combination yawe",
    search: "Shakisha programme muri UR...",
    all: "Programmes zose",
    compatible: "Combination isa n'iyemerwa",
    notCompatible: "Combination ntabwo igaragara kuri iyi programme",
    historical: "Cut-off yo mu mateka",
    noCutoff: "Nta cut-off y'amateka yashyizwemo",
    requirements: "Ibyo ugomba gutegura",
    official: "Amakuru yemewe ya UR",
    fee: "Amafaranga yo gusaba",
    feeText:
      "Abanyarwanda na EAC: RWF 5,000. Abatari EAC: RWF 6,000. Aya mafaranga ntasubizwa.",
    reference:
      "UR isaba gutangira ukora Reference Number na PIN ukabibika neza.",
    next: "Komeza",
    back: "Subira inyuma",
    contact: "Komeza ubufasha bwa SDE",
    verify:
      "Ibisabwa na cut-offs bishobora guhinduka buri mwaka. Cut-offs z'amateka ziri hano ni izo kugereranya gusa kandi ntabwo ari garanti yo kwemererwa.",
    source: "Inkomoko",
  },
  fr: {
    support: "ACCOMPAGNEMENT SDE",
    title: "Accompagnement SDE pour la candidature à l'Université du Rwanda",
    subtitle:
      "SDE Career Connect vous aide à comprendre les conditions UR, préparer vos informations et documents, explorer les programmes et suivre votre candidature étape par étape.",
    sde:
      "SDE Career Connect vous accompagne dans la préparation de votre candidature. Nous vous aidons à comprendre et préparer votre dossier; l'Université du Rwanda reste responsable de la décision d'admission.",
    closed: "Le dernier appel undergraduate est fermé",
    current: "Dernière admission publiée",
    programmeCount: "programmes",
    choices: "choix de programmes",
    start: "Voir mes options UR",
    whatsapp: "Parler à SDE",
    language: "Langue",
    profile: "Type de candidature",
    qualification: "Qualification",
    programme: "Programme",
    documents: "Documents",
    review: "Vérification",
    chooseRoute: "Quelle voie vous correspond ?",
    national: "Candidat rwandais / NESA",
    international: "Candidat international",
    equivalence: "Rwandais avec équivalence",
    transfer: "Candidat en transfert",
    tvet: "Candidat TVET",
    chooseCombination: "Choisissez votre combinaison",
    search: "Rechercher dans le catalogue UR...",
    all: "Tous les programmes",
    compatible: "La combinaison semble compatible",
    notCompatible: "La combinaison n'est pas indiquée pour ce programme",
    historical: "Cut-off historique",
    noCutoff: "Aucun cut-off historique chargé",
    requirements: "Ce que vous devez préparer",
    official: "Informations officielles UR",
    fee: "Frais de candidature",
    feeText:
      "Candidats rwandais et EAC : 5 000 RWF. Candidats non-EAC : 6 000 RWF. Les frais sont non remboursables.",
    reference:
      "L'UR demande de générer et conserver un numéro de référence et un PIN avant de continuer.",
    next: "Continuer",
    back: "Retour",
    contact: "Continuer avec SDE",
    verify:
      "Les conditions et cut-offs peuvent changer chaque année. Les cut-offs historiques sont uniquement indicatifs et ne garantissent pas l'admission.",
    source: "Source",
  },
};

const routeOptions: {
  id: URApplicantRoute;
  icon: string;
  key: keyof typeof copy.en;
}[] = [
  { id: "national", icon: "🇷🇼", key: "national" },
  { id: "international", icon: "🌍", key: "international" },
  { id: "equivalence", icon: "📜", key: "equivalence" },
  { id: "transfer", icon: "🔄", key: "transfer" },
  { id: "tvet", icon: "🛠️", key: "tvet" },
];

export default function URApplicationSupport() {
  const [language, setLanguage] = useState<URLanguage>("en");
  const [step, setStep] = useState(1);
  const [route, setRoute] = useState<URApplicantRoute>("national");
  const [combination, setCombination] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const t = copy[language];

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return UR_PROGRAMMES.filter((program) => {
      if (!query) return true;
      return (
        program.name.toLowerCase().includes(query) ||
        program.code.toLowerCase().includes(query) ||
        program.college.toLowerCase().includes(query) ||
        program.combinations.some((item) =>
          item.toLowerCase().includes(query),
        )
      );
    });
  }, [search]);

  const selected = UR_PROGRAMMES.find((item) => item.id === selectedId);

  const documents = UR_DOCUMENTS.filter((document) =>
    document.requiredFor.includes(route),
  );

  return (
    <div className="ur-support-page">
      <header className="ur-header">
        <a className="ur-brand" href="/">
          <img
            src="/assets/universities/ur-logo.png"
            alt="University of Rwanda official logo"
          />
          <div>
            <strong>SDE CAREER CONNECT</strong>
            <span>University of Rwanda Application Support</span>
          </div>
        </a>

        <div className="ur-header-actions">
          <div className="language-switcher">
            <span>{t.language}</span>
            {(["en", "rw", "fr"] as URLanguage[]).map((item) => (
              <button
                type="button"
                key={item}
                className={language === item ? "active" : ""}
                onClick={() => setLanguage(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          <a href="/" className="ur-home-link">
            ← Home
          </a>
        </div>
      </header>

      <main>
        <section className="ur-hero">
          <div className="ur-hero-content">
            <span className="ur-kicker">● {t.support}</span>

            <h1>{t.title}</h1>

            <p className="ur-hero-subtitle">{t.subtitle}</p>

            <div className="sde-support-notice">
              <div className="notice-icon">🤝</div>
              <div>
                <strong>SDE Career Connect</strong>
                <p>{t.sde}</p>
              </div>
            </div>

            <div className="ur-hero-actions">
              <button
                className="ur-primary-button"
                type="button"
                onClick={() =>
                  document
                    .getElementById("ur-smart-guide")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t.start} →
              </button>

              <a
                className="ur-whatsapp-button"
                href="https://wa.me/250796371484?text=Hello%20SDE%20Career%20Connect%2C%20I%20need%20help%20with%20my%20University%20of%20Rwanda%20application."
                target="_blank"
                rel="noreferrer"
              >
                💬 {t.whatsapp}
              </a>
            </div>
          </div>

          <div className="ur-hero-side">
            <div className="ur-logo-card">
              <img
                src="/assets/universities/ur-logo.png"
                alt="University of Rwanda"
              />
              <strong>University of Rwanda</strong>
              <span>2026–2027 Undergraduate</span>
            </div>

            <div className="ur-intake-card">
              <span>{t.current}</span>
              <strong>{UR_CURRENT_INTAKE.academicYear}</strong>
              <b>
                {UR_CURRENT_INTAKE.programmeCount} {t.programmeCount}
              </b>
              <small>
                {UR_CURRENT_INTAKE.openingDate} →{" "}
                {UR_CURRENT_INTAKE.closingDate}
              </small>
              <em>● {t.closed}</em>
            </div>
          </div>
        </section>

        <section className="ur-guide" id="ur-smart-guide">
          <div className="ur-container">
            <div className="ur-section-heading">
              <span>01 — SDE SMART GUIDE</span>
              <h2>{t.profile}</h2>
              <p>{t.sde}</p>
            </div>

            <div className="ur-progress">
              {[
                t.profile,
                t.qualification,
                t.programme,
                t.documents,
                t.review,
              ].map((label, index) => (
                <div
                  className={`progress-item ${
                    step >= index + 1 ? "active" : ""
                  }`}
                  key={label}
                >
                  <span>{index + 1}</span>
                  <small>{label}</small>
                </div>
              ))}
            </div>

            <div className="ur-wizard-card">
              {step === 1 && (
                <div className="wizard-content">
                  <span className="wizard-kicker">STEP 1 / 5</span>
                  <h3>{t.chooseRoute}</h3>

                  <div className="choice-grid">
                    {routeOptions.map((option) => (
                      <button
                        type="button"
                        key={option.id}
                        className={`choice ${
                          route === option.id ? "active" : ""
                        }`}
                        onClick={() => setRoute(option.id)}
                      >
                        <span>{option.icon}</span>
                        <strong>{t[option.key]}</strong>
                      </button>
                    ))}
                  </div>

                  <button
                    className="wizard-next"
                    type="button"
                    onClick={() => setStep(2)}
                  >
                    {t.next} →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="wizard-content">
                  <span className="wizard-kicker">STEP 2 / 5</span>
                  <h3>{t.chooseCombination}</h3>

                  <div className="combination-grid">
                    {[
                      "PCB",
                      "MCB",
                      "BCG",
                      "PCM",
                      "MPC",
                      "MPG",
                      "MCE",
                      "MEG",
                      "HEG",
                      "HEL",
                      "LEG",
                      "HGL",
                      "LFK",
                      "LKF",
                      "LKK",
                      "EKK",
                      "EFK",
                    ].map((item) => (
                      <button
                        type="button"
                        key={item}
                        className={`combination ${
                          combination === item ? "active" : ""
                        }`}
                        onClick={() => setCombination(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="wizard-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setStep(1)}
                    >
                      ← {t.back}
                    </button>
                    <button
                      type="button"
                      className="wizard-next"
                      onClick={() => setStep(3)}
                    >
                      {t.next} →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="wizard-content wide">
                  <span className="wizard-kicker">STEP 3 / 5</span>
                  <h3>{t.programme}</h3>

                  <div className="programme-search">
                    <span>⌕</span>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t.search}
                    />
                  </div>

                  <div className="programme-count">
                    {filtered.length} {t.programmeCount}
                  </div>

                  <div className="program-list">
                    {filtered.map((program) => {
                      const isCompatible =
                        !combination ||
                        program.combinations.includes(combination);

                      return (
                        <button
                          type="button"
                          key={program.id}
                          className={`program-card ${
                            selectedId === program.id ? "selected" : ""
                          }`}
                          onClick={() => setSelectedId(program.id)}
                        >
                          <div className="program-card-top">
                            <span>{program.area}</span>
                            <b>{program.duration}</b>
                          </div>

                          <strong>{program.name}</strong>
                          <small>{program.code}</small>
                          <small>{program.college}</small>

                          <div className="program-tags">
                            {program.combinations
                              .slice(0, 6)
                              .map((item) => (
                                <em key={item}>{item}</em>
                              ))}
                          </div>

                          {combination && (
                            <div
                              className={`compatibility ${
                                isCompatible ? "yes" : "no"
                              }`}
                            >
                              {isCompatible ? "✓" : "!"}{" "}
                              {isCompatible
                                ? t.compatible
                                : t.notCompatible}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selected && (
                    <div className="programme-detail">
                      <div>
                        <span>{t.historical}</span>
                        <strong>
                          {selected.historicalCutoff
                            ? `${selected.historicalCutoff}%`
                            : t.noCutoff}
                        </strong>
                        {selected.historicalCutoffYear && (
                          <small>
                            Published historical criterion:{" "}
                            {selected.historicalCutoffYear}
                          </small>
                        )}
                      </div>

                      <div>
                        <span>{t.source}</span>
                        <a
                          href={selected.source}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Official UR source ↗
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="wizard-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setStep(2)}
                    >
                      ← {t.back}
                    </button>
                    <button
                      type="button"
                      className="wizard-next"
                      disabled={!selected}
                      onClick={() => setStep(4)}
                    >
                      {t.next} →
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="wizard-content wide">
                  <span className="wizard-kicker">STEP 4 / 5</span>
                  <h3>{t.requirements}</h3>

                  <div className="document-list">
                    {documents.map((document, index) => (
                      <div className="document-row" key={document.id}>
                        <span>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <strong>{document.name}</strong>
                          {document.explanation && (
                            <small>{document.explanation}</small>
                          )}
                        </div>
                        <i>Prepare</i>
                      </div>
                    ))}
                  </div>

                  <div className="fee-card">
                    <div className="fee-icon">💳</div>
                    <div>
                      <strong>{t.fee}</strong>
                      <p>{t.feeText}</p>
                    </div>
                  </div>

                  <div className="reference-card">
                    <span>🔐</span>
                    <div>
                      <strong>Reference Number + PIN</strong>
                      <p>{t.reference}</p>
                    </div>
                  </div>

                  <div className="wizard-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setStep(3)}
                    >
                      ← {t.back}
                    </button>
                    <button
                      type="button"
                      className="wizard-next"
                      onClick={() => setStep(5)}
                    >
                      {t.next} →
                    </button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="wizard-content wide">
                  <span className="wizard-kicker">STEP 5 / 5</span>
                  <h3>{t.review}</h3>

                  <div className="review-grid">
                    <div>
                      <span>{t.profile}</span>
                      <strong>
                        {routeOptions.find((item) => item.id === route)?.icon}{" "}
                        {t[
                          routeOptions.find((item) => item.id === route)
                            ?.key || "national"
                        ]}
                      </strong>
                    </div>

                    <div>
                      <span>{t.qualification}</span>
                      <strong>{combination || "Not selected"}</strong>
                    </div>

                    <div>
                      <span>{t.programme}</span>
                      <strong>{selected?.name || "Not selected"}</strong>
                    </div>
                  </div>

                  <div className="important-card">
                    <span>⚠️</span>
                    <p>{t.verify}</p>
                  </div>

                  <div className="official-links">
                    <a href={UR_SOURCES.admissions} target="_blank" rel="noreferrer">
                      UR Admissions ↗
                    </a>
                    <a href={UR_SOURCES.applicationGuide} target="_blank" rel="noreferrer">
                      Application Guide ↗
                    </a>
                    <a href={UR_SOURCES.currentCall} target="_blank" rel="noreferrer">
                      Latest Call ↗
                    </a>
                    <a
                      href={UR_SOURCES.historicalCutoffs}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Historical Criteria ↗
                    </a>
                  </div>

                  <a
                    className="wizard-next link-button"
                    href="https://wa.me/250796371484?text=Hello%20SDE%20Career%20Connect%2C%20I%20have%20checked%20my%20UR%20application%20options%20and%20need%20application%20support."
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.contact} →
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="ur-process">
          <div className="ur-container">
            <div className="ur-section-heading">
              <span>02 — APPLICATION ROADMAP</span>
              <h2>How the UR application works</h2>
            </div>

            <div className="process-grid">
              {UR_APPLICATION_STEPS.map((item, index) => (
                <article key={item.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ur-general">
          <div className="ur-container">
            <div className="ur-section-heading">
              <span>03 — APPLICATION ROUTES</span>
              <h2>Documents depend on your route</h2>
            </div>

            <div className="requirements-grid">
              {UR_GENERAL_REQUIREMENTS.map((item) => (
                <article key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul>
                    {item.documents.map((document) => (
                      <li key={document}>✓ {document}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ur-footer-cta">
          <div>
            <span>SDE CAREER CONNECT</span>
            <h2>Don't face the application process alone.</h2>
            <p>{t.sde}</p>
          </div>

          <a
            href="https://wa.me/250796371484?text=Hello%20SDE%20Career%20Connect%2C%20I%20need%20University%20of%20Rwanda%20application%20support."
            target="_blank"
            rel="noreferrer"
          >
            💬 {t.whatsapp}
          </a>
        </section>
      </main>
    </div>
  );
}
