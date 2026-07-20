# -*- coding: utf-8 -*-
import json, os

body = """## Was ist das Genusstraining?

Das **Genusstraining** (synonym: **Euthymes Verfahren**) ist ein **verhaltenstherapeutisch orientierter Behandlungsansatz zum Aufbau positiven Erlebens und Handelns**. Es wurde als **„Kleine Schule des Genießens"** von **Eva Koppenhöfer** (Dipl.-Psych., Psychologische Psychotherapeutin) konzipiert. Leitgedanke: „Genuss ist nicht vorübergehend, denn der Eindruck, den er zurücklässt, ist bleibend."

### Theoretischer Hintergrund: das orthogonale Konzept

- Gesundheit und Krankheit sind **keine Gegenpole einer einzigen Skala**, sondern **zwei unabhängige (orthogonale) Dimensionen** – man kann gleichzeitig hohe Ausprägungen von Krankheit UND von Gesundheit haben.
- „Man ist subjektiv krank oder behandlungsbedürftig, wenn die Balance zwischen gesunderhaltenden und krankmachenden Bedingungen zu Ungunsten von Krankheit verschoben ist."
- Das Genusstraining setzt gezielt an der **gesunderhaltenden Seite** (Ressourcen, positives Erleben) an – unabhängig von der Erkrankung.

### Übergreifende Philosophie (Koppenhöfer, 2004)

- **Keine Bagatellisierung** der Beschwerden – unbeschwerten Verhaltensweisen soll lediglich **gleichwertige Bedeutung** zukommen.
- **Balance-Modell:** Die Waagschale der entlastenden, kompensatorischen Verhaltensbereiche soll mindestens so gewichtig gestaltet werden wie die Waagschale der negativen Erlebnisbereiche.
- Euthymes Erleben und Verhalten erhält eine **antinoxische** (schädlichen Einflüssen entgegenwirkend), **noxeninkompatible** (unvereinbar mit Krankheitsauslösern/Noxen) und **curative** (heilende) Funktion – es wird zum **Schutz-, Gegen- und Heilmittel**.

## Entstehungsgeschichte und Erstanwendung

| Jahr | Ereignis |
|---|---|
| 1972 | **Ron Ramsay** (Universität Amsterdam, von Rainer Lutz als „Vater des Genusstrainings" bezeichnet) bringt den Ansatz in **Marburg** ein – u. a. als **Essprogramm für Menschen mit Übergewicht** (Bereich der Erstanwendung) |
| 1983 | **Lutz und Koppenhöfer** bringen die **„Kleine Schule des Genießens"** heraus – seither fester Bestandteil der Verhaltenstherapie |
| 2004 | Eva Koppenhöfer: „Kleine Schule des Genießens" (Pabst) als Manual/Grundlagenwerk |

**Einsatzgebiete bei Erkrankungen:** Depressionen, Zwangserkrankungen, Essstörungen, psychosomatische Erkrankungen, Schmerzstörungen, Erschöpfungssyndrom.

**Zusätzlich Gesundheitsförderung/Prävention:** Genuss = positive Emotionen (Freude, Lachen, Wohlfühlen, Glücksmomente, Entspannung, Tagträumen); kann auch Menschen mit Hörverminderung, Diabetes, Gelenk-/Stützsystemerkrankungen oder Neurodermitis helfen, die Lebensqualität zu steigern.

**Zwei Einsatzbereiche:** (1) Sinne im Alltag neu/wiederentdecken – Klienten erkennen, dass der Alltag Außerordentliches an Genuss bergen kann und man sich Genussmomente selbst schaffen kann; (2) Ergänzung zur psychologischen/psychotherapeutischen Behandlung als therapeutisches Werkzeug im Gesamtbehandlungskonzept.

## Die 7 Genussregeln (Prüfungskern!)

| # | Regel | Kernbotschaft |
|---|---|---|
| 1 | **Genuss braucht Zeit** | Entschleunigung; schon **Minuten** im „Hier und Jetzt" genügen – keine ausgedehnten Zeitintervalle (Urlaub, Wochenende) nötig; genussvolles Erleben setzt manchmal **Planung** voraus |
| 2 | **Genuss muss erlaubt sein** | Genussfähigkeit ist **angeboren**, wird aber durch Tabus, Verbote, Ängste gehemmt (lerntheoretisch: „bestrafende" Konsequenzen); typische Genussverbote aufspüren („das ist ja albern, sinnlos, Zeitvergeudung…"); fatale Grundüberzeugung: „Solange ich krank bin, kann ich mich doch nicht wohl fühlen" – **Krankheit und Wohlbefinden haben nebeneinander Berechtigung**; auch Therapeuten müssen eigene Genussverbote prüfen |
| 3 | **Genuss geht nicht nebenbei** | Die Wahrnehmungskapazität ist begrenzt: Aufmerksamkeit ganz auf **EINE** Sache richten, genussstörende Bedingungen ausblenden; Multitasking (z. B. am PC arbeiten und dabei Kuchen essen) verhindert bewussten Genuss |
| 4 | **Weniger ist mehr** | Erst **Begrenzung von Menge und Dauer** macht das Besondere fassbar; Überangebot → **Sättigung schlägt in Ablehnung um**; **NICHT** gemeint ist „Beschränke und bescheide dich" – es geht um rechtzeitige Beschränkung, nicht um Bescheidenheit; nach etwas Gutem muss eine gewisse **Sehnsucht** bewahrt bleiben |
| 5 | **Genuss: aussuchen, was dir gut tut** (= „Jedem das Seine" / Geschmackssache) | Individuelle Genüsse auskundschaften und vor verfälschenden Reaktionen anderer schützen („igitt, das findest du gut?"); fördert **assertives, selbstbewusstes Verhalten**; Genussbereitschaft variiert situativ |
| 6 | **Ohne Erfahrung kein Genuss** | Je genauer man etwas kennt, desto nuancenreicher kann man es wahrnehmen (Beispiel: Inuit mit angeblich 60 Begriffen für Schnee vs. 3–4 im Deutschen); feine Unterschiede zu erkennen ist **erlernbar** |
| 7 | **Genuss ist alltäglich** | Genuss ist **nicht außergewöhnlichen Ereignissen vorbehalten**; das Außergewöhnliche im Alltag entdecken (Kaffeeduft, Laufen durch Herbstlaub, warme Dusche an einem kalten Wintermorgen) |

Ergänzend nennt Handler (2009) eine **8. Regel: „Askese kann Genuss erhöhen"** – Bedürfnisaufschub und temporäre Enthaltsamkeit verstärken das nachfolgende Genusserleben (Vorfreude ist selbst schon Genuss).

**Typische Prüfungsfalle (Musterklausur):** „Genuss muss geteilt werden", „Genuss muss gelernt werden" und „Genuss muss nichts kosten" sind **KEINE** Genussregeln.

## Ablauf einer Genusstraining-Sitzung

1. **Thematisierung eines Sinnesbereichs**, Erläuterung verschiedener Aspekte dieser Sinnesmodalität.
2. **Angebot von Animationsmaterialien.**
3. **Einführende gemeinsame Übung** – Beispiele: Geruch = eine frisch geschnittene Apfelsinenhälfte wird weitergereicht; Tasten = ein raues, trockenes, leichtes Stück Baumrinde im Kontrast zu einem kühlen, glatten, schweren Stein.
4. Die Patienten **wählen ihre bevorzugte Stimulanz** selbst aus dem Angebot.
5. **Geleitete Vorstellungsübung:** Der Therapeut instruiert modellhaft den den Genuss-Regeln entsprechenden Umgang mit den Materialien (Zeit lassen, Aufmerksamkeit darauf richten, sich Genuss erlauben) und bietet Querverbindungen zu anderen Sinnesbereichen an.
6. **Exploration der Eindrücke**, Bilder und Vorstellungen jedes Einzelnen; die übrigen Gruppenmitglieder hören zu, nehmen Anteil oder tauschen sich aus.
7. **Hausaufgabe:** Generalisation in den Alltag – dort wohltuende Stimulanzien ausfindig machen und Beispiele zur nächsten Sitzung mitbringen.
8. In der Folgesitzung **stellen die Patienten die mitgebrachten Materialien vor** (Austausch und Vergleich der Erfahrungen).
9. **Vertiefung der Anregungen**, ggf. Vereinbarung weiterer Aktivitäten für die Zeit zwischen den Sitzungen.
10. **Vorstellung eines neuen Themenbereichs** – der Zyklus beginnt erneut.

Der Ablauf soll Therapeut und Gruppenteilnehmern bewusst **Raum zur individuellen Ausgestaltung** lassen.

## Rahmenbedingungen und Klientel

- **Feste Gruppenzusammensetzung**, **6 Sitzungen à ca. 60 Minuten**, Beginn gemeinsam mit der Gruppenleitung in einem **ruhigen Raum**.
- **Gruppengröße: max. 8 Personen.**
- Für jede Stunde werden passende, möglichst positive und alltägliche **Stimulanzien** besorgt (die individuelle Bedeutsamkeit kann schwanken).
- **Geeignete Klientel:** Klienten mit **affektiven Störungen**, Menschen mit **Abhängigkeitserkrankungen**, Klienten mit **Essstörungen**, Klienten mit **psychosomatischen Erkrankungen**.
- Je **schwerer** die psychische Erkrankung, desto **vorsichtiger und individueller** muss das Training angepasst werden (wichtigste Grundlage bei der Gruppenzusammensetzung).
- Wer Genusstraining anleitet, sollte es zuvor **selbst in Eigenerfahrung** durchlaufen haben; Durchführung im **Gruppen- oder Einzelsetting** möglich, auch integrierbar in eine laufende Behandlung.
- Reine Frauen-/Männergruppen: leichteres Öffnen im Schutz des eigenen Geschlechts; gemischtgeschlechtliche Gruppen können **geschlechterverbindend** wirken.

## Die Sinne im Genusstraining

**Reihenfolge bei psychischer Problematik (z. B. Depression) – prüfungsrelevant:**

**Riechen → Tasten → Schmecken → Schauen → Horchen**

- **Riechen (an erster Stelle):** **archaischer Sinn** – Geruchsinformationen werden nicht nur in stammesgeschichtlich neueren Hirnregionen verarbeitet, sondern auch in **älteren Regionen, in denen Emotionen beheimatet sind (limbisches System)**; kann auch schwer depressive Menschen aus der **Gefühlsstarre** herausholen; Gerüche wirken **anregend**.
- **Tasten:** ähnlich leicht zugänglich, emotional ansprechend, selten negativ besetzt.
- **Schmecken (nicht am Anfang!):** Appetit- und Geschmackserleben gehen oft schon bei leichter Depression zurück → kann belastend erlebt werden und mit Widerstand besetzt sein.
- **Schauen:** dominanter Sinn unserer Zeit (**70–80 % der Wahrnehmung** wird visuell beeinflusst); in der Tiefe einer Depression kann Schauen **Reizüberflutung** auslösen → ans Ende.
- **Horchen (Ende):** wird bei depressiver Verstimmung oft als sehr **störend** empfunden, viele Geräusche werden als laut/unangenehm erlebt, häufig nur Wunsch nach **Stille** (auch bei Anpassungsstörungen und Burnout).

**Der „sechste Sinn":** nichts Übersinnliches, sondern der **intellektuelle Sinn** (Kognitionen, Gedanken, gesamte Hirnaktivität mit Vernetzungsfähigkeit) – „Ich denke, also bin ich" (Descartes). Denken allein kann genussvoll sein.

**Weitere Sinnesdetails:**

- **Schmecken:** vier Geschmacksqualitäten **süß, sauer, bitter, salzig**; sich Zeit lassen, Nahrung im Mund hin- und herschieben; **Schmatzen erlaubt, aber nicht sprechen** (Sprechen lenkt vom Schmecken ab); langsames Essen ist trainierbar (Besteck ablegen, zurücklehnen, Geschmack/Konsistenz bewusst wahrnehmen); sogar Wasser hat Geschmack und Konsistenz.
- **Sehen:** drei trainierte Bereiche – **Farbsehen, Struktursehen, Sehen von Bewegungsabläufen**; optische Wahrnehmung ist subjektiv (geprägt durch Vorerfahrung, Befindlichkeit, Bedürfnisse).
- **Hören:** gilt als der **„intellektuellste Sinn"** des Menschen; Training beginnt mit Alltagsgeräuschen (Papierrascheln, Wassereingießen, Windspiel; Natur: Wind, Regen, Vogelstimmen – auch **Stille ist hörbar**).
- **Tasten:** in unserer Kultur eher **verkümmerter Sinn**, obwohl die **Haut die größte Körperfläche** einnimmt; **Tastwerkzeuge:** Hände, Füße, Lippen, Zunge, Mundhöhle; vermittelt Temperatur, Größe, Struktur, Oberflächenbeschaffenheit, Gewicht, Form, Material, Konsistenz; **Blind-Ertasten** ist Teil des Trainings; Beispiel: sensomotorischer Barfußparcours (Sand, Waldboden, Kies, Schotter u. a.).

## Übergeordnete Therapieziele (4)

1. **Sensibilisierung der Sinnesmodalitäten**
2. **Vermittlung eines ganz spezifischen Umgangs mit potenziell Genussvollem**
3. **Aktualisierung angenehmer Vorerfahrungen**
4. **Aufbau von Eigenverantwortung, Stärkung der Autonomie**

## Voraussetzungen für Genuss

- **Achtsamkeit und Zeit:** Aufmerksamkeitslenkung auf den aktuellen Moment ist wesentliches Element der Achtsamkeit (**Kabat-Zinn**, „Hier und Jetzt"); „Wenn du es eilig hast, gehe langsam" – Achtsamkeit spart Zeit, weil Hektik zu Missgeschicken führt.
- **Bedürfnisse und Gefühle:** Gefühle benennen und differenziert wahrnehmen unterstützt die Bedürfniswahrnehmung und das Genussempfinden (Konfliktgefahr, wenn eigene Gefühle wie genervt, erschöpft, müde, hungrig nicht erkannt werden).
- **Bedürfnisaufschub:** kann der **Vorfreude** dienlich sein und begünstigt späteres Genusserleben.

## Praxisbezug und Einordnung

- **Genusswoche** (Selbsterfahrungsübung): Jeden Tag der Woche mit einem **anderen Sinn** bewusst genießen und für sich notieren; reflektieren: Was war neu, was vertraut?
- **Selbsttest „Zufriedenes Dasein"** (Reflexionsfragen): Wie kann ich häufiger Pausen/Genussmomente einbauen? Woran erkenne ich Belastung/Stress? Was ist für mich entspannend? Was bedeutet für mich Glück?
- **Einordnung:** Die **Euthyme Therapie (Genusstraining)** wird explizit als **Verfahren der Verhaltenstherapie** geführt – neben Reizkonfrontation/Exposition, systematischer Desensibilisierung, Selbstmanagement, operanten Verfahren, Training sozialer Kompetenzen, Aufbau positiver Aktivitäten, kognitiver Umstrukturierung und Entspannungsverfahren.

**Hinweis zum Thalamus-Bezug des Eingrenzungsthemas:** Das Kursmaterial enthält dazu keine eigenen Ausführungen (im Handout ausdrücklich als Ergänzungsbedarf vermerkt). Im Kurs betont wird, dass Geruchsinformationen auch in **stammesgeschichtlich älteren, emotionalen Hirnregionen (limbisches System)** verarbeitet werden – die im Material angeführte neurobiologische Begründung, warum **Riechen** im Genusstraining an erster Stelle steht."""

obj = {
    "id": "genusstraining",
    "title": "Genusstraining (Euthymes Verfahren): Konzept, Genussregeln und Durchführung",
    "eingrenzung": "Genusstraining (Thalamus, Bereiche in denen erst angewendet wird, Regeln, Konzepte)",
    "prio": "high",
    "body": body,
    "facts": [
        "Das Genusstraining ist das Euthyme Verfahren – ein verhaltenstherapeutisch orientierter Behandlungsansatz zum Aufbau positiven Erlebens und Handelns („Kleine Schule des Genießens", Eva Koppenhöfer).",
        "Ron Ramsay (Universität Amsterdam) gilt nach Rainer Lutz als „Vater des Genusstrainings"; 1972 brachte er den Ansatz in Marburg ein, u. a. als Essprogramm für Menschen mit Übergewicht.",
        "1983 veröffentlichten Lutz und Koppenhöfer die „Kleine Schule des Genießens" – seither ist das Genusstraining fester Bestandteil der Verhaltenstherapie.",
        "Die 7 Genussregeln lauten: 1. Genuss braucht Zeit, 2. Genuss muss erlaubt sein, 3. Genuss geht nicht nebenbei, 4. Weniger ist mehr, 5. Genuss: aussuchen, was dir gut tut, 6. Ohne Erfahrung kein Genuss, 7. Genuss ist alltäglich.",
        "„Genuss muss geteilt werden", „Genuss muss gelernt werden" und „Genuss muss nichts kosten" sind KEINE Genussregeln (typische Distraktoren in der Klausur).",
        "Bei Depression gilt die Sinnesreihenfolge Riechen → Tasten → Schmecken → Schauen → Horchen.",
        "Riechen steht an erster Stelle, weil es ein archaischer Sinn ist, dessen Reize auch in älteren, emotionalen Hirnregionen (limbisches System) verarbeitet werden und der aus der Gefühlsstarre herausholen kann.",
        "Rahmenbedingungen der Genussgruppe: feste Gruppenzusammensetzung, 6 Sitzungen à ca. 60 Minuten, max. 8 Personen, ruhiger Raum.",
        "Geeignete Klientel: affektive Störungen, Abhängigkeitserkrankungen, Essstörungen, psychosomatische Erkrankungen; Einsatzgebiete außerdem Zwangserkrankungen, Schmerzstörungen, Erschöpfungssyndrom.",
        "Das orthogonale Konzept beschreibt Gesundheit und Krankheit als zwei unabhängige Dimensionen (keine Gegenpole); das Genusstraining stärkt gezielt die gesunderhaltende Seite.",
        "Euthymes Erleben und Verhalten hat eine antinoxische, noxeninkompatible und curative Funktion – es wird zu Schutz-, Gegen- und Heilmittel.",
        "Der „sechste Sinn" im Genusstraining ist der intellektuelle Sinn (Denken, Kognition, Vernetzungsfähigkeit).",
        "Vier Geschmacksqualitäten: süß, sauer, bitter, salzig; drei Sehbereiche: Farbsehen, Struktursehen, Sehen von Bewegungsabläufen; der Hörsinn gilt als „intellektuellster Sinn".",
        "Die vier übergeordneten Therapieziele: Sensibilisierung der Sinnesmodalitäten, spezifischer Umgang mit potenziell Genussvollem, Aktualisierung angenehmer Vorerfahrungen, Aufbau von Eigenverantwortung/Autonomie."
    ],
    "figures": [
        {"src": "assets/psychosoziale/g396.png", "caption": "Ablaufschritte einer Genusstraining-Sitzung (von der Thematisierung eines Sinnesbereichs bis zur Vorstellung eines neuen Themenbereichs)"},
        {"src": "assets/psychosoziale/g404.png", "caption": "Reihenfolge der Sinne im Genusstraining bei psychischer Problematik: Riechen → Tasten → Schmecken → Schauen → Horchen"},
        {"src": "assets/psychosoziale/g422.png", "caption": "Orthogonales Konzept: Gesundheit und Krankheit als zwei unabhängige Achsen statt Gegenpole einer Skala"},
        {"src": "assets/psychosoziale/g424.png", "caption": "Die vier übergeordneten Therapieziele des Genusstrainings"},
        {"src": "assets/psychosoziale/g428.png", "caption": "Die 7 Genussregeln (Kursfolie „Kleine Schule des Genießens")"}
    ],
    "flashcards": [
        {"q": "Was ist das Genusstraining und unter welchem synonymen Namen ist es bekannt?", "a": "Es ist das Euthyme Verfahren: ein verhaltenstherapeutisch orientierter Behandlungsansatz zum Aufbau positiven Erlebens und Handelns, konzipiert als „Kleine Schule des Genießens" (Eva Koppenhöfer)."},
        {"q": "Nenne die 7 Genussregeln des Genusstrainings.", "a": "1. Genuss braucht Zeit, 2. Genuss muss erlaubt sein, 3. Genuss geht nicht nebenbei, 4. Weniger ist mehr, 5. Genuss: aussuchen, was dir gut tut, 6. Ohne Erfahrung kein Genuss, 7. Genuss ist alltäglich."},
        {"q": "Wer gilt als „Vater des Genusstrainings" – und in welchem Bereich wurde das Verfahren zuerst angewendet?", "a": "Ron Ramsay (Universität Amsterdam). Er brachte den Ansatz 1972 in Marburg ein, u. a. als Essprogramm für Menschen mit Übergewicht. 1983 erschien die „Kleine Schule des Genießens" von Lutz und Koppenhöfer."},
        {"q": "In welcher Reihenfolge werden die Sinne im Genusstraining bei depressiven Patienten trainiert – und warum steht Riechen an erster Stelle?", "a": "Riechen → Tasten → Schmecken → Schauen → Horchen. Riechen ist ein archaischer Sinn: Gerüche werden auch in älteren, emotionalen Hirnregionen (limbisches System) verarbeitet, wirken anregend und können aus der Gefühlsstarre herausholen."},
        {"q": "Welche Rahmenbedingungen gelten für eine Genussgruppe (Sitzungszahl, Dauer, Gruppengröße, Klientel)?", "a": "Feste Gruppenzusammensetzung, 6 Sitzungen à ca. 60 Minuten, max. 8 Personen, ruhiger Raum. Geeignet u. a. bei affektiven Störungen, Abhängigkeitserkrankungen, Essstörungen und psychosomatischen Erkrankungen."},
        {"q": "Was besagt das orthogonale Konzept von Gesundheit und Krankheit, und welche Konsequenz hat es für das Genusstraining?", "a": "Gesundheit und Krankheit sind zwei unabhängige (orthogonale) Dimensionen, keine Gegenpole einer Skala. Das Genusstraining stärkt gezielt die gesunderhaltende Seite (Ressourcen, positives Erleben) – unabhängig von der Erkrankung."},
        {"q": "Nenne die vier übergeordneten Therapieziele des Genusstrainings.", "a": "1. Sensibilisierung der Sinnesmodalitäten, 2. Vermittlung eines spezifischen Umgangs mit potenziell Genussvollem, 3. Aktualisierung angenehmer Vorerfahrungen, 4. Aufbau von Eigenverantwortung und Stärkung der Autonomie."}
    ],
    "quiz": [
        {"q": "Welche der folgenden Aussagen ist KEINE Genussregel des Genusstrainings?",
         "options": ["Genuss muss geteilt werden", "Weniger ist mehr", "Genuss ist alltäglich", "Genuss geht nicht nebenbei"],
         "answer": 0,
         "explain": "„Genuss muss geteilt werden" ist ein klassischer Distraktor – ebenso „Genuss muss gelernt werden" und „Genuss muss nichts kosten". Die anderen drei Aussagen gehören zu den 7 Genussregeln."},
        {"q": "In welcher Reihenfolge werden die Sinne im Genusstraining bei depressiver Problematik trainiert?",
         "options": ["Schauen → Horchen → Schmecken → Tasten → Riechen", "Riechen → Schmecken → Tasten → Horchen → Schauen", "Tasten → Riechen → Schauen → Horchen → Schmecken", "Riechen → Tasten → Schmecken → Schauen → Horchen"],
         "answer": 3,
         "explain": "Riechen zuerst (archaischer Sinn, limbisches System, holt aus der Gefühlsstarre); Schmecken nicht am Anfang (Appetit/Geschmack oft reduziert, belastend); Schauen und Horchen ans Ende (Reizüberflutung bzw. als störend empfunden)."},
        {"q": "Wer gilt als „Vater des Genusstrainings" und brachte den Ansatz 1972 in Marburg ein?",
         "options": ["Rainer Lutz", "Eva Koppenhöfer", "Ron Ramsay", "Jon Kabat-Zinn"],
         "answer": 2,
         "explain": "Ron Ramsay (Universität Amsterdam). Lutz und Koppenhöfer veröffentlichten 1983 die „Kleine Schule des Genießens"; Kabat-Zinn steht für das Achtsamkeitskonzept (Aufmerksamkeit im Hier und Jetzt)."},
        {"q": "Welche Rahmenbedingungen gelten für eine Genussgruppe?",
         "options": ["10 Sitzungen à 90 Minuten, max. 12 Personen, offene Gruppe", "6 Sitzungen à ca. 60 Minuten, max. 8 Personen, feste Gruppenzusammensetzung", "6 Sitzungen à 30 Minuten, max. 6 Personen, wechselnde Zusammensetzung", "12 Sitzungen à 60 Minuten, max. 8 Personen, feste Gruppenzusammensetzung"],
         "answer": 1,
         "explain": "Korrekt sind: feste Gruppenzusammensetzung, 6 Sitzungen à ca. 60 Minuten und maximal 8 Personen in einem ruhigen Raum."}
    ]
}

out = r"C:/Users/chris/Desktop/Valeria/Lernapp/build/psychosoziale/frag/psychosoziale/topic_11.json"
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w", encoding="utf-8") as f:
    json.dump(obj, f, ensure_ascii=False, indent=2)
print("written:", out)
