//using google charts
//https://developers-dot-devsite-v2-prod.appspot.com/chart/interactive/docs/gallery/linechart.html

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

//function to draw chart
function drawChart() {
  console.log("inside draw chart");
  //   console.log(val);

  // POST request using fetch()
  fetch("/bmi", {
    // Adding method type
    method: "POST",

    // Adding body or contents to send
    body: JSON.stringify({
      height: "foo",
      weight: "bar",
      userId: 1,
    }),

    // Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    // Converting to JSON
    .then((response) => {
      console.log("response from /bmi");
      // const reader = response.body.getReader();
      response.json().then((data) => {
        console.log("data");
        console.log(data);

        //create the graph
        var data = google.visualization.arrayToDataTable(data.names);

        var options = {
          title: "BMI ",
          curveType: "function",
          legend: { position: "bottom" },
          lineWidth: 4,
          colors: ["#e6693e"],
        };

        var chart = new google.visualization.LineChart(
          document.getElementById("curve_chart")
        );

        chart.draw(data, options);
      });
    });
}
