google.charts.load("current", { packages: ["bar"] });
google.charts.setOnLoadCallback(drawProgrammingLanguages);
var mymap = L.map('mapid').setView([51.505, -0.09], 13);


function drawProgrammingLanguages() {
  var data = new google.visualization.arrayToDataTable([
    ["Language", "Experience"],
    ["Python", 5],
    ["Java", 3],
    ["HTML5", 5],
    ["JavaScript", 5],
    ["CSS", 5],
    ["Racket (LISP)", 3],
    ["BASH (LISP)", 4],
    ["LaTex", 5],
    ["XML", 4],
    ["C++", 3]
  ]);

  var options = {
    title: "Programming Languages Chart",
    legend: "left",
    width: 900,
    height: 500,
    chart: {
      subtitle: "Ratings by Expertise"
    },
    bars: "horizontal",
    axes: {
      x: {
        0: { side: "top", label: "Experience" }
      }
    },
    bar: { groupWidth: "50%" }
  };
  var chart = new google.charts.Bar(document.getElementById("chart1"));
  chart.draw(data, options);
}
