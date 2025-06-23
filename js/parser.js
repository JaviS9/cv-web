window.addEventListener("DOMContentLoaded", () => {
    fetch("content.txt")
        .then(response => response.text())
        .then(parseAndInjectContent)
        .catch(err => console.error("Failed to load content.txt:", err));
});

function parseAndInjectContent(content) {
    const sections = {};
    const titles = {};
    const lines = content.split('\n');
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('[') && line.endsWith(']')) {
            currentSection = line.slice(1, -1);
            sections[currentSection] = [];
            titles[currentSection] = currentSection;
            const nextLine = lines[i + 1]?.trim();
            if (nextLine?.startsWith('title =')) {
                titles[currentSection] = nextLine.split('=')[1].trim();
                i++;
            }
        } else if (currentSection && line) {
            sections[currentSection].push(line);
        }
    }

    renderHeader(sections.header || []);
    renderExperience(sections.experience || [], titles.experience);
    renderEducation(sections.education || [], titles.education);
    renderSkills(sections.skills || [], titles.skills);
    renderProjects(sections["personal-projects"] || [], titles["personal-projects"]);
}

function renderExperience(lines, title) {
    const container = document.getElementById("experience");
    container.innerHTML = `<h3>${title}</h3>`;
    let html = "";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.startsWith('-')) {
            const [role, company, dates] = line.split('|').map(x => x.trim());
            html += `<article class="job">
                        <div class="job-header">
                            <div class="job-title">
                                <h4>${role}</h4>
                                <p class="company">${company}</p>
                            </div>
                            <div class="job-dates">
                                <p>${dates}</p>
                            </div>
                        </div>
                        <ul>`;
            i++;
            while (lines[i]?.startsWith('-')) {
                html += `<li>${lines[i].slice(1).trim()}</li>`;
                i++;
            }
            html += `</ul></article>`;
            i--;
        }
    }
    container.innerHTML += html;
}

function renderEducation(lines, title) {
    const container = document.getElementById("education");
    container.innerHTML = `<h3>${title}</h3>`;
    let html = "";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.startsWith('-')) {
            const [degree, institution, dates] = line.split('|').map(x => x.trim());
            html += `<article class="education-entry">
                        <div class="edu-header">
                            <div class="degree-info">
                                <h4>${degree}</h4>
                                <p class="institution">${institution}</p>
                            </div>
                            <div class="edu-dates">
                                <p>${dates}</p>
                            </div>
                        </div>
                        <ul>`;
            i++;
            while (lines[i]?.startsWith('-')) {
                html += `<li>${lines[i].slice(1).trim()}</li>`;
                i++;
            }
            html += `</ul></article>`;
            i--;
        }
    }

    container.innerHTML += html;
}

function renderSkills(lines, title) {
    const container = document.getElementById("skills");
    container.innerHTML = `<h3>${title}</h3>`;
    let html = "";
    let i = 0;

    while (i < lines.length) {
        if (lines[i].endsWith(':')) {
            const category = lines[i].replace(':', '').trim();
            html += `<div class="skill-category"><h4>${category}</h4>`;
            i++;
            if (category === "Spoken Languages") {
                while (i < lines.length && lines[i] && !lines[i].endsWith(':')) {
                    const [lang, level, percent] = lines[i].split('|').map(x => x.trim());
                    html += `<div class="language-skill">
                                <p>${lang}</p>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${percent}%;">
                                        <span class="progress-text">${level}</span>
                                    </div>
                                </div>
                            </div>`;
                    i++;
                }
            } else {
                html += `<p class="skill-list">${lines[i++]}</p>`;
            }
            html += `</div>`;
        } else {
            i++;
        }
    }

    container.innerHTML += html;
}

function renderProjects(lines, title) {
    const container = document.getElementById("personal-projects");
    container.innerHTML = `<h3>${title}</h3><div class="project-grid"></div>`;
    const grid = container.querySelector(".project-grid");

    lines.forEach(line => {
        const [type, image, desc, url] = line.split('|').map(x => x.trim());
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
            <div class="project-category">${type}</div>
            <img src="${image}" alt="Screenshot del proyecto" class="project-image" />
            <p>${desc}</p>
            <a href="${url}" class="github-link" target="_blank">
                <span class="github-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.53 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38..."/>
                    </svg>
                </span>
                View on GitHub
            </a>
        `;
        grid.appendChild(card);
    });
}

function renderHeader(lines) {
    const data = {};
    lines.forEach(line => {
        const [key, value] = line.split('=').map(s => s.trim());
        data[key] = value;
    });

    if (data.name) document.getElementById("header-name").textContent = data.name;
    if (data.title) document.getElementById("header-title").textContent = data.title;

    if (data.email) {
        const emailEl = document.getElementById("header-email");
        emailEl.textContent = data.email;
        emailEl.href = `mailto:${data.email}`;
    }

    if (data.phone) {
        const phoneEl = document.getElementById("header-phone");
        phoneEl.textContent = data.phone;
        phoneEl.href = `tel:${data.phone}`;
    }

    if (data.linkedin) document.getElementById("header-linkedin").href = data.linkedin;
    if (data.github) document.getElementById("header-github").href = data.github;
    if (data.location) document.getElementById("header-location").textContent = data.location;
}
