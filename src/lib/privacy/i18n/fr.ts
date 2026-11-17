import type { LangPack } from "./types";

const MAIL = "info@we3vision.com";
const exercise = `Pour exercer un droit : écrivez à ${MAIL} avec l’objet « Privacy request ». Nous répondons dans le délai prévu par la loi de votre pays (30 jours au plus, sauf si la loi prévoit moins).`;

export const FR: LangPack = {
  code: "fr",
  label: "Français",
  ui: {
    legal: "Mentions légales",
    meta: "We3vision Private Limited · Version {v} · Dernière mise à jour {d}",
    placeholder: "Rechercher dans cette politique : données, cookies, RGPD, violation, suppression…",
    clear: "Effacer",
    count: "{t} sections",
    match: "{n} section(s) sur {t} correspondent à « {q} »",
    none: "Rien trouvé pour « {q} ». Essayez un autre mot.",
    contents: "Sommaire",
    laws: "Lois suivies par cette page",
    end: "Cette politique explique notre façon de travailler. Ce n’est pas un avis juridique. Pour un projet aux besoins juridiques particuliers, nous signons le contrat et l’accord de traitement des données que demande votre avocat.",
    tagsAria: "Politique de confidentialité par pays",
    langAria: "Langue",
    searchAria: "Rechercher dans cette politique de confidentialité",
    binding: "Ceci est une traduction pour faciliter la lecture. Le texte qui fait foi est la version anglaise.",
  },
  common: {
    who: {
      title: "Qui nous sommes et ce que couvre cette page",
      paras: [
        "We3vision Private Limited (« We3vision », « nous ») est une société de web, d’applications, d’IA, de métavers, d’UI/UX, de CRM, de SEO et de design de marque. Notre siège est à Surat, Gujarat, Inde, et nous avons un bureau à Marbourg, en Allemagne. Cette page explique comment nous traitons les données personnelles : celles des visiteurs de notre site, des personnes qui nous écrivent ou postulent, et des clients pour qui nous construisons et exploitons des projets.",
        "Une règle courte résume tout : nous ne collectons que ce dont nous avons besoin, nous l’utilisons uniquement pour le travail pour lequel il a été donné, nous le protégeons, nous ne le vendons pas, et nous le supprimons ou le rendons quand le travail est terminé.",
      ],
    },
    "how-we-work": {
      title: "Comment nous travaillons sur un projet client",
      paras: ["Chaque projet suit les mêmes étapes. À chaque étape, voici ce qui arrive aux données :"],
      list: [
        "1. Demande : vous nous écrivez (formulaire, e-mail, téléphone, chat). Nous gardons votre nom, vos coordonnées et votre demande, uniquement pour répondre et établir un devis.",
        "2. Accord : nous signons un contrat et, quand le projet traite des données personnelles de vos clients ou de votre personnel, un accord de traitement des données. Il dit ce que nous pouvons faire des données et pendant combien de temps.",
        "3. Conception et développement : notre équipe travaille avec vos exigences, vos contenus et, si besoin, des données de test. Nous demandons d’abord des données de test ou d’exemple. Les vraies données de clients ne sont utilisées que si le projet ne peut pas être testé sans elles et avec votre accord.",
        "4. Tests et mise en ligne : le projet tourne sur des serveurs que vous choisissez ou approuvez. L’accès de notre équipe est limité, nominatif et journalisé.",
        "5. Support et mises à jour : nous ne voyons vos données en production que lorsque vous demandez du support, et seulement autant que nécessaire pour résoudre le problème.",
        "6. Remise et fin : nous remettons le code, les contenus et les données, et supprimons nos copies (voir « Combien de temps nous gardons les données »).",
      ],
    },
    "data-we-collect": {
      title: "Quelles données nous collectons",
      list: [
        "Visiteurs du site : pages vues, type d’appareil et de navigateur, localisation approximative d’après l’adresse IP et les cookies décrits plus bas.",
        "Personnes qui nous écrivent : nom, e-mail, téléphone, entreprise, pays et message, depuis le formulaire de contact, le chat ou l’e-mail.",
        "Candidats : le CV, les coordonnées et ce que le candidat nous envoie.",
        "Clients : données de l’entreprise et de facturation, noms et coordonnées de l’équipe du client, fichiers du projet et comptes dont nous avons besoin pour y travailler.",
        "Données des clients ou du personnel d’un client, que celui-ci nous laisse traiter dans un projet (voir les deux sections suivantes). Nous ne collectons pas ces données pour nous-mêmes.",
      ],
      paras: [
        "Nous ne demandons pas de données sensibles (santé, religion, opinion politique, données biométriques, mots de passe de comptes privés) pour nos propres besoins. Si un projet en a besoin, le client nous le dit par écrit et des règles plus strictes s’appliquent.",
      ],
    },
    "client-data-store": {
      title: "Comment nous conservons les données d’un client",
      paras: ["Les données d’un client appartiennent au client. Nous les gardons ainsi :"],
      list: [
        "Où : sur les serveurs ou comptes du client si possible, sinon sur des serveurs de projet que le client approuve. Le lieu (pays) est écrit dans le contrat.",
        "Qui peut les ouvrir : uniquement des membres nommés de l’équipe projet, chacun avec un compte personnel. Pas de mots de passe partagés. Quand quelqu’un quitte le projet ou l’entreprise, l’accès est fermé aussitôt.",
        "Comment elles sont protégées : connexions chiffrées (HTTPS/TLS), mots de passe forts avec authentification à deux facteurs quand l’outil la propose, copies de travail séparées par client et mises à jour régulières des logiciels.",
        "Aucun lieu privé : les données du client ne sont pas gardées sur des téléphones privés, des messageries privées ou des clouds personnels.",
        "Sauvegardes : seulement là où le projet en a besoin, avec la même protection, et supprimées selon un calendrier.",
        "Registres : nous tenons un journal de qui a eu accès à quoi, et un plan écrit en cas de violation de données.",
      ],
    },
    "client-data-use": {
      title: "Où les données d’un client sont utilisées",
      paras: ["Les données d’un client ne sont utilisées qu’à ces endroits, et nulle part ailleurs :"],
      list: [
        "Pour construire et tester le projet commandé (site web, application, CRM, outil d’IA, boutique, monde VR/AR, design).",
        "Pour exploiter, héberger et assister le projet après la mise en ligne, quand le client le demande.",
        "Pour corriger une panne, trouver la cause d’un problème et améliorer la sécurité de ce projet.",
        "Pour respecter une obligation légale (par exemple quand un tribunal ou une autorité le demande de façon légale).",
        "Nous N’utilisons PAS les données d’un client pour entraîner nos propres modèles d’IA, faire notre publicité, les vendre à d’autres ou pour le projet d’un autre client. Si un outil d’IA du projet traite les données, nous n’utilisons que les outils approuvés par le client et il est informé de leur nom.",
      ],
    },
    "our-own-use": {
      title: "Où nos propres données (visiteurs, demandes, candidats) sont utilisées",
      list: [
        "Pour vous répondre et établir un devis.",
        "Pour exploiter, sécuriser et améliorer notre site (trouver des erreurs, arrêter le spam et les attaques, voir quelles pages sont utiles).",
        "Pour évaluer une candidature.",
        "Pour vous envoyer des nouvelles de notre travail, seulement si vous avez accepté, et avec un lien pour vous désabonner.",
        "Pour tenir la comptabilité, les impôts et les contrats exigés par la loi.",
      ],
    },
    sharing: {
      title: "Avec qui nous partageons les données",
      paras: [
        "Nous ne vendons pas de données personnelles. Nous les partageons seulement avec : les membres de notre équipe qui en ont besoin ; les prestataires qui travaillent pour nous par contrat (hébergement, e-mail, outils de projet, paiement, analyse) et ne peuvent les utiliser que pour nous ; le client pour le projet duquel nous les traitons ; et les autorités quand la loi l’exige.",
        "Un prestataire qui détient des données d’un client s’appelle un sous-traitant ultérieur. Nous prévenons le client avant d’en utiliser un et le contrat lui impose les mêmes devoirs qu’à nous. La liste est disponible sur demande.",
      ],
    },
    retention: {
      title: "Combien de temps nous gardons les données",
      list: [
        "Demandes qui ne deviennent pas un projet : jusqu’à 24 mois, puis supprimées.",
        "Candidatures : jusqu’à 12 mois après le pourvoi du poste, sauf accord du candidat pour une conservation plus longue.",
        "Contrats clients, factures et dossiers fiscaux : aussi longtemps que la loi du lieu l’exige (en Inde, en général 8 ans).",
        "Copies de travail du projet et données d’un client : supprimées ou rendues au client dans les 90 jours après la fin du projet ou plus tôt sur demande écrite du client. Les sauvegardes disparaissent dans les 30 jours suivants. Si le contrat dit autre chose, le contrat l’emporte.",
        "Journaux de serveur et du site : en général jusqu’à 12 mois.",
      ],
      paras: ["Nous ne gardons des données plus longtemps que si une loi l’exige ou pour une action en justice, et alors seulement la partie nécessaire."],
    },
    security: {
      title: "Sécurité et violation de données",
      paras: [
        "Nous protégeons les données par les mesures ci-dessus et nous les améliorons avec le temps. Aucun système n’est sûr à 100 %. Si nous constatons une violation qui touche vos données, nous prévenons le client sans délai (dans les 24 heures suivant la découverte) et donnons les faits dont il a besoin pour informer l’autorité et les personnes, comme l’exige la loi du pays.",
      ],
    },
    transfers: {
      title: "Données entre pays",
      paras: [
        "Notre équipe de développement travaille depuis l’Inde et nous avons un bureau en Allemagne. Les données d’un client peuvent donc être vues ou traitées en Inde ou en Allemagne, et sur les serveurs que le client approuve. Quand la loi du pays du client limite un tel transfert, nous utilisons l’outil que cette loi demande (par exemple des clauses contractuelles types) et nous l’indiquons sur la page du pays.",
      ],
    },
    cookies: {
      title: "Cookies",
      paras: [
        "Notre site utilise les cookies nécessaires à son fonctionnement (par exemple pour mémoriser vos choix). Là où la loi exige votre consentement pour d’autres cookies, nous demandons d’abord et vous pouvez changer d’avis à tout moment dans votre navigateur. Nous n’utilisons pas de cookies pour vendre des données.",
      ],
    },
    children: {
      title: "Enfants",
      paras: [
        "Notre site et nos services s’adressent aux entreprises, pas aux enfants. Nous ne collectons pas sciemment de données d’enfants de moins de 13 ans (ou de l’âge fixé par la loi de votre pays). Si le projet d’un client s’adresse à des enfants, le client doit obtenir le consentement des parents et nous intégrons les étapes au projet. Si vous pensez qu’un enfant nous a envoyé des données, écrivez-nous et nous les supprimons.",
      ],
    },
    changes: {
      title: "Modifications de cette politique",
      paras: [
        "Quand la loi ou notre façon de travailler change, nous mettons à jour cette page et la date en haut. Pour un changement important, nous prévenons nos clients par e-mail. Les versions antérieures sont disponibles sur demande.",
      ],
    },
    contact: {
      title: "Nous contacter",
      paras: [
        `We3vision Private Limited, Surat, Gujarat, Inde. E-mail : ${MAIL}. Téléphone : +91 7383216096. Notre bureau allemand est à Marbourg : voir l’adresse sur la page Contact. Écrivez « Privacy request » en objet. Si notre réponse ne vous satisfait pas, vous pouvez saisir l’autorité de protection des données de votre pays (nommée sur la page de votre pays).`,
      ],
    },
  },
  regions: {
    eu: {
      title: "Politique de confidentialité pour les clients de l’Union européenne",
      intro:
        "Le Règlement général sur la protection des données (RGPD) s’applique à un projet pour un client de tout pays de l’Union européenne ou de l’EEE, et à toute personne s’y trouvant dont nous traitons les données. Cette page dit ce que cela change à notre façon de travailler. (L’Allemagne a sa propre page pour les ajouts allemands.)",
      laws: [
        "Règlement (UE) 2016/679 (RGPD)",
        "Directive ePrivacy 2002/58/CE et lois nationales sur les cookies de chaque pays",
        "Clauses contractuelles types de la Commission européenne (décision 2021/914) pour les transferts vers des pays tiers",
        "Lois nationales de protection des données de chaque État membre",
      ],
      sections: {
        "eu-basis": {
          title: "Pourquoi nous pouvons utiliser des données (bases légales, article 6)",
          list: [
            "Contrat : pour répondre à votre demande, faire un devis et réaliser le travail commandé.",
            "Consentement : pour la lettre d’information, les cookies facultatifs et tout ce pour quoi nous demandons « êtes-vous d’accord ? ». Vous pouvez le retirer à tout moment.",
            "Intérêt légitime : pour garder notre site sûr, arrêter le spam et les abus, et gérer notre activité. Nous le mettons d’abord en balance avec vos droits.",
            "Obligation légale : pour les impôts, la comptabilité et lorsqu’une autorité nous le demande de façon légale.",
          ],
        },
        "eu-roles": {
          title: "Responsable de traitement et sous-traitant",
          paras: [
            "Pour notre propre site, les demandes, les candidatures et les contacts d’affaires, nous sommes responsable de traitement. Pour les données personnelles que les clients ou le personnel d’un client saisissent dans un projet que nous construisons ou exploitons pour lui, le client est responsable de traitement et nous sommes sous-traitant au titre de l’article 28. Nous signons un accord de traitement des données avec chaque client et tenons un registre des traitements (article 30).",
          ],
        },
        "eu-transfer": {
          title: "Transferts hors UE/EEE (chapitre V)",
          paras: [
            "Notre équipe en Inde n’a pas de décision d’adéquation de la Commission européenne. Quand l’équipe peut voir des données personnelles de l’UE, le transfert est couvert par les clauses contractuelles types (module 2 responsable vers sous-traitant, ou module 3 sous-traitant vers sous-traitant), une analyse d’impact du transfert écrite, et des mesures supplémentaires : chiffrement, accès limité et journalisé, et devoir de contester un ordre illégal d’une autorité. Notre bureau allemand de Marbourg fait partie du même groupe We3vision.",
          ],
        },
        "eu-subs": {
          title: "Sous-traitants ultérieurs",
          paras: [
            "Nous n’utilisons un sous-traitant ultérieur (par exemple un service d’hébergement ou d’e-mail) qu’avec l’accord du client, avec les mêmes devoirs par contrat que les nôtres, et nous prévenons le client à l’avance d’un changement pour qu’il puisse s’y opposer. La liste est envoyée sur demande.",
          ],
        },
        "eu-breach": {
          title: "Violation de données",
          paras: [
            "Nous prévenons le client sans délai et dans les 24 heures suivant la découverte d’une violation de ses données, afin qu’il informe l’autorité dans les 72 heures (article 33) et les personnes si le risque est élevé (article 34). Pour une violation de nos propres données de responsable de traitement, nous informons nous-mêmes l’autorité et les personnes.",
          ],
        },
        "eu-dpia": {
          title: "Protection dès la conception et analyses d’impact",
          paras: [
            "Nous construisons les projets avec minimisation des données et paramètres par défaut protecteurs (article 25). Si un projet présente probablement un risque élevé (profilage, données sensibles à grande échelle, IA qui décide pour des personnes), nous aidons le client à réaliser l’analyse d’impact (article 35) avant la mise en ligne.",
          ],
        },
        "eu-rights": {
          title: "Vos droits et réclamations",
          list: [
            "Accès, rectification, effacement, limitation, portabilité et opposition (articles 15 à 21).",
            "Retirer votre consentement pour l’avenir.",
            "Saisir l’autorité de contrôle du pays où vous vivez, travaillez ou où le problème est survenu.",
          ],
          note: exercise,
        },
      },
    },
    canada: {
      title: "Politique de confidentialité pour les clients canadiens",
      intro:
        "Le Canada a une loi fédérale pour les entreprises (LPRPDE / PIPEDA) et des lois plus strictes dans certaines provinces, surtout au Québec. Cette page dit aux clients canadiens ce que nous faisons pour un projet au Canada.",
      laws: [
        "Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE / PIPEDA)",
        "Québec : Loi sur la protection des renseignements personnels dans le secteur privé, modifiée par la Loi 25",
        "PIPA de l’Alberta et PIPA de la Colombie-Britannique",
        "Loi canadienne anti-pourriel (LCAP / CASL)",
      ],
      sections: {
        "ca-principles": {
          title: "Les 10 principes équitables de l’information (LPRPDE)",
          list: [
            "Responsabilité : une personne chez We3vision est responsable de la vie privée.",
            "Détermination des fins, consentement et limitation de la collecte : nous disons pourquoi nous avons besoin des données et ne collectons que cela.",
            "Limitation de l’utilisation, de la communication et de la conservation : nous les utilisons pour cette fin et les supprimons ensuite.",
            "Exactitude, mesures de sécurité et transparence : nous les gardons exactes, protégées, et vous disons comment nous les traitons.",
            "Accès aux renseignements personnels et possibilité de porter plainte : vous pouvez voir vos données et vous plaindre.",
          ],
        },
        "ca-quebec": {
          title: "Québec (Loi 25)",
          paras: [
            "Pour un projet qui traite des renseignements personnels de personnes au Québec, nous aidons le client avec : une évaluation des facteurs relatifs à la vie privée avant que des données sortent du Québec, une personne responsable de la protection des renseignements personnels, des paramètres de confidentialité les plus stricts par défaut, un avis lorsqu’une décision est prise uniquement par une machine, et un avis à la Commission d’accès à l’information en cas d’incident grave. Nous fournissons le texte français de l’avis de confidentialité et du consentement sur demande du client.",
          ],
        },
        "ca-transfer": {
          title: "Données traitées hors du Canada",
          paras: [
            "Notre équipe est en Inde. Le client reste responsable des données et informe ses clients qu’elles peuvent être traitées dans un autre pays. Nous les traitons par un contrat qui donne le même niveau de protection et nous informons le client de toute demande d’une autorité étrangère.",
          ],
        },
        "ca-breach": {
          title: "Atteinte aux mesures de sécurité",
          paras: [
            "Nous prévenons le client sans délai et dans les 24 heures suivant la découverte d’une atteinte, afin qu’il avise le Commissariat à la protection de la vie privée du Canada et informe les personnes lorsqu’il existe un risque réel de préjudice grave. Nous gardons un registre de toutes les atteintes pendant 24 mois.",
          ],
        },
        "ca-rights": {
          title: "Vos droits et plaintes",
          list: [
            "Voir vos renseignements personnels, demander une correction et retirer votre consentement (avec un préavis raisonnable).",
            "Vous plaindre à nous, puis au Commissariat à la protection de la vie privée du Canada (priv.gc.ca) ou à votre commissaire provincial.",
          ],
          note: exercise,
        },
      },
    },
  },
};
