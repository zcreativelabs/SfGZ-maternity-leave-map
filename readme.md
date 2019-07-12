
# Mutterschaftsurlaub

In dieser Übung geht es darum Daten zum Mutterschaftsurlaub in allen Ländern der Welt anzuzeigen.

Die Daten vom World Policy and Analysis Center unterteilen die Länder in 5 Kategorien, welche qualitative Merkmalsausprägungen mit natürlicher Ordnung haben. Beim Datensatz handelt es sich somit um einen Ordinaldatensatz den wir als Choroplethenkarte darstellen wollen.

```
Kategorie 1 => Kein Mutterschaftsurlaub
Kategorie 2 => Bis 14 Wochen Mutterschaftsurlaub
Kategorie 3 => 14-25.9 Wochen Mutterschaftsurlaub
Kategorie 4 => 26-51.9 Wochen Mutterschaftsurlaub
Kategorie 5 => 52+ Wochen Mutterschaftsurlaub
```

## Aufgabe

1. Erstelle eine Weltkarte in einem passenden Format (z.B. 4:3 — 800x600). Überlege dir welche Kartenprojektion sich am besten eignen würde (siehe Hinweis 1).

2. Erstelle eine Farbskala (`d3.scaleOrdinal`), die 5 Kategorien in verschiedenen Farben anzeigen kann. (siehe Hinweis 2)

3. Binde die Länder an Pfade und gib ihnen die richtige Farbe je nach Kategorie (siehe Hinweis 3).

4. Überlege dir was die Story ist in dieser Karte. Es gibt eine sehr klare Story hier, die wir hervorheben können. Wie kannst du die Farbskala gestalten so dass diese Story sichtbarer wird ohne dass du deine Leser irreführst.

5. Hebe die Story weiter hervor mit Anmerkungen. (siehe Hinweis 4)

## Hinweise

#### 1. Karte

Für diese Weltkarte eignet sich die Mollweide Projektion besonders gut, da sie Flächentreu ist.

```js
const projection = d3.geoMollweide()
  .translate([width/2, height/2])
  .scale(140)
```

Die Mollweide Projektion ist aesthetisch besonders schön wenn sie mit einem Gradnetz gezeichnet wird. Um ein Gradnetz zu zeichnen kannst du `g3.geoGraticule` benutzen. Du kannst das Gradnetz mithilfe des Pfadgenerators auf deine Karte zeichnen.

```js
const graticule = d3.geoGraticule()()

const graticulePath = svg.append("path")
  .attr("d", pathGenerator(graticule))
  .attr("fill", "transparent")
  .attr("stroke", "#EEE")
  .attr("stroke-width", 0.5)
```

#### 2. Farbskala

Bei diesem Datensatz handelt es sich um Ordinaldaten unterteilt in 5 Kategorien. Du kannst `d3.scaleOrdinal` benutzen um eine Ordinalskala zu generieren.

```js
const scale = d3.scaleOrdinal()
  .domain([1,2,3,4,5])
  .range(["#EEE","#CCC","#AAA","#777","#333"])
```

#### 3. Suche Daten zu jedem Land

Um die Daten zum Mutterschaftsurlaub für jedes Land zu finden, kannst du die in Javascript eingebaute Suchfunktion fur Arrays benutzen.

Um z.B. die Mutterschaftsurlaubsdaten für die Schweiz aus dem `maternityLeave` Array zu holen, kannst die die folgende Suche benutzen:

```js
const maternityLeaveSwitzerland = matenrityLeave.find(function(dataPoint) {
  return dataPoint.iso3 === "CHE"
})

// console.log(maternityLeaveSwitzerland)
// => { country: "Switzerland", iso3: "CHE", matleave_1995: 2,matleave_2013: 3 }
```

Diese Suche kannst du dann in `.attr` benutzen und mithilfe von `ADM0_A3` anstall `CHE` auf jedes Land anwenden:

```js
const countryShapes = svg.selectAll("path")
  .data(countries.features)
  .enter()
  .append("path")
    .attr("fill", function(country) {
      const maternityMetaData = maternityLeave.find(function(dataPoint) {
        return dataPoint.iso3 === country.properties.ADM_03
      })
      return maternityMetaData ? scale(maternityMetaData.matleave_2013) : "#EEE"
    })
```

#### 4. Anmerkungen

Du weist bereits dass du deine Visualisierung in Sketch importieren kannst und dort die Anmerkungen zum Storytelling anbringen kannst, aber was passiert wenn du Anmerkungen im Browser zeigen willst? Mit `projection` und ein bisschen Kreativität kannst du relativ leicht Anmerkungen mit d3 generieren.

Du solltest zuerst eine Gruppe geografisch mithilfe von `projection` positionieren und dann alle Anmerkungselemente für eine Anmerkung an diese Gruppe hängen. Die Gruppe ist besonders nützlich wenn du mehr als ein Anmerkungselement pro Anmerkung hast (z.B. Punkt + Linie + Text).

```js
const annotation = svg.append("g")
  .attr("transform", function(d) {
    const coords = projection([0,0])
    return "translate(" + coords[0] + " " + coords[1] + ")"
  })

annotation.append("text")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .text("Annotation text")
```
