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

async function loadCommunityDataToTable() {
  try {
    const response = await fetch("jsonData/typhoonHenry_community.json");

    if (!response.ok) {
      throw new Error("Failed to fetch community data");
    }

    const data = await response.json();
    const tableBody = document.querySelector("#communityTable tbody");

    // Clear table body
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${item.text}</td>
          <td>${item.created_at}</td>
          <td>${item.likes_count}</td>
          <td>${item.replies_count}</td>
          <td>${item.reposts_count}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    // Destroy and reinitialize DataTable
    if ($.fn.DataTable.isDataTable("#communityTable")) {
      $("#communityTable").DataTable().clear().destroy();
    }

    $("#communityTable").DataTable({
      responsive: true,
      pageLength: 5,
      lengthChange: false,
    });
  } catch (error) {
    console.error("Error loading community data:", error);
  }
}

// Optional: Run on page load
document.addEventListener("DOMContentLoaded", loadCommunityDataToTable);

// Or load on accordion open:
// document.getElementById("collapseCommunity")
//   .addEventListener("show.bs.collapse", loadCommunityDataToTable);

async function loadGovDataToTable() {
  try {
    const response = await fetch("jsonData/typhoonHenry_gov.json");

    if (!response.ok) {
      throw new Error("Failed to fetch government data");
    }

    const data = await response.json();
    const tableBody = document.querySelector("#govTable tbody");

    // Clear previous table body content
    tableBody.innerHTML = "";

    data.forEach((item) => {
      const row = `
        <tr>
          <td>${item.tweet_count + 1}</td>
          <td>${item.text}</td>
          <td>${item.created_at}</td>
          <td>${item.likes_count}</td>
          <td>${item.replies_count}</td>
          <td>${item.reposts_count}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    // Destroy and reinitialize DataTable
    if ($.fn.DataTable.isDataTable("#govTable")) {
      $("#govTable").DataTable().clear().destroy();
    }

    $("#govTable").DataTable({
      responsive: true,
      pageLength: 5,
      lengthChange: false,
    });
  } catch (error) {
    console.error("Error loading government data:", error);
  }
}

// Optional: Load on accordion open
// document.getElementById("collapseGov")
//   .addEventListener("show.bs.collapse", loadGovDataToTable);

// Or run on page load
document.addEventListener("DOMContentLoaded", loadGovDataToTable);

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

    if (!gmaRes.ok || !abscbnRes.ok) {
      throw new Error(
        `HTTP error! GMA status: ${gmaRes.status}, ABS-CBN status: ${abscbnRes.status}`
      );
    }

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

    // Initialize DataTables for Henry Infrastructure Data
    const tableConfigHenryInfra = {
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

    // Populate and initialize Henry ABS-CBN Infrastructure table
    if ($.fn.DataTable.isDataTable("#henryAbsCbnInfraTable")) {
      $("#henryAbsCbnInfraTable").DataTable().destroy();
    }
    const henryAbsCbnInfraTable = $("#henryAbsCbnInfraTable").DataTable(
      tableConfigHenryInfra
    );
    if (abscbnData && abscbnData.length > 0) {
      abscbnData.forEach((tweet) => {
        henryAbsCbnInfraTable.row.add([
          tweet.user_name || "N/A",
          tweet.text || "N/A",
          tweet.created_at
            ? new Date(tweet.created_at).toLocaleString()
            : "N/A",
          tweet.likes_count || 0,
          tweet.replies_count || 0,
          tweet.reposts_count || 0,
        ]);
      });
      henryAbsCbnInfraTable.draw();
    } else {
      henryAbsCbnInfraTable.clear().draw();
    }

    // Populate and initialize Henry GMA Infrastructure table
    if ($.fn.DataTable.isDataTable("#henryGmaInfraTable")) {
      $("#henryGmaInfraTable").DataTable().destroy();
    }
    const henryGmaInfraTable = $("#henryGmaInfraTable").DataTable(
      tableConfigHenryInfra
    );
    if (gmaData && gmaData.length > 0) {
      gmaData.forEach((tweet) => {
        henryGmaInfraTable.row.add([
          tweet.user_name || "N/A",
          tweet.text || "N/A",
          tweet.created_at
            ? new Date(tweet.created_at).toLocaleString()
            : "N/A",
          tweet.likes_count || 0,
          tweet.replies_count || 0,
          tweet.reposts_count || 0,
        ]);
      });
      henryGmaInfraTable.draw();
    } else {
      henryGmaInfraTable.clear().draw();
    }
  } catch (error) {
    console.error(
      "Error loading Henry infrastructure JSON data or rendering charts/tables:",
      error
    );
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
    // Load community data
    const commResponse = await fetch("jsonData/typhooncarina_community.json");
    if (!commResponse.ok) {
      throw new Error(
        `HTTP error! Status: ${commResponse.status} for typhooncarina_community.json`
      );
    }
    const commData = await commResponse.json();

    const pleaKeywords = [
      "rescueph",
      "need rescue",
      "stuck",
      "trapped",
      "help please",
      "urgent help",
    ];
    const orgInfoAidKeywords = [
      "donation drive",
      "hotline",
      "emergency contact",
      "relief operation",
      "call for donations",
      "safety advisory",
      "emergency hotlines",
    ];

    let topPleaPostStats = { likes: 0, reposts: 0, replies: 0 };
    let pleaPostsData = [];
    let topOrgInfoAidPostStats = { likes: 0, reposts: 0, replies: 0 };
    let orgInfoAidPostsData = [];

    if (commData && commData.length > 0) {
      commData.forEach((tweet) => {
        const tweetTextLower = tweet.text ? tweet.text.toLowerCase() : "";
        let isPlea = pleaKeywords.some((keyword) =>
          tweetTextLower.includes(keyword)
        );
        let isOrgInfoAid = orgInfoAidKeywords.some((keyword) =>
          tweetTextLower.includes(keyword)
        );

        if (isPlea) {
          pleaPostsData.push(tweet);
          if ((tweet.likes_count || 0) > topPleaPostStats.likes) {
            topPleaPostStats = {
              likes: tweet.likes_count || 0,
              reposts: tweet.reposts_count || 0,
              replies: tweet.replies_count || 0,
            };
          }
        } else if (isOrgInfoAid) {
          // Categorize as org/info/aid if not primarily a plea
          orgInfoAidPostsData.push(tweet);
          if ((tweet.likes_count || 0) > topOrgInfoAidPostStats.likes) {
            topOrgInfoAidPostStats = {
              likes: tweet.likes_count || 0,
              reposts: tweet.reposts_count || 0,
              replies: tweet.replies_count || 0,
            };
          }
        }
      });
    }

    // Create Chart for Top Urgent Plea/Rescue Call
    doughnutChart(
      "earthquakeRelief1",
      ["Likes", "Reposts", "Replies"],
      [
        topPleaPostStats.likes,
        topPleaPostStats.reposts,
        topPleaPostStats.replies,
      ],
      "Top Urgent Community Plea/Rescue Call - Typhoon Carina"
    );

    // Create Chart for Top Organized Community Info/Aid Post
    doughnutChart(
      "earthquakeRelief2",
      ["Likes", "Reposts", "Replies"],
      [
        topOrgInfoAidPostStats.likes,
        topOrgInfoAidPostStats.reposts,
        topOrgInfoAidPostStats.replies,
      ],
      "Top Organized Community Info/Aid Post - Typhoon Carina"
    );

    const tableConfigCarina = {
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      responsive: true,
      language: {
        paginate: { first: "«", previous: "‹", next: "›", last: "»" },
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

    // Populate and initialize Carina Urgent Pleas table (formerly gov table)
    if ($.fn.DataTable.isDataTable("#carinaPleaTable")) {
      // Ensure HTML ID is updated
      $("#carinaPleaTable").DataTable().destroy();
    }
    const carinaPleaTable = $("#carinaPleaTable").DataTable(tableConfigCarina);
    if (pleaPostsData.length > 0) {
      pleaPostsData.forEach((tweet) => {
        carinaPleaTable.row.add([
          tweet.user_name || "N/A",
          tweet.text || "N/A",
          tweet.created_at
            ? new Date(tweet.created_at).toLocaleString()
            : "N/A",
          tweet.likes_count || 0,
          tweet.replies_count || 0,
          tweet.reposts_count || 0,
        ]);
      });
      carinaPleaTable.draw();
    } else {
      carinaPleaTable.clear().draw();
    }

    // Populate and initialize Carina Organized Info/Aid table (formerly community table)
    if ($.fn.DataTable.isDataTable("#carinaOrgInfoAidTable")) {
      // Ensure HTML ID is updated
      $("#carinaOrgInfoAidTable").DataTable().destroy();
    }
    const carinaOrgInfoAidTable = $("#carinaOrgInfoAidTable").DataTable(
      tableConfigCarina
    );
    if (orgInfoAidPostsData.length > 0) {
      orgInfoAidPostsData.forEach((tweet) => {
        carinaOrgInfoAidTable.row.add([
          tweet.user_name || "N/A",
          tweet.text || "N/A",
          tweet.created_at
            ? new Date(tweet.created_at).toLocaleString()
            : "N/A",
          tweet.likes_count || 0,
          tweet.replies_count || 0,
          tweet.reposts_count || 0,
        ]);
      });
      carinaOrgInfoAidTable.draw();
    } else {
      carinaOrgInfoAidTable.clear().draw();
    }
  } catch (error) {
    console.error("Error loading Carina emergency charts or tables:", error);
  }
}
// ...existing code...

// ...existing code...
async function loadKristinePreparednessCharts() {
  try {
    const guidanceKristineResponse = await fetch(
      "jsonData/typhoonKristine_guidance.json"
    );
    const guidanceKristineData = await guidanceKristineResponse.json();

    const actionKristineResponse = await fetch(
      "jsonData/typhoonKristine_action.json"
    );
    const actionKristineData = await actionKristineResponse.json();

    // Data is now pre-categorized by the JSON files.
    // earlyWarningPostsForTable will be guidanceKristineData
    // resourceMobilizationPostsForTable will be actionKristineData

    let topEarlyWarningPost = null;
    let topResourcePost = null;

    // Find the top early warning/guidance post from guidanceKristineData
    if (guidanceKristineData && guidanceKristineData.length > 0) {
      guidanceKristineData.forEach((tweet) => {
        const likes = tweet.likes_count || 0;
        if (
          !topEarlyWarningPost ||
          likes > (topEarlyWarningPost.likes_count || 0)
        ) {
          topEarlyWarningPost = tweet;
        }
      });
    }

    // Find the top resource/action mobilization post from actionKristineData
    if (actionKristineData && actionKristineData.length > 0) {
      actionKristineData.forEach((tweet) => {
        const likes = tweet.likes_count || 0;
        if (!topResourcePost || likes > (topResourcePost.likes_count || 0)) {
          topResourcePost = tweet;
        }
      });
    }

    const topEarlyWarningStats = topEarlyWarningPost
      ? {
          likes: topEarlyWarningPost.likes_count || 0,
          reposts: topEarlyWarningPost.reposts_count || 0,
          replies: topEarlyWarningPost.replies_count || 0,
        }
      : { likes: 0, reposts: 0, replies: 0 };

    const topResourceStats = topResourcePost
      ? {
          likes: topResourcePost.likes_count || 0,
          reposts: topResourcePost.reposts_count || 0,
          replies: topResourcePost.replies_count || 0,
        }
      : { likes: 0, reposts: 0, replies: 0 };

    pieChart(
      "preparedness1", // Assuming this canvas ID is generic for the first preparedness chart
      ["Likes", "Reposts", "Replies"],
      [
        topEarlyWarningStats.likes,
        topEarlyWarningStats.reposts,
        topEarlyWarningStats.replies,
      ],
      "Top Early Warning & Guidance Post - Typhoon Kristine" // Updated Title
    );

    pieChart(
      "preparedness2", // Assuming this canvas ID is generic for the second preparedness chart
      ["Likes", "Reposts", "Replies"],
      [
        topResourceStats.likes,
        topResourceStats.reposts,
        topResourceStats.replies,
      ],
      "Top Resource & Action Mobilization Post - Typhoon Kristine" // Updated Title
    );

    const tableConfigKristine = {
      // Renamed table config variable
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      responsive: true,
      language: {
        paginate: { first: "«", previous: "‹", next: "›", last: "»" },
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

    // Populate and initialize Kristine Early Warning & Guidance table
    // Uses guidanceKristineData directly
    if ($.fn.DataTable.isDataTable("#kristineEarlyWarningTable")) {
      $("#kristineEarlyWarningTable").DataTable().destroy();
    }
    const kristineEarlyWarningTable = $("#kristineEarlyWarningTable").DataTable(
      tableConfigKristine
    );
    if (guidanceKristineData && guidanceKristineData.length > 0) {
      guidanceKristineData.forEach((tweet) => {
        kristineEarlyWarningTable.row.add([
          tweet.user_name || "N/A",
          tweet.text || "N/A",
          tweet.created_at
            ? new Date(tweet.created_at).toLocaleString()
            : "N/A",
          tweet.likes_count || 0,
          tweet.replies_count || 0,
          tweet.reposts_count || 0,
        ]);
      });
      kristineEarlyWarningTable.draw();
    } else {
      kristineEarlyWarningTable.clear().draw();
    }

    // Populate and initialize Kristine Resource & Action Mobilization table
    // Uses actionKristineData directly
    if ($.fn.DataTable.isDataTable("#kristineResourceMobilizationTable")) {
      $("#kristineResourceMobilizationTable").DataTable().destroy();
    }
    const kristineResourceMobilizationTable = $(
      "#kristineResourceMobilizationTable"
    ).DataTable(tableConfigKristine);
    if (actionKristineData && actionKristineData.length > 0) {
      actionKristineData.forEach((tweet) => {
        kristineResourceMobilizationTable.row.add([
          tweet.user_name || "N/A",
          tweet.text || "N/A",
          tweet.created_at
            ? new Date(tweet.created_at).toLocaleString()
            : "N/A",
          tweet.likes_count || 0,
          tweet.replies_count || 0,
          tweet.reposts_count || 0,
        ]);
      });
      kristineResourceMobilizationTable.draw();
    } else {
      kristineResourceMobilizationTable.clear().draw();
    }
  } catch (error) {
    console.error(
      "Error loading Typhoon Kristine preparedness charts or tables:",
      error
    ); // Updated error message
  }
}
// ...existing code...

document.addEventListener("DOMContentLoaded", loadCarinaEmergencyCharts);
document.addEventListener("DOMContentLoaded", loadKristinePreparednessCharts);
document.addEventListener("DOMContentLoaded", loadChartData);
document.addEventListener("DOMContentLoaded", loadRawData);
