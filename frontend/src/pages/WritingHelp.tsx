import React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./WritingHelp.css";

type Language = "en" | "fr";

type ServiceId =
  | "cv"
  | "motivation"
  | "scholarship"
  | "application"
  | "academic"
  | "cover"
  | "email"
  | "personal"
  | "other";

type Question = {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
};

type Service = {
  id: ServiceId;
  icon: string;
  en: string;
  fr: string;
  questions: {
    en: Question[];
    fr: Question[];
  };
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const services: Service[] = [
  {
    id: "cv",
    icon: "📄",
    en: "CV / Resume",
    fr: "CV",
    questions: {
      en: [
        {
          id: "target",
          label: "What are you applying for?",
          placeholder: "Example: internship, scholarship, university, job...",
          required: true,
        },
        {
          id: "education",
          label: "Tell us about your education.",
          placeholder:
            "School, programme, level, graduation year, important subjects...",
          required: true,
          multiline: true,
        },
        {
          id: "experience",
          label: "Do you have work, volunteer or internship experience?",
          placeholder:
            "Tell us where you worked or volunteered and what you did.",
          multiline: true,
        },
        {
          id: "skills",
          label: "What skills do you have?",
          placeholder:
            "Example: communication, computer skills, leadership, languages...",
          multiline: true,
        },
        {
          id: "achievements",
          label: "What achievements should we highlight?",
          placeholder:
            "Awards, certificates, leadership roles, projects, competitions...",
          multiline: true,
        },
      ],
      fr: [
        {
          id: "target",
          label: "Pour quoi postulez-vous ?",
          placeholder:
            "Exemple : stage, bourse, université, emploi...",
          required: true,
        },
        {
          id: "education",
          label: "Parlez-nous de votre parcours scolaire.",
          placeholder:
            "École, programme, niveau, année de fin d'études, matières importantes...",
          required: true,
          multiline: true,
        },
        {
          id: "experience",
          label:
            "Avez-vous une expérience professionnelle, bénévole ou de stage ?",
          placeholder:
            "Indiquez où vous avez travaillé ou fait du bénévolat et ce que vous faisiez.",
          multiline: true,
        },
        {
          id: "skills",
          label: "Quelles compétences possédez-vous ?",
          placeholder:
            "Exemple : communication, informatique, leadership, langues...",
          multiline: true,
        },
        {
          id: "achievements",
          label: "Quelles réalisations devons-nous mettre en avant ?",
          placeholder:
            "Prix, certificats, responsabilités, projets, concours...",
          multiline: true,
        },
      ],
    },
  },
  {
    id: "motivation",
    icon: "💌",
    en: "Motivation Letter",
    fr: "Lettre de motivation",
    questions: {
      en: [
        {
          id: "opportunity",
          label: "What are you applying for?",
          placeholder: "University, scholarship, internship, programme...",
          required: true,
        },
        {
          id: "institution",
          label: "Which institution or organisation?",
          placeholder: "Name of university, company or organisation...",
          required: true,
        },
        {
          id: "why",
          label: "Why do you want this opportunity?",
          placeholder:
            "Explain your motivation and what attracts you to this opportunity.",
          required: true,
          multiline: true,
        },
        {
          id: "background",
          label: "What should we know about your background?",
          placeholder:
            "Education, experience, interests and important personal background...",
          required: true,
          multiline: true,
        },
        {
          id: "future",
          label: "What are your future goals?",
          placeholder:
            "Tell us what you hope to achieve and how this opportunity will help.",
          required: true,
          multiline: true,
        },
      ],
      fr: [
        {
          id: "opportunity",
          label: "Pour quoi postulez-vous ?",
          placeholder:
            "Université, bourse, stage, programme...",
          required: true,
        },
        {
          id: "institution",
          label: "Quelle institution ou organisation ?",
          placeholder:
            "Nom de l'université, de l'entreprise ou de l'organisation...",
          required: true,
        },
        {
          id: "why",
          label: "Pourquoi voulez-vous cette opportunité ?",
          placeholder:
            "Expliquez votre motivation et ce qui vous attire dans cette opportunité.",
          required: true,
          multiline: true,
        },
        {
          id: "background",
          label: "Que devons-nous savoir sur votre parcours ?",
          placeholder:
            "Études, expériences, intérêts et éléments importants de votre parcours...",
          required: true,
          multiline: true,
        },
        {
          id: "future",
          label: "Quels sont vos objectifs futurs ?",
          placeholder:
            "Expliquez ce que vous souhaitez accomplir et comment cette opportunité vous aidera.",
          required: true,
          multiline: true,
        },
      ],
    },
  },
  {
    id: "scholarship",
    icon: "🎓",
    en: "Scholarship Essay",
    fr: "Essai de bourse",
    questions: {
      en: [
        {
          id: "scholarship",
          label: "Which scholarship are you applying for?",
          placeholder: "Scholarship name or programme...",
          required: true,
        },
        {
          id: "background",
          label: "Tell us about yourself and your education.",
          placeholder:
            "Your school, programme, achievements and educational journey...",
          required: true,
          multiline: true,
        },
        {
          id: "need",
          label: "Why do you need this scholarship?",
          placeholder:
            "Explain your financial, educational or personal situation.",
          required: true,
          multiline: true,
        },
        {
          id: "impact",
          label: "What impact do you want to make?",
          placeholder:
            "How will your education help your community, country or field?",
          required: true,
          multiline: true,
        },
        {
          id: "goals",
          label: "What are your long-term goals?",
          placeholder:
            "Career, academic and community goals...",
          required: true,
          multiline: true,
        },
      ],
      fr: [
        {
          id: "scholarship",
          label: "Pour quelle bourse postulez-vous ?",
          placeholder: "Nom de la bourse ou du programme...",
          required: true,
        },
        {
          id: "background",
          label:
            "Parlez-nous de vous et de votre parcours scolaire.",
          placeholder:
            "Votre école, programme, réalisations et parcours éducatif...",
          required: true,
          multiline: true,
        },
        {
          id: "need",
          label: "Pourquoi avez-vous besoin de cette bourse ?",
          placeholder:
            "Expliquez votre situation financière, éducative ou personnelle.",
          required: true,
          multiline: true,
        },
        {
          id: "impact",
          label: "Quel impact souhaitez-vous avoir ?",
          placeholder:
            "Comment vos études aideront-elles votre communauté, votre pays ou votre domaine ?",
          required: true,
          multiline: true,
        },
        {
          id: "goals",
          label: "Quels sont vos objectifs à long terme ?",
          placeholder:
            "Objectifs professionnels, académiques et communautaires...",
          required: true,
          multiline: true,
        },
      ],
    },
  },
  {
    id: "application",
    icon: "📝",
    en: "Application Letter",
    fr: "Lettre de candidature",
    questions: {
      en: [
        {
          id: "position",
          label: "What are you applying for?",
          placeholder: "Position, programme, university or opportunity...",
          required: true,
        },
        {
          id: "organisation",
          label: "Who are you writing to?",
          placeholder:
            "University, company, organisation or admissions office...",
          required: true,
        },
        {
          id: "qualification",
          label: "Why are you qualified?",
          placeholder:
            "Education, skills, experience and achievements...",
          required: true,
          multiline: true,
        },
        {
          id: "motivation",
          label: "Why do you want this opportunity?",
          placeholder: "Explain your motivation...",
          required: true,
          multiline: true,
        },
      ],
      fr: [
        {
          id: "position",
          label: "Pour quoi postulez-vous ?",
          placeholder:
            "Poste, programme, université ou opportunité...",
          required: true,
        },
        {
          id: "organisation",
          label: "À qui écrivez-vous ?",
          placeholder:
            "Université, entreprise, organisation ou bureau d'admission...",
          required: true,
        },
        {
          id: "qualification",
          label: "Pourquoi êtes-vous qualifié(e) ?",
          placeholder:
            "Études, compétences, expérience et réalisations...",
          required: true,
          multiline: true,
        },
        {
          id: "motivation",
          label: "Pourquoi voulez-vous cette opportunité ?",
          placeholder: "Expliquez votre motivation...",
          required: true,
          multiline: true,
        },
      ],
    },
  },
  {
    id: "academic",
    icon: "📚",
    en: "Academic Essay",
    fr: "Essai académique",
    questions: {
      en: [
        {
          id: "topic",
          label: "What is the essay topic?",
          placeholder: "Paste or describe the topic/question...",
          required: true,
          multiline: true,
        },
        {
          id: "level",
          label: "What is your academic level?",
          placeholder: "Example: Year 1 university, S6, Master's...",
          required: true,
        },
        {
          id: "requirements",
          label: "What are the requirements?",
          placeholder:
            "Word count, referencing style, deadline, structure...",
          multiline: true,
        },
        {
          id: "ideas",
          label: "What ideas or sources do you already have?",
          placeholder:
            "Write anything you already know or want included.",
          multiline: true,
        },
      ],
      fr: [
        {
          id: "topic",
          label: "Quel est le sujet de l'essai ?",
          placeholder:
            "Copiez ou décrivez le sujet/la question...",
          required: true,
          multiline: true,
        },
        {
          id: "level",
          label: "Quel est votre niveau d'études ?",
          placeholder:
            "Exemple : Université Année 1, S6, Master...",
          required: true,
        },
        {
          id: "requirements",
          label: "Quelles sont les exigences ?",
          placeholder:
            "Nombre de mots, style de référence, date limite, structure...",
          multiline: true,
        },
        {
          id: "ideas",
          label:
            "Quelles idées ou sources avez-vous déjà ?",
          placeholder:
            "Écrivez ce que vous savez déjà ou ce que vous souhaitez inclure.",
          multiline: true,
        },
      ],
    },
  },
  {
    id: "cover",
    icon: "💼",
    en: "Cover Letter",
    fr: "Lettre de présentation",
    questions: {
      en: [
        {
          id: "job",
          label: "What position are you applying for?",
          placeholder: "Job title...",
          required: true,
        },
        {
          id: "company",
          label: "Which company or organisation?",
          placeholder: "Company/organisation name...",
          required: true,
        },
        {
          id: "experience",
          label: "What experience do you have?",
          placeholder:
            "Relevant education, work, internship or volunteer experience...",
          required: true,
          multiline: true,
        },
        {
          id: "skills",
          label: "What skills make you suitable?",
          placeholder:
            "Technical and soft skills...",
          required: true,
          multiline: true,
        },
      ],
      fr: [
        {
          id: "job",
          label: "Pour quel poste postulez-vous ?",
          placeholder: "Intitulé du poste...",
          required: true,
        },
        {
          id: "company",
          label: "Quelle entreprise ou organisation ?",
          placeholder: "Nom de l'entreprise/organisation...",
          required: true,
        },
        {
          id: "experience",
          label: "Quelle expérience avez-vous ?",
          placeholder:
            "Études, emploi, stage ou bénévolat pertinents...",
          required: true,
          multiline: true,
        },
        {
          id: "skills",
          label: "Quelles compétences vous rendent qualifié(e) ?",
          placeholder:
            "Compétences techniques et personnelles...",
          required: true,
          multiline: true,
        },
      ],
    },
  },
  {
    id: "email",
    icon: "✉️",
    en: "Professional Email",
    fr: "E-mail professionnel",
    questions: {
      en: [
        {
          id: "recipient",
          label: "Who are you emailing?",
          placeholder:
            "Example: admissions officer, employer, lecturer...",
          required: true,
        },
        {
          id: "purpose",
          label: "What is the purpose of the email?",
          placeholder:
            "Explain what you want to ask or communicate.",
          required: true,
          multiline: true,
        },
        {
          id: "context",
          label: "What context should we know?",
          placeholder:
            "Relevant details, dates, application number, situation...",
          multiline: true,
        },
      ],
      fr: [
        {
          id: "recipient",
          label: "À qui envoyez-vous l'e-mail ?",
          placeholder:
            "Exemple : responsable des admissions, employeur, enseignant...",
          required: true,
        },
        {
          id: "purpose",
          label: "Quel est l'objectif de l'e-mail ?",
          placeholder:
            "Expliquez ce que vous souhaitez demander ou communiquer.",
          required: true,
          multiline: true,
        },
        {
          id: "context",
          label: "Quel contexte devons-nous connaître ?",
          placeholder:
            "Détails pertinents, dates, numéro de candidature, situation...",
          multiline: true,
        },
      ],
    },
  },
  {
    id: "personal",
    icon: "🌟",
    en: "Personal Statement",
    fr: "Déclaration personnelle",
    questions: {
      en: [
        {
          id: "opportunity",
          label: "What are you applying for?",
          placeholder: "University, scholarship or programme...",
          required: true,
        },
        {
          id: "story",
          label: "Tell us your story.",
          placeholder:
            "Important experiences that shaped you...",
          required: true,
          multiline: true,
        },
        {
          id: "strengths",
          label: "What are your strengths and values?",
          placeholder:
            "Leadership, resilience, curiosity, service...",
          required: true,
          multiline: true,
        },
        {
          id: "future",
          label: "Where do you want to go in the future?",
          placeholder:
            "Your academic, professional and personal goals...",
          required: true,
          multiline: true,
        },
      ],
      fr: [
        {
          id: "opportunity",
          label: "Pour quoi postulez-vous ?",
          placeholder:
            "Université, bourse ou programme...",
          required: true,
        },
        {
          id: "story",
          label: "Racontez-nous votre histoire.",
          placeholder:
            "Expériences importantes qui vous ont façonné(e)...",
          required: true,
          multiline: true,
        },
        {
          id: "strengths",
          label: "Quelles sont vos forces et vos valeurs ?",
          placeholder:
            "Leadership, résilience, curiosité, service...",
          required: true,
          multiline: true,
        },
        {
          id: "future",
          label:
            "Où souhaitez-vous aller dans l'avenir ?",
          placeholder:
            "Vos objectifs académiques, professionnels et personnels...",
          required: true,
          multiline: true,
        },
      ],
    },
  },
  {
    id: "other",
    icon: "✨",
    en: "Other Writing Help",
    fr: "Autre aide à l'écriture",
    questions: {
      en: [
        {
          id: "document",
          label: "What document do you need help with?",
          placeholder:
            "Tell us what you need us to write or improve.",
          required: true,
          multiline: true,
        },
        {
          id: "purpose",
          label: "What will the document be used for?",
          placeholder:
            "University, scholarship, job, personal, academic...",
          required: true,
        },
        {
          id: "details",
          label: "Give us the important details.",
          placeholder:
            "Include instructions, deadline, recipient and anything else important.",
          required: true,
          multiline: true,
        },
      ],
      fr: [
        {
          id: "document",
          label:
            "Avec quel document avez-vous besoin d'aide ?",
          placeholder:
            "Dites-nous ce que vous voulez rédiger ou améliorer.",
          required: true,
          multiline: true,
        },
        {
          id: "purpose",
          label:
            "À quoi servira le document ?",
          placeholder:
            "Université, bourse, emploi, personnel, académique...",
          required: true,
        },
        {
          id: "details",
          label:
            "Donnez-nous les informations importantes.",
          placeholder:
            "Ajoutez les consignes, la date limite, le destinataire et tout autre détail important.",
          required: true,
          multiline: true,
        },
      ],
    },
  },
];

const text = {
  en: {
    badge: "SDE WRITING HELP",
    title: "Tell us what you need.",
    subtitle:
      "SDE Career Connect will guide you step by step to prepare a strong, clear and professional document.",
    language: "Language",
    english: "English",
    french: "Français",
    choose: "Choose what you need help with",
    chooseSub:
      "Select one service and we will ask you the right questions.",
    guided: "Guided step-by-step support",
    question: "Question",
    of: "of",
    back: "Back",
    next: "Continue",
    review: "Review Request",
    reviewSub:
      "Check your information before sending your request to SDE Career Connect.",
    edit: "Edit Answers",
    contact: "How can we reach you?",
    contactSub:
      "We need your name and at least one contact method so our team can respond.",
    fullName: "Full name",
    fullNamePlaceholder: "Your full name",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    phone: "Phone / WhatsApp",
    phonePlaceholder: "+250...",
    consent:
      "I agree that SDE Career Connect may use the information I provide to process and respond to this writing-help request.",
    submit: "Send Writing Help Request",
    sending: "Sending request...",
    required: "Please answer this question before continuing.",
    contactRequired:
      "Please provide your full name and either your email or phone number.",
    submitError:
      "We could not submit your request. Please check your connection and try again.",
    successBadge: "REQUEST RECEIVED",
    thank: "Thank You",
    trusted:
      "Thank you for trusting SDE Career Connect.",
    received:
      "Your writing-help request has been successfully received. Our team can now review your request and guide you through the next steps.",
    reference: "Your tracking reference",
    pin: "Your private tracking PIN",
    save:
      "Please save both of these details. You will need them to check your application progress.",
    track:
      "Track My Application",
    home: "Back to SDE Career Connect",
    another: "Submit Another Request",
    secure:
      "Your request is handled through the SDE Career Connect Application Support system.",
    service: "Service",
  },
  fr: {
    badge: "AIDE À LA RÉDACTION SDE",
    title: "Dites-nous ce dont vous avez besoin.",
    subtitle:
      "SDE Career Connect vous accompagne étape par étape pour préparer un document clair, professionnel et de qualité.",
    language: "Langue",
    english: "English",
    french: "Français",
    choose: "Choisissez le type d'aide dont vous avez besoin",
    chooseSub:
      "Sélectionnez un service et nous vous poserons les bonnes questions.",
    guided: "Accompagnement guidé étape par étape",
    question: "Question",
    of: "sur",
    back: "Retour",
    next: "Continuer",
    review: "Vérifier la demande",
    reviewSub:
      "Vérifiez vos informations avant d'envoyer votre demande à SDE Career Connect.",
    edit: "Modifier les réponses",
    contact: "Comment pouvons-nous vous contacter ?",
    contactSub:
      "Nous avons besoin de votre nom et d'au moins un moyen de contact.",
    fullName: "Nom complet",
    fullNamePlaceholder: "Votre nom complet",
    email: "Adresse e-mail",
    emailPlaceholder: "vous@example.com",
    phone: "Téléphone / WhatsApp",
    phonePlaceholder: "+250...",
    consent:
      "J'accepte que SDE Career Connect utilise les informations fournies pour traiter et répondre à cette demande d'aide à la rédaction.",
    submit: "Envoyer la demande",
    sending: "Envoi de la demande...",
    required:
      "Veuillez répondre à cette question avant de continuer.",
    contactRequired:
      "Veuillez indiquer votre nom complet et votre e-mail ou numéro de téléphone.",
    submitError:
      "Nous n'avons pas pu envoyer votre demande. Vérifiez votre connexion et réessayez.",
    successBadge: "DEMANDE REÇUE",
    thank: "Merci",
    trusted:
      "Merci de faire confiance à SDE Career Connect.",
    received:
      "Votre demande d'aide à la rédaction a bien été reçue. Notre équipe peut maintenant l'examiner et vous accompagner pour la suite.",
    reference: "Votre référence de suivi",
    pin: "Votre PIN privé de suivi",
    save:
      "Conservez soigneusement ces deux informations. Vous en aurez besoin pour suivre l'évolution de votre demande.",
    track:
      "Suivre ma demande",
    home: "Retour à SDE Career Connect",
    another: "Envoyer une autre demande",
    secure:
      "Votre demande est traitée par le système Application Support de SDE Career Connect.",
    service: "Service",
  },
};


/* SDE_WRITING_HELP_CELEBRATION */
const SDEWritingHelpCelebration = () => {
  const confetti = Array.from({ length: 48 }, (_, index) => ({
    id: index,
    x: ((index * 37) % 100),
    delay: ((index * 0.083) % 2.8).toFixed(2),
    duration: (3.2 + ((index * 17) % 25) / 10).toFixed(2),
    rotation: ((index * 47) % 360),
    size: 5 + ((index * 13) % 8),
  }));

  return (
    <div className="sde-writing-celebration" aria-hidden="true">
      <div className="sde-writing-confetti">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="sde-writing-confetti-piece"
            style={{
              "--confetti-x": `${piece.x}%`,
              "--confetti-delay": `${piece.delay}s`,
              "--confetti-duration": `${piece.duration}s`,
              "--confetti-rotation": `${piece.rotation}deg`,
              "--confetti-size": `${piece.size}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};


export default function WritingHelp() {

  // SDE smart copy buttons for post-submission tracking details.
  React.useEffect(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      ".sde-writing-copy-button"
    );

    const getValue = (target: string) => {
      if (target === "reference") {
        return document.querySelector("[data-smart-reference]")?.textContent?.trim() || "";
      }

      return document.querySelector("[data-smart-pin]")?.textContent?.trim() || "";
    };

    const handlers: Array<() => void> = [];

    buttons.forEach((button) => {
      const handler = async () => {
        const target = button.dataset.copyTarget || "";
        const value = getValue(target);

        if (!value || value.startsWith("Your ")) {
          return;
        }

        try {
          await navigator.clipboard.writeText(value);

          const original = button.textContent;
          button.textContent = "COPIED ✓";

          window.setTimeout(() => {
            button.textContent = original || "COPY";
          }, 1800);
        } catch {
          button.textContent = "COPY FAILED";
          window.setTimeout(() => {
            button.textContent = "COPY";
          }, 1800);
        }
      };

      button.addEventListener("click", handler);
      handlers.push(() => button.removeEventListener("click", handler));
    });

    return () => handlers.forEach((cleanup) => cleanup());
  }, []);


  const [language, setLanguage] = useState<Language>("en");
  const [selectedService, setSelectedService] =
    useState<Service | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    reference_code: string;
    tracking_pin: string;
  } | null>(null);

  const t = text[language];

  const questions = useMemo(() => {
    if (!selectedService) return [];
    return selectedService.questions[language];
  }, [selectedService, language]);

  const totalSteps = questions.length + 2;

  const currentQuestion = questions[step];

  const progress =
    selectedService && step < questions.length
      ? ((step + 1) / totalSteps) * 100
      : selectedService
        ? ((questions.length + (step >= questions.length ? 1 : 0)) /
            totalSteps) *
          100
        : 0;

  const selectService = (service: Service) => {
    setSelectedService(service);
    setStep(0);
    setAnswers({});
    setError("");
  };

  const changeLanguage = (next: Language) => {
    setLanguage(next);
    setError("");
  };

  const updateAnswer = (value: string) => {
    if (!currentQuestion) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
    setError("");
  };

  const nextStep = () => {
    if (!currentQuestion) {
      setStep(questions.length);
      return;
    }

    if (
      currentQuestion.required &&
      !answers[currentQuestion.id]?.trim()
    ) {
      setError(t.required);
      return;
    }

    setError("");
    setStep((previous) => previous + 1);
  };

  const previousStep = () => {
    setError("");

    if (step === 0) {
      setSelectedService(null);
      return;
    }

    setStep((previous) => previous - 1);
  };

  const submitRequest = async () => {
    if (!selectedService) return;

    if (!fullName.trim() || (!email.trim() && !phone.trim())) {
      setError(t.contactRequired);
      return;
    }

    if (!consent) {
      setError(
        language === "en"
          ? "Please accept the consent statement before submitting."
          : "Veuillez accepter le consentement avant d'envoyer la demande.",
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          request_type: "WRITING_HELP",
          service_type: selectedService.id,
          writing_answers: JSON.stringify({
            language,
            service_name:
              language === "en"
                ? selectedService.en
                : selectedService.fr,
            answers,
          }),
          institution: "",
          full_names: fullName.trim(),
          gender: "",
          province: "",
          district: "",
          sector: "",
          cell: "",
          village: "",
          index_number: "",
          national_id: "",
          email: email.trim(),
          phone: phone.trim(),
          date_of_birth: "",
          trade_option: "",
          disability: "",
          disability_details: "",
          refugee: "",
          faculty1: "",
          faculty2: "",
          faculty3: "",
          consent: true,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body?.detail || t.submitError,
        );
      }

      setSuccess({
        reference_code: body.reference_code,
        tracking_pin: body.tracking_pin,
      });
    } catch (submissionError) {
      console.error("Writing Help submission failed:", submissionError);

      const message =
        submissionError instanceof Error && submissionError.message
          ? submissionError.message
          : "";

      setError(
        message
          ? `${t.submitError} (${message})`
          : t.submitError,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSelectedService(null);
    setStep(0);
    setAnswers({});
    setFullName("");
    setEmail("");
    setPhone("");
    setConsent(false);
    setError("");
    setSuccess(null);
  };

  if (success) {
    return (
      <main className="writing-page">
        <div className="writing-background writing-background-one" />
        <div className="writing-background writing-background-two" />

        <header className="writing-topbar">
          <Link to="/" className="writing-brand">
            <img
              src="/assets/sde-logo-updated.png"
              alt="SDE Career Connect"
            />
            <span>
              <strong>SDE CAREER CONNECT</strong>
              <small>Connecting Students to Opportunities</small>
            </span>
          </Link>

          <LanguageSwitcher
            language={language}
            onChange={changeLanguage}
            label={t.language}
            english={t.english}
            french={t.french}
          />
        </header>

        <section className="writing-success">
          <div className="success-icon">✓</div>
          <span className="writing-badge">{t.successBadge}</span>

          <h1>
            {t.thank}, {fullName.toUpperCase()}!
          </h1>

          <p className="success-lead">{t.trusted}</p>

          <p className="success-copy">{t.received}</p>

          <div className="tracking-grid">
            <div className="tracking-card">
              <span>{t.reference}</span>
              <strong>{success.reference_code}</strong>
            </div>

            <div className="tracking-card tracking-pin-card">
              <span>{t.pin}</span>
              <strong>{success.tracking_pin}</strong>
            </div>
          </div>

          <div className="save-warning">
            <span>🔐</span>
            <p>{t.save}</p>
          </div>

          <div className="success-actions">
            <Link
              to="/"
              className="writing-secondary-button"
            >
              ← {t.home}
            </Link>

            <button
              type="button"
              className="writing-primary-button"
              onClick={() => {
                window.location.href = `/?track=1&reference=${encodeURIComponent(
                  success.reference_code,
                )}`;
              }}
            >
              {t.track} →
            </button>
          </div>

          <button
            type="button"
            className="another-request"
            onClick={reset}
          >
            + {t.another}
          </button>
        </section>
      
        <SDEWritingHelpCelebration />
</main>
    );
  }

  return (
    <main className="writing-page">
      <div className="writing-background writing-background-one" />
      <div className="writing-background writing-background-two" />

      <header className="writing-topbar">
        <Link to="/" className="writing-brand">
          <img
            src="/assets/sde-logo-updated.png"
            alt="SDE Career Connect"
          />
          <span>
            <strong>SDE CAREER CONNECT</strong>
            <small>Connecting Students to Opportunities</small>
          </span>
        </Link>

        <LanguageSwitcher
          language={language}
          onChange={changeLanguage}
          label={t.language}
          english={t.english}
          french={t.french}
        />
      </header>

      <section className="writing-hero">
        <div className="writing-hero-content">
          <span className="writing-badge">{t.badge}</span>

          <h1>{t.title}</h1>

          <p>{t.subtitle}</p>

          <div className="writing-trust-row">
            <span>✓ SDE Guided Support</span>
            <span>✓ Student Focused</span>
            <span>✓ Application Support</span>
          </div>
        </div>

        <div className="writing-hero-orbit">
          <div className="orbit-card orbit-card-main">
            <span>✍️</span>
            <strong>SDE</strong>
            <small>Writing Support</small>
          </div>
          <div className="orbit-dot orbit-dot-one">CV</div>
          <div className="orbit-dot orbit-dot-two">ESSAY</div>
          <div className="orbit-dot orbit-dot-three">LETTER</div>
        </div>
      </section>

      <section className="writing-shell">
        {!selectedService ? (
          <>
            <div className="section-heading">
              <span>{t.guided}</span>
              <h2>{t.choose}</h2>
              <p>{t.chooseSub}</p>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className="service-card"
                  onClick={() => selectService(service)}
                >
                  <span className="service-icon">
                    {service.icon}
                  </span>
                  <span className="service-name">
                    {language === "en"
                      ? service.en
                      : service.fr}
                  </span>
                  <span className="service-arrow">→</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="writing-workspace">
            <div className="writing-workspace-top">
              <button
                type="button"
                className="back-service"
                onClick={() => {
                  setSelectedService(null);
                  setStep(0);
                  setError("");
                }}
              >
                ← {t.back}
              </button>

              <div className="selected-service">
                <span>{selectedService.icon}</span>
                <strong>
                  {language === "en"
                    ? selectedService.en
                    : selectedService.fr}
                </strong>
              </div>
            </div>

            <div className="progress-area">
              <div className="progress-label">
                <span>
                  {step < questions.length
                    ? `${t.question} ${step + 1} ${t.of} ${questions.length}`
                    : step === questions.length
                      ? t.review
                      : t.contact}
                </span>
                <strong>{Math.round(progress)}%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {step < questions.length && currentQuestion && (
              <div className="question-card">
                <div className="question-number">
                  {String(step + 1).padStart(2, "0")}
                </div>

                <div className="question-content">
                  <h2>{currentQuestion.label}</h2>

                  {currentQuestion.multiline ? (
                    <textarea
                      value={answers[currentQuestion.id] || ""}
                      onChange={(event) =>
                        updateAnswer(event.target.value)
                      }
                      placeholder={currentQuestion.placeholder}
                      autoFocus
                      rows={7}
                    />
                  ) : (
                    <input
                      value={answers[currentQuestion.id] || ""}
                      onChange={(event) =>
                        updateAnswer(event.target.value)
                      }
                      placeholder={currentQuestion.placeholder}
                      autoFocus
                    />
                  )}

                  {error && (
                    <div className="writing-error">
                      ⚠ {error}
                    </div>
                  )}

                  <div className="question-actions">
                    <button
                      type="button"
                      className="writing-secondary-button"
                      onClick={previousStep}
                    >
                      ← {t.back}
                    </button>

                    <button
                      type="button"
                      className="writing-primary-button"
                      onClick={nextStep}
                    >
                      {t.next} →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === questions.length && (
              <div className="review-card">
                <div className="review-heading">
                  <span>✓</span>
                  <div>
                    <h2>{t.review}</h2>
                    <p>{t.reviewSub}</p>
                  </div>
                </div>

                <div className="review-list">
                  {questions.map((question, index) => (
                    <div
                      className="review-item"
                      key={question.id}
                    >
                      <div>
                        <small>
                          {String(index + 1).padStart(2, "0")}
                        </small>
                        <strong>{question.label}</strong>
                      </div>

                      <p>
                        {answers[question.id] ||
                          (language === "en"
                            ? "Not provided"
                            : "Non renseigné")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="review-actions">
                  <button
                    type="button"
                    className="writing-secondary-button"
                    onClick={() => setStep(Math.max(0, questions.length - 1))}
                  >
                    ← {t.edit}
                  </button>

                  <button
                    type="button"
                    className="writing-primary-button"
                    onClick={() => setStep(questions.length + 1)}
                  >
                    {t.next} →
                  </button>
                </div>
              </div>
            )}

            {step === questions.length + 1 && (
              <div className="contact-card">
                <div className="contact-heading">
                  <span>👋</span>
                  <div>
                    <h2>{t.contact}</h2>
                    <p>{t.contactSub}</p>
                  </div>
                </div>

                <div className="contact-form">
                  <label>
                    <span>{t.fullName} *</span>
                    <input
                      value={fullName}
                      onChange={(event) =>
                        setFullName(event.target.value)
                      }
                      placeholder={t.fullNamePlaceholder}
                    />
                  </label>

                  <label>
                    <span>{t.email}</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder={t.emailPlaceholder}
                    />
                  </label>

                  <label>
                    <span>{t.phone}</span>
                    <input
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder={t.phonePlaceholder}
                    />
                  </label>

                  <label className="consent-row">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) =>
                        setConsent(event.target.checked)
                      }
                    />
                    <span>{t.consent}</span>
                  </label>

                  {error && (
                    <div className="writing-error">
                      ⚠ {error}
                    </div>
                  )}

                  <div className="contact-actions">
                    <button
                      type="button"
                      className="writing-secondary-button"
                      onClick={() => setStep(questions.length)}
                    >
                      ← {t.back}
                    </button>

                    <button
                      type="button"
                      className="writing-primary-button submit-writing-button"
                      onClick={submitRequest}
                      disabled={submitting}
                    >
                      {submitting ? t.sending : t.submit}
                      {!submitting && " →"}
                    </button>
                  </div>
                </div>

                <div className="secure-note">
                  🔒 {t.secure}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="writing-footer">
        <strong>SDE CAREER CONNECT</strong>
        <span>Powered by STOREROOM DIGITAL EMPIRE</span>
      </footer>
    
        {/* SDE SMART POST-SUBMISSION PANEL */}
        <div className="sde-writing-smart-success-panel">

          <div className="sde-writing-register-action">
            <div>
              <span className="sde-writing-action-label">NEXT STEP</span>
              <strong>Complete your SDE student profile</strong>
              <small>Register with SDE Career Connect to stay connected to opportunities.</small>
            </div>

            <a
              href="/?register=1"
              className="sde-writing-register-button"
            >
              REGISTER NOW
              <span>→</span>
            </a>
          </div>

          <div className="sde-writing-tracking-card">

            <div className="sde-writing-tracking-header">
              <div className="sde-writing-lock">
                🔐
              </div>

              <div>
                <span>REQUEST SECURITY</span>
                <h3>Keep your request details</h3>
                <p>
                  Save your reference code and private PIN.
                  You will need them to track your request.
                </p>
              </div>
            </div>

            <div className="sde-writing-tracking-grid">

              <div className="sde-writing-code-box">
                <div className="sde-writing-code-label">
                  <span>REFERENCE CODE</span>
                  <button
                    type="button"
                    className="sde-writing-copy-button"
                    data-copy-target="reference"
                  >
                    COPY
                  </button>
                </div>

                <strong data-smart-reference>
                  Your reference code
                </strong>
              </div>

              <div className="sde-writing-code-box">
                <div className="sde-writing-code-label">
                  <span>PRIVATE TRACKING PIN</span>
                  <button
                    type="button"
                    className="sde-writing-copy-button"
                    data-copy-target="pin"
                  >
                    COPY
                  </button>
                </div>

                <strong data-smart-pin>
                  Your private PIN
                </strong>
              </div>

            </div>

            <div className="sde-writing-security-note">
              <span>✓</span>
              Keep these details private and store them somewhere safe.
            </div>
          </div>
        </div>

</main>
  );
}

function LanguageSwitcher({
  language,
  onChange,
  label,
  english,
  french,
}: {
  language: Language;
  onChange: (language: Language) => void;
  label: string;
  english: string;
  french: string;
}) {
  return (
    <div className="language-switcher">
      <span>{label}</span>

      <button
        type="button"
        className={language === "en" ? "active" : ""}
        onClick={() => onChange("en")}
      >
        🇬🇧 {english}
      </button>

      <button
        type="button"
        className={language === "fr" ? "active" : ""}
        onClick={() => onChange("fr")}
      >
        🇫🇷 {french}
      </button>
    </div>
  );
}
