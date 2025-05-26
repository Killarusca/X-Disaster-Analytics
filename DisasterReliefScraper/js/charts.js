const doughnutChart = (id, labels, data, title) => {
  new Chart(document.getElementById(id), {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ["#1da1f2", "#17bf63", "#e0245e"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: title } },
    },
  });
};

const pieChart = (id, labels, data, title) => {
  new Chart(document.getElementById(id), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ["#794bc4", "#f45d22", "#ffad1f"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: title } },
    },
  });
};

const barChartSimple = (id, labels, data, title) => {
  new Chart(document.getElementById(id), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Number of Posts",
          data: data,
          backgroundColor: "#1da1f2",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: title },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
};

async function renderTyphoonHenryPostsChart() {
  try {
    const [communityRes, govRes] = await Promise.all([
      fetch("jsonData/typhoonHenry_community.json"),
      fetch("jsonData/typhoonHenry_gov.json"),
    ]);

    if (!communityRes.ok || !govRes.ok) {
      throw new Error("Failed to fetch JSON data");
    }

    const communityData = await communityRes.json();
    const govData = await govRes.json();

    const labels = ["Community", "Government"];
    const numberOfPosts = [communityData.length, govData.length];

    barChartSimple(
      "HenrySupportChart",
      labels,
      numberOfPosts,
      "Typhoon Henry Number of Posts"
    );
  } catch (error) {
    console.error("Error loading or processing chart data:", error);
  }
}

renderTyphoonHenryPostsChart();

window.onload = () => {
  //barChart("kardingSupportChart", ["Post 1", "Post 2", "Post 3"], [3, 5, 2], "Typhoon Karding Community Support");
  //barChart("earthquakeSupportChart", ["Post A", "Post B", "Post C"], [4, 2, 1], "Luzon Earthquake Community Support");
  //pieChart("infraAbsCbnChart",["Likes", "Reposts", "Comments"],[300, 50, 20],"Infrastructure - ABS-CBN");
  //pieChart("infraGmaChart",["Likes", "Reposts", "Comments"],[280, 60, 30],"Infrastructure - GMA");
  //   doughnutChart("earthquakeRelief1", ["Likes", "Reposts", "Comments"], [80, 30, 20], "Emergency Response - Typhoon Carina (Gov)");
  //   doughnutChart("earthquakeRelief2", ["Likes", "Reposts", "Comments"], [120, 40, 15], "Emergency Response - Typhoon Carina (NGOs/Volunteers)");
  //   pieChart("preparedness1", ["Posts", "Likes"], [60, 25], "Preparedness Post 1");
  //   pieChart("preparedness2", ["Posts", "Likes"], [40, 35], "Preparedness Post 2");
};

const calculateTotals = (data) => {
  let totalLikes = 0,
    totalReposts = 0,
    totalReplies = 0;

  data.forEach((post) => {
    totalLikes += post.likes_count ?? 0;
    totalReposts += post.reposts_count ?? 0;
    totalReplies += post.replies_count ?? 0;
  });

  return [totalLikes, totalReposts, totalReplies];
};

const renderPieCharts = async () => {
  try {
    const [gmaRes, abscbnRes] = await Promise.all([
      fetch("jsonData/typhoonHenry_gma.json"),
      fetch("jsonData/typhoonHenry_abscbn.json"),
    ]);

    const gmaData = await gmaRes.json();
    const abscbnData = await abscbnRes.json();

    const gmaTotals = calculateTotals(gmaData);
    const abscbnTotals = calculateTotals(abscbnData);

    const labels = ["Likes", "Reposts", "Replies"];

    pieChart("gma_chart", labels, gmaTotals, "Typhoon Henry - GMA Engagement");
    pieChart(
      "abscbn_chart",
      labels,
      abscbnTotals,
      "Typhoon Henry - ABS-CBN Engagement"
    );
  } catch (error) {
    console.error("Error loading JSON data or rendering charts:", error);
  }
};

renderPieCharts();

async function loadRawData() {
  try {
    // Load ABS-CBN data
    const absCbnResponse = await fetch("jsonData/typhoonkardingabscbn.json");
    const absCbnData = await absCbnResponse.json();

    // Load GMA data
    const gmaResponse = await fetch("jsonData/typhoonkardinggma.json");
    const gmaData = await gmaResponse.json();

    // Initialize DataTables
    const tableConfig = {
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      responsive: true,
      language: {
        paginate: {
          first: "«",
          previous: "‹",
          next: "›",
          last: "»",
        },
        search: "Search:",
        lengthMenu: "Show _MENU_ entries",
      },
      dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rtip',
      columnDefs: [
        {
          targets: 0, // Tweet # column
          width: "10%",
        },
        {
          targets: 1, // Content column
          width: "40%",
        },
        {
          targets: [2, 3, 4, 5], // Other columns
          width: "12.5%",
        },
      ],
    };

    // Populate and initialize ABS-CBN table
    const absCbnTable = $("#absCbnTable").DataTable(tableConfig);
    absCbnData.forEach((tweet) => {
      absCbnTable.row.add([
        tweet.tweet_count,
        tweet.text,
        new Date(tweet.created_at).toLocaleString(),
        tweet.likes_count,
        tweet.replies_count,
        tweet.reposts_count,
      ]);
    });
    absCbnTable.draw();

    // Populate and initialize GMA table
    const gmaTable = $("#gmaTable").DataTable(tableConfig);
    gmaData.forEach((tweet) => {
      gmaTable.row.add([
        tweet.tweet_count,
        tweet.text,
        new Date(tweet.created_at).toLocaleString(),
        tweet.likes_count,
        tweet.replies_count,
        tweet.reposts_count,
      ]);
    });
    gmaTable.draw();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

async function loadChartData() {
  try {
    // Load JSON data
    const absCbnResponse = await fetch("jsonData/typhoonkardingabscbn.json");
    const absCbnData = await absCbnResponse.json();

    const gmaResponse = await fetch("jsonData/typhoonkardinggma.json");
    const gmaData = await gmaResponse.json();

    // Calculate sums for ABS-CBN
    const absCbnStats = absCbnData.reduce(
      (acc, tweet) => {
        acc.likes += tweet.likes_count;
        acc.reposts += tweet.reposts_count;
        acc.replies += tweet.replies_count;
        return acc;
      },
      { likes: 0, reposts: 0, replies: 0 }
    );

    // Calculate sums for GMA
    const gmaStats = gmaData.reduce(
      (acc, tweet) => {
        acc.likes += tweet.likes_count;
        acc.reposts += tweet.reposts_count;
        acc.replies += tweet.replies_count;
        return acc;
      },
      { likes: 0, reposts: 0, replies: 0 }
    );

    // Create ABS-CBN Chart
    // ...existing code...

    // Create ABS-CBN Chart
    const absCbnCtx = document
      .getElementById("kardingAbsCbnChart")
      .getContext("2d");
    new Chart(absCbnCtx, {
      type: "doughnut",
      data: {
        labels: ["Likes", "Reposts", "Replies"],
        datasets: [
          {
            data: [absCbnStats.likes, absCbnStats.reposts, absCbnStats.replies],
            backgroundColor: ["#1da1f2", "#17bf63", "#e0245e"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Total Engagement Metrics - ABS-CBN",
          },
          legend: {
            position: "top",
          },
        },
      },
    });

    // Create GMA Chart
    const gmaCtx = document.getElementById("kardingGmaChart").getContext("2d");
    new Chart(gmaCtx, {
      type: "doughnut",
      data: {
        labels: ["Likes", "Reposts", "Replies"],
        datasets: [
          {
            data: [gmaStats.likes, gmaStats.reposts, gmaStats.replies],
            backgroundColor: ["#1da1f2", "#17bf63", "#e0245e"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Total Engagement Metrics - GMA",
          },
          legend: {
            position: "top",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error loading chart data:", error);
  }
}

// ...existing code...
async function loadCarinaEmergencyCharts() {
  try {
    // Load government data
    const govResponse = await fetch("jsonData/typhooncarina_gov.json");
    const govData = await govResponse.json();

    // Load community data
    const commResponse = await fetch("jsonData/typhooncarina_community.json");
    const commData = await commResponse.json();

    // Find the government tweet with the highest likes_count
    let topGovTweetStats = { likes: 0, reposts: 0, replies: 0 };
    if (govData && govData.length > 0) {
      const topGovTweet = govData.reduce((maxTweet, currentTweet) => {
        return (currentTweet.likes_count || 0) > (maxTweet.likes_count || 0)
          ? currentTweet
          : maxTweet;
      }, govData[0]); // Initialize with the first tweet
      topGovTweetStats = {
        likes: topGovTweet.likes_count || 0,
        reposts: topGovTweet.reposts_count || 0,
        replies: topGovTweet.replies_count || 0,
      };
    }

    // Find the community tweet with the highest likes_count
    let topCommTweetStats = { likes: 0, reposts: 0, replies: 0 };
    if (commData && commData.length > 0) {
      const topCommTweet = commData.reduce((maxTweet, currentTweet) => {
        return (currentTweet.likes_count || 0) > (maxTweet.likes_count || 0)
          ? currentTweet
          : maxTweet;
      }, commData[0]); // Initialize with the first tweet
      topCommTweetStats = {
        likes: topCommTweet.likes_count || 0,
        reposts: topCommTweet.reposts_count || 0,
        replies: topCommTweet.replies_count || 0,
      };
    }

    // Create Government Chart (Top Post)
    doughnutChart(
      "earthquakeRelief1", // ID for the government chart canvas
      ["Likes", "Reposts", "Replies"],
      [
        topGovTweetStats.likes,
        topGovTweetStats.reposts,
        topGovTweetStats.replies,
      ],
      "Top Government Post - Typhoon Carina"
    );

    // Create Community Chart (Top Post)
    doughnutChart(
      "earthquakeRelief2", // ID for the community chart canvas
      ["Likes", "Reposts", "Replies"],
      [
        topCommTweetStats.likes,
        topCommTweetStats.reposts,
        topCommTweetStats.replies,
      ],
      "Top Community Post - Typhoon Carina"
    );

    // Initialize DataTables for Carina Emergency Data
    const tableConfigCarina = {
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      responsive: true,
      language: {
        paginate: {
          first: "«",
          previous: "‹",
          next: "›",
          last: "»",
        },
        search: "Search:",
        lengthMenu: "Show _MENU_ entries",
      },
      dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rtip',
      columnDefs: [
        { targets: 0, title: "User", width: "15%" },
        { targets: 1, title: "Tweet Content", width: "40%" },
        { targets: 2, title: "Date", width: "15%" },
        { targets: 3, title: "Likes", width: "10%" },
        { targets: 4, title: "Replies", width: "10%" },
        { targets: 5, title: "Reposts", width: "10%" },
      ],
    };

    // Populate and initialize Carina Government Emergency table
    if ($.fn.DataTable.isDataTable('#carinaGovEmergencyTable')) {
        $('#carinaGovEmergencyTable').DataTable().destroy();
    }
    const carinaGovTable = $("#carinaGovEmergencyTable").DataTable(tableConfigCarina);
    if (govData && govData.length > 0) {
        govData.forEach((tweet) => {
            carinaGovTable.row.add([
                tweet.user_name || "N/A",
                tweet.text || "N/A",
                tweet.created_at ? new Date(tweet.created_at).toLocaleString() : "N/A",
                tweet.likes_count || 0,
                tweet.replies_count || 0,
                tweet.reposts_count || 0,
            ]);
        });
        carinaGovTable.draw();
    } else {
        carinaGovTable.clear().draw();
    }

    // Populate and initialize Carina Community Emergency table
    if ($.fn.DataTable.isDataTable('#carinaCommEmergencyTable')) {
        $('#carinaCommEmergencyTable').DataTable().destroy();
    }
    const carinaCommTable = $("#carinaCommEmergencyTable").DataTable(tableConfigCarina);
    if (commData && commData.length > 0) {
        commData.forEach((tweet) => {
            carinaCommTable.row.add([
                tweet.user_name || "N/A",
                tweet.text || "N/A",
                tweet.created_at ? new Date(tweet.created_at).toLocaleString() : "N/A",
                tweet.likes_count || 0,
                tweet.replies_count || 0,
                tweet.reposts_count || 0,
            ]);
        });
        carinaCommTable.draw();
    } else {
        carinaCommTable.clear().draw();
    }

  } catch (error) {
    console.error("Error loading Carina emergency charts or tables:", error);
  }
}
// ...existing code...

// ...existing code...
async function loadHenryPreparednessCharts() {
  try {
    // Load government preparedness data for Typhoon Henry
    const govHenryResponse = await fetch("jsonData/typhoonHenry_gov.json");
    const govHenryData = await govHenryResponse.json();

    let topGovHenryTweetStats = { likes: 0, reposts: 0, replies: 0 };
    if (govHenryData && govHenryData.length > 0) {
      const topGovHenryTweet = govHenryData.reduce((maxTweet, currentTweet) => {
        return (currentTweet.likes_count || 0) > (maxTweet.likes_count || 0)
          ? currentTweet
          : maxTweet;
      }, govHenryData[0]); // Initialize with the first tweet
      topGovHenryTweetStats = {
        likes: topGovHenryTweet.likes_count || 0,
        reposts: topGovHenryTweet.reposts_count || 0,
        replies: topGovHenryTweet.replies_count || 0,
      };
    }

    // Load community preparedness data for Typhoon Henry
    const commHenryResponse = await fetch(
      "jsonData/typhoonHenry_community.json"
    );
    const commHenryData = await commHenryResponse.json();

    let topCommHenryTweetStats = { likes: 0, reposts: 0, replies: 0 };
    if (commHenryData && commHenryData.length > 0) {
      const topCommHenryTweet = commHenryData.reduce(
        (maxTweet, currentTweet) => {
          return (currentTweet.likes_count || 0) > (maxTweet.likes_count || 0)
            ? currentTweet
            : maxTweet;
        },
        commHenryData[0]
      ); // Initialize with the first tweet
      topCommHenryTweetStats = {
        likes: topCommHenryTweet.likes_count || 0,
        reposts: topCommHenryTweet.reposts_count || 0,
        replies: topCommHenryTweet.replies_count || 0,
      };
    }

    // Create Government Preparedness Chart (Top Post)
    pieChart(
      "preparedness1",
      ["Likes", "Reposts", "Replies"],
      [
        topGovHenryTweetStats.likes,
        topGovHenryTweetStats.reposts,
        topGovHenryTweetStats.replies,
      ],
      "Top Government Post (Preparedness) - Typhoon Henry"
    );

    // Create Community Preparedness Chart (Top Post)
    pieChart(
      "preparedness2",
      ["Likes", "Reposts", "Replies"],
      [
        topCommHenryTweetStats.likes,
        topCommHenryTweetStats.reposts,
        topCommHenryTweetStats.replies,
      ],
      "Top Community Post (Preparedness) - Typhoon Henry"
    );

    // Initialize DataTables for Henry Preparedness Data
    // Configuration similar to loadRawData
    const tableConfigHenry = {
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      responsive: true,
      language: {
        paginate: {
          first: "«",
          previous: "‹",
          next: "›",
          last: "»",
        },
        search: "Search:",
        lengthMenu: "Show _MENU_ entries",
      },
      dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rtip',
      // Adjust columnDefs based on the actual data structure of typhoonHenry_*.json
      // Assuming user_name, text, created_at, likes_count, replies_count, reposts_count
      columnDefs: [
        { targets: 0, title: "User", width: "15%" }, // User
        { targets: 1, title: "Tweet Content", width: "40%" }, // Tweet Content
        { targets: 2, title: "Date", width: "15%" }, // Date
        { targets: 3, title: "Likes", width: "10%" }, // Likes
        { targets: 4, title: "Replies", width: "10%" }, // Replies
        { targets: 5, title: "Reposts", width: "10%" }, // Reposts
      ],
    };

    // Populate and initialize Henry Government Preparedness table
    if ($.fn.DataTable.isDataTable('#henryGovPreparednessTable')) {
        $('#henryGovPreparednessTable').DataTable().destroy();
    }
    const henryGovTable = $("#henryGovPreparednessTable").DataTable(tableConfigHenry);
    if (govHenryData && govHenryData.length > 0) {
        govHenryData.forEach((tweet) => {
            henryGovTable.row.add([
                tweet.user_name || "N/A",
                tweet.text || "N/A",
                tweet.created_at ? new Date(tweet.created_at).toLocaleString() : "N/A",
                tweet.likes_count || 0,
                tweet.replies_count || 0,
                tweet.reposts_count || 0,
            ]);
        });
        henryGovTable.draw();
    } else {
        // Optionally, display a message if no data
        henryGovTable.clear().draw();
        // henryGovTable.row.add(["No data available", "", "", "", "", ""]).draw();
    }

    // Populate and initialize Henry Community Preparedness table
    if ($.fn.DataTable.isDataTable('#henryCommPreparednessTable')) {
        $('#henryCommPreparednessTable').DataTable().destroy();
    }
    const henryCommTable = $("#henryCommPreparednessTable").DataTable(tableConfigHenry);
    if (commHenryData && commHenryData.length > 0) {
        commHenryData.forEach((tweet) => {
            henryCommTable.row.add([
                tweet.user_name || "N/A",
                tweet.text || "N/A",
                tweet.created_at ? new Date(tweet.created_at).toLocaleString() : "N/A",
                tweet.likes_count || 0,
                tweet.replies_count || 0,
                tweet.reposts_count || 0,
            ]);
        });
        henryCommTable.draw();
    } else {
        // Optionally, display a message if no data
        henryCommTable.clear().draw();
        // henryCommTable.row.add(["No data available", "", "", "", "", ""]).draw();
    }

  } catch (error) {
    console.error("Error loading Typhoon Henry preparedness charts or tables:", error);
  }
}
// ...existing code...

document.addEventListener("DOMContentLoaded", loadCarinaEmergencyCharts);
document.addEventListener("DOMContentLoaded", loadHenryPreparednessCharts); // Added call for Henry charts
document.addEventListener("DOMContentLoaded", loadChartData);
document.addEventListener("DOMContentLoaded", loadRawData);
