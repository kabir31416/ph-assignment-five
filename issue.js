let currentTab = "all";

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

let allIssues = [];

const loadIssues = () => {
    const spinner = document.getElementById("loading-spinner");
    const container = document.getElementById("issue-container");

    spinner.classList.remove("hidden");
    spinner.classList.add("flex");
    
    if(container) container.innerHTML = "";

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(json => {

            setTimeout(() => {
                allIssues = json.data;
                displayFilteredIssues(allIssues);
            
                spinner.classList.add("hidden");
            }, 1000); 
        })
        .catch(err => {
            console.error(err);
            spinner.classList.add("hidden");  
        });
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

        const newTime = new Date(issue.createdAt).toLocaleDateString();

        const newAuthor = issue.author
          .split("_").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");

        let borderColor = "border border-gray-200";
        if (issue.status.toLowerCase() === "open" ) borderColor = "border-[#00A96E]";
        if (issue.status.toLowerCase() === "closed" ) borderColor = "border-[#A855F7]";

        issueElement.innerHTML = `
            <div class="max-w-sm bg-white border-t-3 ${borderColor} rounded-xl shadow-sm h-full" onclick="openModal(${issue.id})">

                        <div class="p-5">
                            <div class="flex justify-between items-center mb-4">
                                ${issue.status.toLowerCase() === "open" 
                                    ? `<img class="h-8 w-8" src="./assets/Open-Status.png" alt="">` 
                                    : `<img class="h-8 w-8" src="./assets/Closed-Status.png" alt="">`
                                }


                                ${issue.priority.toLowerCase() === "high"
                                    ? `<span class="bg-green-100 text-green-500 text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">${issue.priority}
                                </span>` 
                                    : issue.priority.toLowerCase() === "medium"
                                        ? `<span class="bg-orange-100 text-orange-500 text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">${issue.priority}
                                        </span>`
                                        : `<span class="bg-gray-100  text-gray-500 text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">${issue.priority}
                                        </span>`
                                }


                            </div>

                            <h2 class="text-slate-800 font-bold text-xl mb-2">${issue.title}</h2>
                            <p class="text-slate-500 text-sm leading-relaxed mb-6">
                            ${issue.description}
                            </p>

                            <div class="flex flex-wrap gap-3 mb-6">
                                  ${issue.labels.map(label => {
                                    let setColor = "bg-gray-100 text-gray-700 border-gray-200";
                                    
                                    if (label.toLowerCase() === 'bug') setColor = "bg-red-100 text-red-700 border-red-200";
                                    if (label.toLowerCase() === 'feature') setColor = "bg-blue-100 text-blue-700 border-blue-200";
                                    if (label.toLowerCase() === 'enhancement') setColor = "bg-green-100 text-green-700 border-green-200";
                                    if (label.toLowerCase() === 'help wanted') setColor = "bg-orange-100 text-orange-700 border-orange-200";
                                    if (label.toLowerCase() === 'documentation') setColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
                                    if (label.toLowerCase() === 'good first issue') setColor = "bg-purple-100 text-purple-700 border-purple-200";

                                    return `
                                      <div class="flex items-center gap-1.5 ${setColor} border px-3 py-1.5 rounded-full text-xs font-semibold uppercase">
                                        ${label}
                                      </div>
                                    `;
                                  }).join('')}
                                </div>

                            <div class="border-t border-slate-100 pt-4 mt-4">
                            <p class="text-slate-500 text-sm font-medium">#${issue.id} ${newAuthor}</p>
                            <p class="text-slate-400 text-sm mt-1">${newTime}</p>
                        </div>
                    </div>
            </div>
        `;

    
        issueContainer.appendChild(issueElement);
    });
};


searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    performSearch();
  }
});

function performSearch() {
  
  const query = document.getElementById("searchInput").value.toLowerCase();
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`)
    .then(res => res.json())
    .then(json => {
      const searchResults = json.data;
      displayFilteredIssues(allIssues = searchResults);
    });  
}


function btnClose() {
  const modal = document.getElementById("issue-modal");
  modal.close();
}

function openModal(id) {
  const modal = document.getElementById("issue-modal");
  const modalBox = modal.querySelector(".modal-box");

  modalBox.innerHTML = ``;
  modal.showModal();

  
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then(res => {return res.json();
    })
    .then(json => {
      const issue = json.data;
      
      const newTime = new Date(issue.createdAt).toLocaleDateString();
      
      const newAuthor = issue.author
          .split("_").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");

      const newAssignee = issue.assignee
          .split("_").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");
      
      modalBox.innerHTML = `
        <h1 id="modalTitle" class="mb-4 font-bold text-lg">${issue.title}</h1>
                        <div class="flex justify-start items-center">

                          ${issue.status.toLowerCase() === "open"
                            ? `<p class="px-2 py-1 rounded-full bg-[#00A96E] text-sm text-white">Opened</p> `
                            : `<p class="px-2 py-1 rounded-full bg-[#A855F7] text-sm text-white">Closed</p> `
                        }
                          <span class="text-gray-400 ml-2"> &bull;</span>

                            <p class="px-2 py-1 rounded-full text-sm text-gray-800"> <span>Opened by </span>${newAuthor}</p>

                            <span class="text-gray-400">&bull;</span>

                            <p class="px-2 py-1 rounded-full text-sm text-gray-600">${newTime}</p>
                        </div>

                        <div class="flex flex-wrap gap-3 my-6">
                                  ${issue.labels.map(label => {
                                    let setColor = "bg-gray-100 text-gray-700 border-gray-200";
                                    
                                    if (label.toLowerCase() === 'bug') setColor = "bg-red-100 text-red-700 border-red-200";
                                    if (label.toLowerCase() === 'feature') setColor = "bg-blue-100 text-blue-700 border-blue-200";
                                    if (label.toLowerCase() === 'enhancement') setColor = "bg-green-100 text-green-700 border-green-200";
                                    if (label.toLowerCase() === 'help wanted') setColor = "bg-orange-100 text-orange-700 border-orange-200";

                                    return `
                                      <div class="flex items-center gap-1.5 ${setColor} border px-3 py-1.5 rounded-full text-xs font-semibold uppercase">
                                        ${label}
                                      </div>
                                    `;
                                  }).join('')}
                                </div>

                        <p class="text-slate-500 text-sm leading-relaxed mt-4 mb-6">
                            ${issue.description}
                        </p>

                        <div class="flex justify-start items-center gap-8 mb-6 rounded-lg bg-[#F8FAFC] p-4">

                             <div class="flex-1">
                             <p class="text-sm ">Assignee:</p>
                             <p class="text-sm font-bold">${newAssignee}</p>
                            </div>

                            <div class="flex-1">
                             <p class="text-sm ">Priority</p>
                             ${issue.priority.toLowerCase() === "high"
                                    ? `<span class="bg-green-100 text-green-500 text-xs px-2 py-1 rounded-full tracking-wider uppercase">${issue.priority}
                                </span>` 
                                    : issue.priority.toLowerCase() === "medium"
                                        ? `<span class="bg-orange-100 text-orange-500 text-xs px-2 py-1 rounded-full tracking-wider uppercase">${issue.priority}
                                        </span>`
                                        : `<span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full tracking-wider uppercase">${issue.priority}
                                        </span>`
                                }
                            </div>
                        
                        </div>

                        <div class="modal-action">
                        <button class="btn" onclick="btnClose()">Close</button>
                        </div>
      `;
    })
}

function updateCounts() {
  totalIssues.innerText =   issues.length;
  openIssues.innerText = issues.filter(i => i.status === "Open").length;
  closedIssues.innerText = issues.filter(i => i.status === "Closed").length;
}

loadIssues();