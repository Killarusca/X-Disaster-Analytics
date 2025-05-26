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

window.onload = () => {


  barChart("kardingSupportChart", ["Post 1", "Post 2", "Post 3"], [3, 5, 2], "Typhoon Karding Community Support");
  barChart("earthquakeSupportChart", ["Post A", "Post B", "Post C"], [4, 2, 1], "Luzon Earthquake Community Support");

  pieChart("infraAbsCbnChart", ["Likes", "Reposts", "Comments"], [300, 50, 20], "Infrastructure - ABS-CBN");
  pieChart("infraGmaChart", ["Likes", "Reposts", "Comments"], [280, 60, 30], "Infrastructure - GMA");

//   doughnutChart("earthquakeRelief1", ["Likes", "Reposts", "Comments"], [80, 30, 20], "Emergency Response - Typhoon Carina (Gov)");
//   doughnutChart("earthquakeRelief2", ["Likes", "Reposts", "Comments"], [120, 40, 15], "Emergency Response - Typhoon Carina (NGOs/Volunteers)");

//   pieChart("preparedness1", ["Posts", "Likes"], [60, 25], "Preparedness Post 1");
//   pieChart("preparedness2", ["Posts", "Likes"], [40, 35], "Preparedness Post 2");
};

async function loadRawData() {
    try {
        // Load ABS-CBN data
        const absCbnResponse = await fetch('jsonData/typhoonkardingabscbn.json');
        const absCbnData = await absCbnResponse.json();
        
        // Load GMA data
        const gmaResponse = await fetch('jsonData/typhoonkardinggma.json');
        const gmaData = await gmaResponse.json();

        // Initialize DataTables
        const tableConfig = {
            pageLength: 5,
            lengthMenu: [5, 10, 25, 50],
            responsive: true,
            language: {
                paginate: {
                    first: '«',
                    previous: '‹',
                    next: '›',
                    last: '»'
                },
                search: "Search:",
                lengthMenu: "Show _MENU_ entries"
            },
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rtip',
            columnDefs: [
                {
                    targets: 0, // Tweet # column
                    width: '10%'
                },
                {
                    targets: 1, // Content column
                    width: '40%'
                },
                {
                    targets: [2, 3, 4, 5], // Other columns
                    width: '12.5%'
                }
            ]
        };

        // Populate and initialize ABS-CBN table
        const absCbnTable = $('#absCbnTable').DataTable(tableConfig);
        absCbnData.forEach(tweet => {
            absCbnTable.row.add([
                tweet.tweet_count,
                tweet.text,
                new Date(tweet.created_at).toLocaleString(),
                tweet.likes_count,
                tweet.replies_count,
                tweet.reposts_count
            ]);
        });
        absCbnTable.draw();

        // Populate and initialize GMA table
        const gmaTable = $('#gmaTable').DataTable(tableConfig);
        gmaData.forEach(tweet => {
            gmaTable.row.add([
                tweet.tweet_count,
                tweet.text,
                new Date(tweet.created_at).toLocaleString(),
                tweet.likes_count,
                tweet.replies_count,
                tweet.reposts_count
            ]);
        });
        gmaTable.draw();

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function loadChartData() {
    try {
        // Load JSON data
        const absCbnResponse = await fetch('jsonData/typhoonkardingabscbn.json');
        const absCbnData = await absCbnResponse.json();
        
        const gmaResponse = await fetch('jsonData/typhoonkardinggma.json');
        const gmaData = await gmaResponse.json();

        // Calculate sums for ABS-CBN
        const absCbnStats = absCbnData.reduce((acc, tweet) => {
            acc.likes += tweet.likes_count;
            acc.reposts += tweet.reposts_count;
            acc.replies += tweet.replies_count;
            return acc;
        }, { likes: 0, reposts: 0, replies: 0 });

        // Calculate sums for GMA
        const gmaStats = gmaData.reduce((acc, tweet) => {
            acc.likes += tweet.likes_count;
            acc.reposts += tweet.reposts_count;
            acc.replies += tweet.replies_count;
            return acc;
        }, { likes: 0, reposts: 0, replies: 0 });

        // Create ABS-CBN Chart
        // ...existing code...

        // Create ABS-CBN Chart
        const absCbnCtx = document.getElementById('kardingAbsCbnChart').getContext('2d');
        new Chart(absCbnCtx, {
            type: 'doughnut',
            data: {
                labels: ['Likes', 'Reposts', 'Replies'],
                datasets: [{
                    data: [absCbnStats.likes, absCbnStats.reposts, absCbnStats.replies],
                    backgroundColor: ['#1da1f2', '#17bf63', '#e0245e'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Total Engagement Metrics - ABS-CBN'
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        // Create GMA Chart
        const gmaCtx = document.getElementById('kardingGmaChart').getContext('2d');
        new Chart(gmaCtx, {
            type: 'doughnut',
            data: {
                labels: ['Likes', 'Reposts', 'Replies'],
                datasets: [{
                    data: [gmaStats.likes, gmaStats.reposts, gmaStats.replies],
                    backgroundColor: ['#1da1f2', '#17bf63', '#e0245e'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Total Engagement Metrics - GMA'
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// ...existing code...
async function loadCarinaEmergencyCharts() {
    try {
        // Load government data
        const govResponse = await fetch('jsonData/typhooncarina_gov.json');
        const govData = await govResponse.json();

        // Load community data
        const commResponse = await fetch('jsonData/typhooncarina_community.json');
        const commData = await commResponse.json();

        // Find the government tweet with the highest likes_count
        let topGovTweetStats = { likes: 0, reposts: 0, replies: 0 };
        if (govData && govData.length > 0) {
            const topGovTweet = govData.reduce((maxTweet, currentTweet) => {
                return (currentTweet.likes_count || 0) > (maxTweet.likes_count || 0) ? currentTweet : maxTweet;
            }, govData[0]); // Initialize with the first tweet
            topGovTweetStats = {
                likes: topGovTweet.likes_count || 0,
                reposts: topGovTweet.reposts_count || 0,
                replies: topGovTweet.replies_count || 0
            };
        }

        // Find the community tweet with the highest likes_count
        let topCommTweetStats = { likes: 0, reposts: 0, replies: 0 };
        if (commData && commData.length > 0) {
            const topCommTweet = commData.reduce((maxTweet, currentTweet) => {
                return (currentTweet.likes_count || 0) > (maxTweet.likes_count || 0) ? currentTweet : maxTweet;
            }, commData[0]); // Initialize with the first tweet
            topCommTweetStats = {
                likes: topCommTweet.likes_count || 0,
                reposts: topCommTweet.reposts_count || 0,
                replies: topCommTweet.replies_count || 0
            };
        }

        // Create Government Chart (Top Post)
        const govCtx = document.getElementById('earthquakeRelief1').getContext('2d');
        new Chart(govCtx, {
            type: 'doughnut',
            data: {
                labels: ['Likes', 'Reposts', 'Replies'],
                datasets: [{
                    data: [topGovTweetStats.likes, topGovTweetStats.reposts, topGovTweetStats.replies],
                    backgroundColor: ['#1da1f2', '#17bf63', '#e0245e'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Top Government Post - Typhoon Carina'
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        // Create Community Chart (Top Post)
        const commCtx = document.getElementById('earthquakeRelief2').getContext('2d');
        new Chart(commCtx, {
            type: 'doughnut',
            data: {
                labels: ['Likes', 'Reposts', 'Replies'],
                datasets: [{
                    data: [topCommTweetStats.likes, topCommTweetStats.reposts, topCommTweetStats.replies],
                    backgroundColor: ['#1da1f2', '#17bf63', '#e0245e'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Top Community Post - Typhoon Carina'
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error loading Carina emergency charts:', error);
    }
}

async function loadHenryPreparednessCharts() {
    try {
        // Load government preparedness data for Typhoon Henry
        const govHenryResponse = await fetch('jsonData/typhoonHenry_gov.json');
        const govHenryData = await govHenryResponse.json();

        let topGovHenryTweetStats = { likes: 0, reposts: 0, replies: 0 };
        if (govHenryData && govHenryData.length > 0) {
            const topGovHenryTweet = govHenryData.reduce((maxTweet, currentTweet) => {
                return (currentTweet.likes_count || 0) > (maxTweet.likes_count || 0) ? currentTweet : maxTweet;
            }, govHenryData[0]); // Initialize with the first tweet
            topGovHenryTweetStats = {
                likes: topGovHenryTweet.likes_count || 0,
                reposts: topGovHenryTweet.reposts_count || 0,
                replies: topGovHenryTweet.replies_count || 0
            };
        }

        // Load community preparedness data for Typhoon Henry
        const commHenryResponse = await fetch('jsonData/typhoonHenry_community.json');
        const commHenryData = await commHenryResponse.json();

        let topCommHenryTweetStats = { likes: 0, reposts: 0, replies: 0 };
        if (commHenryData && commHenryData.length > 0) {
            const topCommHenryTweet = commHenryData.reduce((maxTweet, currentTweet) => {
                return (currentTweet.likes_count || 0) > (maxTweet.likes_count || 0) ? currentTweet : maxTweet;
            }, commHenryData[0]); // Initialize with the first tweet
            topCommHenryTweetStats = {
                likes: topCommHenryTweet.likes_count || 0,
                reposts: topCommHenryTweet.reposts_count || 0,
                replies: topCommHenryTweet.replies_count || 0
            };
        }

        // Create Government Preparedness Chart (Top Post)
        pieChart(
            "preparedness1",
            ["Likes", "Reposts", "Replies"],
            [topGovHenryTweetStats.likes, topGovHenryTweetStats.reposts, topGovHenryTweetStats.replies],
            "Top Government Post (Preparedness) - Typhoon Henry"
        );

        // Create Community Preparedness Chart (Top Post)
        pieChart(
            "preparedness2",
            ["Likes", "Reposts", "Replies"],
            [topCommHenryTweetStats.likes, topCommHenryTweetStats.reposts, topCommHenryTweetStats.replies],
            "Top Community Post (Preparedness) - Typhoon Henry"
        );

    } catch (error) {
        console.error('Error loading Typhoon Henry preparedness charts:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadCarinaEmergencyCharts);
document.addEventListener('DOMContentLoaded', loadHenryPreparednessCharts); // Added call for Henry charts
document.addEventListener('DOMContentLoaded', loadChartData);
document.addEventListener('DOMContentLoaded', loadRawData);