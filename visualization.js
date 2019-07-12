
document.addEventListener("DOMContentLoaded", () => {
  d3.json("/countries.json")
    .then(countries => {
      d3.csv("/maternity-leave-by-country-1995-2013.csv")
        .then(maternityLeave => {

          // ==================================================

          // Visualisierung...
          
          // ==================================================

        })
    })
})
