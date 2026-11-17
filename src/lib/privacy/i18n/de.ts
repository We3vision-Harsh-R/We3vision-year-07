import type { LangPack } from "./types";

const MAIL = "info@we3vision.com";

export const DE: LangPack = {
  code: "de",
  label: "Deutsch",
  ui: {
    legal: "Rechtliches",
    meta: "We3vision Private Limited · Version {v} · Zuletzt aktualisiert {d}",
    placeholder: "Richtlinie durchsuchen: Daten, Cookies, DSGVO, Panne, Löschung …",
    clear: "Leeren",
    count: "{t} Abschnitte",
    match: "{n} von {t} Abschnitten passen zu „{q}“",
    none: "Nichts gefunden für „{q}“. Versuchen Sie ein anderes Wort.",
    contents: "Inhalt",
    laws: "Gesetze, denen diese Seite folgt",
    end: "Diese Richtlinie erklärt, wie wir arbeiten. Sie ist keine Rechtsberatung. Bei besonderen rechtlichen Anforderungen unterschreiben wir den Vertrag und die Auftragsverarbeitungsvereinbarung, die Ihr Anwalt verlangt.",
    tagsAria: "Datenschutzrichtlinie nach Land",
    langAria: "Sprache",
    searchAria: "Diese Datenschutzrichtlinie durchsuchen",
    binding: "Dies ist eine Übersetzung zum besseren Verständnis. Maßgeblich ist die englische Fassung.",
  },
  common: {
    who: {
      title: "Wer wir sind und was diese Seite umfasst",
      paras: [
        "Die We3vision Private Limited („We3vision“, „wir“) ist ein Unternehmen für Web, Apps, KI, Metaverse, UI/UX, CRM, SEO und Markendesign. Unser Hauptsitz ist in Surat, Gujarat, Indien; wir haben ein Büro in Marburg, Deutschland. Diese Seite erklärt, wie wir personenbezogene Daten behandeln: von Besuchern unserer Website, von Personen, die uns schreiben oder sich bewerben, und von Kunden, für die wir Projekte bauen und betreiben.",
        "Kurz gesagt: Wir erheben nur, was wir brauchen, nutzen es nur für die Arbeit, für die es gegeben wurde, schützen es, verkaufen es nicht und löschen oder geben es zurück, wenn die Arbeit beendet ist.",
      ],
    },
    "how-we-work": {
      title: "So arbeiten wir an einem Kundenprojekt",
      paras: ["Jedes Projekt durchläuft dieselben Schritte. In jedem Schritt passiert Folgendes mit Daten:"],
      list: [
        "1. Anfrage: Sie schreiben uns (Formular, E-Mail, Telefon, Chat). Wir speichern Name, Kontaktdaten und Ihre Anfrage nur, um zu antworten und ein Angebot zu erstellen.",
        "2. Vertrag: Wir unterschreiben einen Vertrag und, wenn das Projekt personenbezogene Daten Ihrer Kunden oder Mitarbeiter verarbeitet, einen Auftragsverarbeitungsvertrag. Er legt fest, was wir mit den Daten tun dürfen und wie lange.",
        "3. Entwurf und Entwicklung: Unser Team arbeitet mit Ihren Anforderungen, Inhalten und bei Bedarf Testdaten. Wir bitten zuerst um Test- oder Beispieldaten. Echte Kundendaten nutzen wir nur, wenn das Projekt ohne sie nicht getestet werden kann und Sie zugestimmt haben.",
        "4. Test und Livegang: Das Projekt läuft auf Servern, die Sie wählen oder genehmigen. Der Zugriff unseres Teams ist begrenzt, namentlich und protokolliert.",
        "5. Support und Updates: Wir sehen Ihre Live-Daten nur, wenn Sie um Support bitten, und nur so weit, wie zur Lösung nötig.",
        "6. Übergabe und Ende: Wir übergeben Code, Inhalte und Daten und löschen unsere Kopien (siehe „Wie lange wir Daten speichern“).",
      ],
    },
    "data-we-collect": {
      title: "Welche Daten wir erheben",
      list: [
        "Website-Besucher: besuchte Seiten, Gerät und Browsertyp, ungefährer Standort aus der IP-Adresse und die unten beschriebenen Cookies.",
        "Personen, die uns schreiben: Name, E-Mail, Telefonnummer, Unternehmen, Land und die Nachricht aus Kontaktformular, Chat oder E-Mail.",
        "Bewerber: Lebenslauf, Kontaktdaten und alles, was der Bewerber uns sendet.",
        "Kunden: Firmen- und Rechnungsdaten, Namen und Kontaktdaten des Kundenteams, Projektdateien und die Konten, die wir für das Projekt brauchen.",
        "Daten der Kunden oder Mitarbeiter eines Auftraggebers, die wir innerhalb eines Projekts verarbeiten dürfen (siehe die nächsten zwei Abschnitte). Diese Daten erheben wir nicht für uns selbst.",
      ],
      paras: [
        "Wir fragen für eigene Zwecke nicht nach sensiblen Daten (Gesundheit, Religion, politische Meinung, biometrische Daten, Passwörter privater Konten). Braucht ein Projekt sie, teilt der Kunde es uns schriftlich mit und es gelten strengere Regeln.",
      ],
    },
    "client-data-store": {
      title: "Wie wir die Daten eines Kunden speichern",
      paras: ["Die Daten eines Kunden gehören dem Kunden. Wir bewahren sie so auf:"],
      list: [
        "Wo: möglichst auf den eigenen Servern oder Konten des Kunden, sonst auf Projektservern, die der Kunde genehmigt. Der Ort (das Land) steht im Vertrag.",
        "Wer Zugriff hat: nur namentlich genannte Mitglieder des Projektteams, jeweils mit persönlichem Konto. Keine gemeinsamen Passwörter. Verlässt jemand das Projekt oder das Unternehmen, wird der Zugang sofort gesperrt.",
        "Wie geschützt: verschlüsselte Verbindungen (HTTPS/TLS), starke Passwörter mit Zwei-Faktor-Anmeldung, wo das Tool sie bietet, getrennte Arbeitskopien je Kunde und regelmäßige Software-Updates.",
        "Keine privaten Orte: Kundendaten liegen nicht auf privaten Handys, privaten E-Mail-Konten oder persönlichen Cloud-Laufwerken.",
        "Backups: nur wenn das Projekt sie braucht, mit gleichem Schutz, und nach Plan gelöscht.",
        "Protokolle: Wir protokollieren, wer worauf Zugriff hatte, und halten einen schriftlichen Plan für Datenpannen bereit.",
      ],
    },
    "client-data-use": {
      title: "Wo die Daten eines Kunden verwendet werden",
      paras: ["Die Daten eines Kunden werden nur an diesen Stellen verwendet und nirgends sonst:"],
      list: [
        "Um das bestellte Projekt zu bauen und zu testen (Website, App, CRM, KI-Tool, Shop, VR/AR-Welt, Design).",
        "Um das Projekt nach dem Start zu betreiben, zu hosten und zu betreuen, wenn der Kunde uns darum bittet.",
        "Um einen Fehler zu beheben, die Ursache eines Problems zu finden und die Sicherheit dieses Projekts zu verbessern.",
        "Um eine gesetzliche Pflicht zu erfüllen (zum Beispiel wenn ein Gericht oder eine Behörde rechtmäßig anfragt).",
        "Wir nutzen Daten eines Kunden NICHT, um eigene KI-Modelle zu trainieren, eigene Werbung zu machen, sie an Dritte zu verkaufen oder für das Projekt eines anderen Kunden. Verarbeitet ein KI-Tool im Projekt die Daten, nutzen wir nur vom Kunden genehmigte Tools und der Kunde erfährt, welches es ist.",
      ],
    },
    "our-own-use": {
      title: "Wo unsere eigenen Daten (Besucher, Anfragen, Bewerber) verwendet werden",
      list: [
        "Um Ihnen zu antworten und ein Angebot zu erstellen.",
        "Um unsere Website zu betreiben, zu sichern und zu verbessern (Fehler finden, Spam und Angriffe stoppen, sehen, welche Seiten nützlich sind).",
        "Um eine Bewerbung zu beurteilen.",
        "Um Ihnen Neuigkeiten zu unserer Arbeit zu senden, nur wenn Sie zugestimmt haben und mit einem Link zum Abbestellen.",
        "Um die Buchhaltung, Steuern und Verträge zu führen, die das Gesetz verlangt.",
      ],
    },
    sharing: {
      title: "Mit wem wir Daten teilen",
      paras: [
        "Wir verkaufen keine personenbezogenen Daten. Wir teilen sie nur mit: Teammitgliedern, die sie brauchen; Dienstleistern, die im Vertrag für uns arbeiten (Hosting, E-Mail, Projekt-Tools, Zahlungsdienste, Analyse) und sie nur für uns nutzen dürfen; dem Kunden, für dessen Projekt wir sie verarbeiten; und Behörden, wenn das Gesetz es verlangt.",
        "Ein Dienstleister, der Daten eines Kunden hält, heißt Unterauftragsverarbeiter. Wir informieren den Kunden, bevor wir einen einsetzen, und der Vertrag legt ihm dieselben Pflichten auf wie uns. Die Liste erhalten Sie auf Anfrage.",
      ],
    },
    retention: {
      title: "Wie lange wir Daten speichern",
      list: [
        "Anfragen, die nicht zu einem Projekt werden: bis zu 24 Monate, dann gelöscht.",
        "Bewerbungen: bis zu 12 Monate nach Besetzung der Stelle, es sei denn, der Bewerber stimmt längerer Speicherung zu.",
        "Kundenverträge, Rechnungen und Steuerunterlagen: so lange das Recht des Ortes es verlangt (in Indien meist 8 Jahre).",
        "Projekt-Arbeitskopien und Kundendaten: gelöscht oder an den Kunden zurückgegeben innerhalb von 90 Tagen nach Projektende oder früher auf schriftliche Bitte des Kunden. Backups verschwinden innerhalb von 30 weiteren Tagen. Steht im Vertrag etwas anderes, gilt der Vertrag.",
        "Server- und Website-Protokolle: meist bis zu 12 Monate.",
      ],
      paras: ["Länger speichern wir nur, wenn ein Gesetz es verlangt oder für einen Rechtsanspruch, und dann nur den nötigen Teil."],
    },
    security: {
      title: "Sicherheit und Datenpannen",
      paras: [
        "Wir schützen Daten mit den oben genannten Maßnahmen und verbessern sie laufend. Kein System ist zu 100 % sicher. Stellen wir eine Datenpanne fest, die Ihre Daten betrifft, informieren wir den Kunden unverzüglich (innerhalb von 24 Stunden nach Entdeckung) und geben die Fakten, die er braucht, um Behörde und Betroffene nach dem Recht des Landes zu informieren.",
      ],
    },
    transfers: {
      title: "Daten über Grenzen hinweg",
      paras: [
        "Unser Entwicklungsteam arbeitet von Indien aus und wir haben ein Büro in Deutschland. Daten eines Kunden können daher in Indien oder Deutschland sowie auf vom Kunden genehmigten Servern gesehen oder verarbeitet werden. Beschränkt das Recht des Landes des Kunden eine solche Übermittlung, nutzen wir das verlangte Instrument (zum Beispiel Standardvertragsklauseln) und nennen es auf der Länderseite.",
      ],
    },
    cookies: {
      title: "Cookies",
      paras: [
        "Unsere Website verwendet die Cookies, die sie zum Funktionieren braucht (zum Beispiel um Ihre Auswahl zu merken). Wo das Recht Ihre Einwilligung für andere Cookies verlangt, fragen wir zuerst, und Sie können Ihre Meinung jederzeit im Browser ändern. Wir nutzen keine Cookies, um Daten zu verkaufen.",
      ],
    },
    children: {
      title: "Kinder",
      paras: [
        "Unsere Website und Leistungen richten sich an Unternehmen, nicht an Kinder. Wir erheben nicht wissentlich Daten von Kindern unter 13 Jahren (oder dem Alter, das das Recht Ihres Landes festlegt). Richtet sich das Projekt eines Kunden an Kinder, muss der Kunde die Einwilligung der Eltern einholen und wir bauen die Schritte ins Projekt ein. Glauben Sie, ein Kind habe uns Daten gesendet, schreiben Sie uns und wir löschen sie.",
      ],
    },
    changes: {
      title: "Änderungen dieser Richtlinie",
      paras: [
        "Ändern sich Recht oder Arbeitsweise, aktualisieren wir diese Seite und das Datum oben. Bei größeren Änderungen informieren wir unsere Kunden per E-Mail. Ältere Fassungen gibt es auf Anfrage.",
      ],
    },
    contact: {
      title: "Kontakt",
      paras: [
        `We3vision Private Limited, Surat, Gujarat, Indien. E-Mail: ${MAIL}. Telefon: +91 7383216096. Unser deutsches Büro ist in Marburg: die Adresse steht auf der Kontaktseite. Schreiben Sie „Privacy request“ in den Betreff. Sind Sie mit unserer Antwort nicht zufrieden, können Sie sich bei der Datenschutzbehörde Ihres Landes beschweren (auf der Länderseite genannt).`,
      ],
    },
  },
  regions: {
    germany: {
      title: "Datenschutz für Deutschland",
      intro:
        "We3vision hat ein Büro in Marburg, Deutschland, und arbeitet für deutsche Unternehmen. Deutsches Recht ergänzt die EU-Datenschutzregeln (DSGVO): das Bundesdatenschutzgesetz (BDSG), die Regeln zu Cookies und Endgeräten (TDDDG) und die Regeln zum Impressum (DDG). Diese Seite beschreibt, was ein deutscher Kunde erwarten kann und was wir unterschreiben.",
      laws: [
        "Datenschutz-Grundverordnung (DSGVO)",
        "Bundesdatenschutzgesetz (BDSG)",
        "Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG, früher TTDSG): Cookies und Zugriff auf das Endgerät (§ 25)",
        "Digitale-Dienste-Gesetz (DDG): Impressum einer Website",
        "Die Landesdatenschutzgesetze der Bundesländer für Kunden im öffentlichen Bereich",
      ],
      sections: {
        "de-avv": {
          title: "Auftragsverarbeitungsvertrag (AVV)",
          paras: [
            "Verarbeiten wir personenbezogene Daten für einen deutschen Kunden, verlangt Art. 28 DSGVO einen schriftlichen Vertrag. Wir unterschreiben ihn, bevor wir Zugriff auf die Daten erhalten. Er regelt: was wir verarbeiten und wie lange; dass wir nur auf dokumentierte Weisung des Kunden handeln; dass alle Teammitglieder mit Datenzugriff zur Vertraulichkeit verpflichtet sind; welche technischen und organisatorischen Maßnahmen (TOMs) wir nutzen; dass wir bei Betroffenenrechten und Datenpannen helfen; dass wir Unterauftragsverarbeiter nur mit Genehmigung des Kunden einsetzen; und dass wir Daten am Ende löschen oder zurückgeben.",
            "Wir können die AVV-Vorlage des Kunden unterschreiben oder unsere geben. Der Text kann auf Deutsch oder Englisch sein.",
          ],
        },
        "de-toms": {
          title: "Technische und organisatorische Maßnahmen (Art. 32 DSGVO)",
          list: [
            "Zugriff nur für namentlich genannte Teammitglieder, die ihn für das Projekt brauchen, mit eigenen Konten und Zwei-Faktor-Anmeldung, wo das Tool sie bietet.",
            "Verschlüsselung der Daten bei der Übertragung (HTTPS/TLS) und, wo das System des Kunden es erlaubt, im Ruhezustand.",
            "Arbeit auf den Systemen des Kunden oder auf Projektservern, nicht auf privaten Laptops oder persönlichen Clouds.",
            "Getrennte Arbeitskopien je Kunde, die am Projektende gelöscht werden.",
            "Ein schriftlicher Plan für Datenpannen und ein Protokoll, wer worauf Zugriff hatte.",
            "Schulung des Teams zu Datenschutz und Vertraulichkeit.",
          ],
          note: "Die vollständige Liste ist dem AVV beigefügt und kann vor der Unterschrift zugesandt werden.",
        },
        "de-hosting": {
          title: "Wo die Daten gehostet werden",
          paras: [
            "Für deutsche und andere EU-Kunden vereinbaren wir vor Projektbeginn, wo die Projektdaten gespeichert werden. Braucht das Projekt es, nutzen wir Server in Deutschland oder der EU. Unser Entwicklungsteam sitzt in Indien, einem Land ohne Angemessenheitsbeschluss der EU; der Zugriff von dort ist daher eine Drittlandübermittlung: wir sichern sie mit den EU-Standardvertragsklauseln (siehe Seite Europäische Union) und zusätzlichen Maßnahmen (Verschlüsselung, begrenzter Zugriff, Protokollierung).",
          ],
        },
        "de-cookies": {
          title: "Cookies und Tracking (TDDDG § 25)",
          paras: [
            "Auf einer deutschen Website, die wir bauen, startet ein nicht unbedingt notwendiges Cookie oder Skript (Analyse, Werbung, Karten, Video-Einbettungen) erst, nachdem der Besucher in einem Cookie-Banner mit gleichwertigen Schaltflächen „Akzeptieren“ und „Ablehnen“ zugestimmt hat. Wir bauen Banner und Einwilligungsnachweis ins Projekt ein. Unsere eigene Seite folgt derselben Regel.",
          ],
        },
        "de-impressum": {
          title: "Impressum und Datenschutzseite",
          paras: [
            "Eine deutsche Unternehmenswebsite braucht ein Impressum (§ 5 DDG) und eine von jeder Seite leicht erreichbare Datenschutzerklärung. Wir fügen beides den Websites hinzu, die wir bauen, mit dem Text des Kunden oder einem Entwurf, den der Anwalt des Kunden prüft. Die Angaben zu dieser Seite stehen auf der Kontaktseite: We3vision Private Limited, Surat, Indien, mit dem deutschen Büro in Marburg.",
          ],
        },
        "de-employee": {
          title: "Beschäftigtendaten und Betriebsrat",
          paras: [
            "Verarbeitet ein Projekt Daten von Beschäftigten (HR-Tool, Zeiterfassung, Intranet), sind § 26 BDSG und, falls vorhanden, der Betriebsrat betroffen. Wir bauen das Projekt so, dass der Kunde zeigen kann, was verarbeitet wird und warum, und wir bauen keine Funktionen, die Leistung oder Verhalten von Mitarbeitern überwachen, es sei denn, der Kunde bestätigt die Zustimmung des Betriebsrats.",
          ],
        },
        "de-authority": {
          title: "Aufsichtsbehörde",
          paras: [
            "Unser deutsches Büro ist in Marburg im Land Hessen. Aufsichtsbehörde für Hessen ist der Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI) in Wiesbaden. Sie können sich dort beschweren oder bei der Behörde des Landes, in dem Sie leben oder arbeiten.",
          ],
        },
        "de-rights": {
          title: "Ihre Rechte",
          list: [
            "Auskunft (Art. 15), Berichtigung (16), Löschung (17), Einschränkung (18), Datenübertragbarkeit (20), Widerspruch (21).",
            "Nicht einer ausschließlich automatisierten Entscheidung unterworfen zu sein, die Sie erheblich betrifft (22).",
            "Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen (7).",
          ],
          note: `Recht ausüben: Schreiben Sie an ${MAIL} mit dem Betreff „Privacy request“. Wir antworten innerhalb der gesetzlichen Frist (spätestens 30 Tage, sofern das Gesetz keine kürzere nennt).`,
        },
      },
    },
  },
};
