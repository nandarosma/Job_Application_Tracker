let jobs =
  JSON.parse(
    localStorage.getItem("jobs")
  ) || [];

let chart = null;

function saveJobs() {
  localStorage.setItem(
    "jobs",
    JSON.stringify(jobs)
  );
}

function addJob() {

  const company =
    document
      .getElementById("company")
      .value.trim();

  const position =
    document
      .getElementById("position")
      .value.trim();

  const date =
    document
      .getElementById("date")
      .value;

  const status =
    document
      .getElementById("status")
      .value;

  if (!company || !position || !date) {
    alert("Please fill all fields.");
    return;
  }

  jobs.unshift({
    id: Date.now(),
    company,
    position,
    date,
    status
  });

  saveJobs();
  renderJobs();

  document.getElementById("company").value="";
  document.getElementById("position").value="";
  document.getElementById("date").value="";
}

function deleteJob(id){

  if(!confirm("Delete this application?")) return;

  jobs =
    jobs.filter(
      job=>job.id!==id
    );

  saveJobs();
  renderJobs();
}

function editJob(id){

  const job =
    jobs.find(
      item=>item.id===id
    );

  const newStatus =
    prompt(
      "Applied | Interview | Rejected | Accepted",
      job.status
    );

  if(!newStatus) return;

  job.status =
    newStatus;

  saveJobs();
  renderJobs();
}

function clearAllJobs(){

  if(!confirm("Delete all applications?")) return;

  jobs=[];

  saveJobs();
  renderJobs();
}

function renderJobs(){

  const list =
    document.getElementById("jobList");

  const search =
    document
      .getElementById("search")
      .value
      .toLowerCase();

  const filter =
    document
      .getElementById("filter")
      .value;

  let filtered =
    jobs.filter(job=>

      job.company
        .toLowerCase()
        .includes(search)

    );

  if(filter!=="All"){

    filtered =
      filtered.filter(
        job=>job.status===filter
      );
  }

  if(filtered.length===0){

    list.innerHTML=`

      <div class="empty-state">

        📂

        <p>No applications found</p>

      </div>
    `;

    updateDashboard();
    return;
  }

  list.innerHTML="";

  filtered.forEach(job=>{

    const classes={

      Applied:"status-applied",
      Interview:"status-interview",
      Rejected:"status-rejected",
      Accepted:"status-accepted"
    };

    list.innerHTML += `

      <div class="job-card">

        <div>

          <h3 class="job-company">
            ${job.company}
          </h3>

          <p class="job-position">
            ${job.position}
          </p>

          <small class="job-date">
            ${job.date}
          </small>

        </div>

        <div class="job-actions">

          <span class="status ${classes[job.status]}">
            ${job.status}
          </span>

          <button
            class="btn-edit"
            onclick="editJob(${job.id})"
          >
            Edit
          </button>

          <button
            class="btn-delete"
            onclick="deleteJob(${job.id})"
          >
            Delete
          </button>

        </div>

      </div>
    `;
  });

  updateDashboard();
}

function updateDashboard(){

  const counts={
    Applied:0,
    Interview:0,
    Rejected:0,
    Accepted:0
  };

  jobs.forEach(job=>{
    counts[job.status]++;
  });

  document.getElementById("total").textContent=jobs.length;
  document.getElementById("interview").textContent=counts.Interview;
  document.getElementById("rejected").textContent=counts.Rejected;
  document.getElementById("accepted").textContent=counts.Accepted;

  document.getElementById(
    "interviewRate"
  ).textContent =
    jobs.length
      ? ((counts.Interview/jobs.length)*100).toFixed(1)+"%"
      : "0%";

  document.getElementById(
    "acceptanceRate"
  ).textContent =
    jobs.length
      ? ((counts.Accepted/jobs.length)*100).toFixed(1)+"%"
      : "0%";

  renderChart(counts);
}

function renderChart(counts){

  const ctx =
    document.getElementById("chart");

  if(chart) chart.destroy();

  chart =
    new Chart(ctx,{

      type:"doughnut",

      data:{
        labels:[
          "Applied",
          "Interview",
          "Rejected",
          "Accepted"
        ],

        datasets:[{

          data:[
            counts.Applied,
            counts.Interview,
            counts.Rejected,
            counts.Accepted
          ],

          backgroundColor:[
            "#3b82f6",
            "#eab308",
            "#ef4444",
            "#22c55e"
          ],

          borderWidth:0
        }]
      }
    });
}

document
  .getElementById("search")
  .addEventListener(
    "input",
    renderJobs
  );

document
  .getElementById("filter")
  .addEventListener(
    "change",
    renderJobs
  );

document
  .getElementById("toggleDark")
  .addEventListener(
    "click",
    ()=>{

      document.body
        .classList.toggle("dark");

      localStorage.setItem(
        "theme",
        document.body
          .classList
          .contains("dark")
      );
    }
  );

if(
  localStorage.getItem("theme")
  === "true"
){
  document.body
    .classList.add("dark");
}

renderJobs();