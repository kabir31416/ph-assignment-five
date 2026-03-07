let currentTab = "all";

let allIssues = [];

function changeTab(tab) {
  currentTab = tab;

  document.querySelectorAll(".tab").forEach(t => {
    t.classList.remove("tab-active", "btn-primary");
  });

  if (tab === "all") {
    tabAll.classList.add("tab-active", "btn-primary");
  }
  if (tab === "open") {
    tabOpen.classList.add("tab-active", "btn-primary");
  }
  if (tab === "closed") {
    tabClosed.classList.add("tab-active", "btn-primary");
  }

  displayFilteredIssues();
}

const loadIssues = () => {
  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(json => displayFilteredIssues(allIssues = json.data));
};

const displayFilteredIssues = () => {
  let filteredIssues = [];

  if (currentTab === "all") {
    filteredIssues = allIssues;
  } else {
    filteredIssues = allIssues.filter(issue => issue.status === currentTab);
  }

  displayIssues(filteredIssues);
  totalIssues.innerText = filteredIssues.length;
};

displayIssues = (issues) => {

    const issueContainer = document.getElementById("issueContainer");
    issueContainer.innerHTML = "";

    issues.forEach(issue => {
        const issueElement = document.createElement("div");

        issueElement.innerHTML = `
            <div class="max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-full">
                
                ${issue.status.toLowerCase() === "open" 
                                    ? `<div class="h-1.5 bg-emerald-500 w-full"></div>` 
                                    : `<div class="h-1.5 bg-purple-500 w-full"></div>`
                                }

                        <div class="p-5">
                            <div class="flex justify-between items-center mb-4">
                                ${issue.status.toLowerCase() === "open" 
                                    ? `<img class="h-10 w-10" src="./assets/Open-Status.png" alt="">` 
                                    : `<img class="h-10 w-10" src="./assets/Closed-Status.png" alt="">`
                                }

                                <span class="bg-red-50 text-red-500 text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">
                                    ${issue.priority}
                                </span>
                            </div>

                            <h2 class="text-slate-800 font-bold text-xl mb-2">${issue.title}</h2>
                            <p class="text-slate-500 text-sm leading-relaxed mb-6">
                            ${issue.description}
                            </p>

                            <div class="flex flex-wrap gap-3 mb-6">
                                    ${issue.labels.map(label => {
                                        const colors = {
                                            "bug": "bg-red-50 border-red-100 text-red-500",
                                            "help wanted": "bg-orange-50 border-orange-100 text-orange-600",
                                            "enhancement": "bg-green-50 border-green-100 text-green-600",
                                            "question": "bg-blue-50 border-blue-100 text-blue-600"
                                        };
                                        const setColor = colors[label.toLowerCase()] || "bg-gray-50 border-gray-100 text-gray-500";

                                        return `
                                            <div class="flex items-center gap-1.5 ${setColor} border px-3 py-1.5 rounded-full text-xs font-semibold uppercase">
                                            ${label}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>

                            <div class="border-t border-slate-100 pt-4 mt-4">
                            <p class="text-slate-500 text-sm font-medium">#${issue.id} ${issue.author}</p>
                            <p class="text-slate-400 text-sm mt-1">${issue.date}</p>
                        </div>
                    </div>
            </div>
        `;

    
        issueContainer.appendChild(issueElement);
    });
};

function updateCounts() {
  totalIssues.innerText =   issues.length;
  openIssues.innerText = issues.filter(i => i.status === "Open").length;
  closedIssues.innerText = issues.filter(i => i.status === "Closed").length;
}

loadIssues();