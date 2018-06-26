function makeLineChart() {
  var chrt = document.getElementById("myChart").getContext("2d")
  var data = {
    labels: ["27 Nov 2010", "27 Nov 2011", "27 Nov 2012"],
    datasets: [
      {
        label: "Your Data",
        backgroundColor: "#8470ff99", //..add alpha with the last two digits of the hex color
        borderColor: "#8470ff99",
        hoverBackgroundColor: "#8470ff99",
        hoverBorderColor: "#8470ff99",
        data: [65, 59, 80]
      }
    ]
  }
  var myFirstChart = new Chart(chrt, {
    type: "line",
    data: data,
    options: {
      responsive: true
    }
  })
}
