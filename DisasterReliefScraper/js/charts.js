window.onload = () => {
  const doughnutChart = (id, labels, data, title) => {
    new Chart(document.getElementById(id), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#1da1f2', '#17bf63', '#e0245e']
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: title } }
      }
    });
  };

  const pieChart = (id, labels, data, title) => {
    new Chart(document.getElementById(id), {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#794bc4', '#f45d22', '#ffad1f']
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: title } }
      }
    });
  };

  const barChart = (id, labels, data, title) => {
    new Chart(document.getElementById(id), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Posts',
          data: data,
          backgroundColor: '#1da1f2'
        }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: title } },
        scales: { y: { beginAtZero: true } }
      }
    });
  };

  // Sample Data
  doughnutChart("kardingAbsCbnChart", ["Likes", "Reposts", "Comments"], [1200, 350, 230], "ABS-CBN Coverage");
  doughnutChart("kardingGmaChart", ["Likes", "Reposts", "Comments"], [900, 410, 190], "GMA Coverage");

  barChart("kardingSupportChart", ["Post 1", "Post 2", "Post 3"], [3, 5, 2], "Typhoon Karding Community Support");
  barChart("earthquakeSupportChart", ["Post A", "Post B", "Post C"], [4, 2, 1], "Luzon Earthquake Community Support");

  pieChart("infraAbsCbnChart", ["Likes", "Reposts", "Comments"], [300, 50, 20], "Infrastructure - ABS-CBN");
  pieChart("infraGmaChart", ["Likes", "Reposts", "Comments"], [280, 60, 30], "Infrastructure - GMA");

  doughnutChart("earthquakeRelief1", ["Likes", "Reposts", "Comments"], [80, 30, 20], "Relief Post 1");
  doughnutChart("earthquakeRelief2", ["Likes", "Reposts", "Comments"], [120, 40, 15], "Relief Post 2");

  pieChart("preparedness1", ["Posts", "Likes"], [60, 25], "Preparedness Post 1");
  pieChart("preparedness2", ["Posts", "Likes"], [40, 35], "Preparedness Post 2");
};
