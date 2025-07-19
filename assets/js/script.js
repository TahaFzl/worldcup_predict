const groups = {
    A: ["qatar", "ecuador", "senegal", "netherlands"],
    B: ["england", "iran", "usa", "wales"],
    C: ["argentina", "saudi arabia", "mexico", "poland"],
    D: ["france", "australia", "denmark", "tunisia"],
    E: ["spain", "costa rica", "germany", "japan"],
    F: ["belgium", "canada", "morocco", "croatia"],
    G: ["brazil", "serbia", "switzerland", "cameroon"],
    H: ["portugal", "ghana", "uruguay", "korea"]
};

let selections = {
    round16: [],
    quarterFinals: [],
    semiFinals: [],
    finalMatch: [],
    champion: ""
};

let groupSelections = {};

function init() {
    const groupsDiv = document.getElementById('groups');
    for (const [group, teams] of Object.entries(groups)) {
        const groupBox = document.createElement('div');
        groupBox.className = 'group';
        groupBox.innerHTML = `<h3>Group ${group}</h3>`;
        teams.forEach(team => {
            const teamDiv = document.createElement('div');
            teamDiv.className = 'team';
            teamDiv.dataset.locked = "false"; // 🛡️ add locked flag
            teamDiv.innerHTML = `<img src="assets/img/flag/${team}.png"> ${capitalize(team)}`;
            teamDiv.onclick = () => selectGroupTeam(group, team, teamDiv);
            groupBox.appendChild(teamDiv);
        });
        groupsDiv.appendChild(groupBox);
    }
}

function selectGroupTeam(group, team, el) {
    if (!groupSelections[group]) groupSelections[group] = [];
    if (el.dataset.locked === "true") return;
    if (groupSelections[group].length >= 2) return;

    el.dataset.locked = "true"; // 🛡️ lock immediately
    groupSelections[group].push(team);
    el.classList.add('selected');

    if (Object.values(groupSelections).flat().length === 16) {
        selections.round16 = Object.values(groupSelections).flat();
        buildStage('round16', selections.round16, 'quarterFinals');
    }
}

function buildStage(containerId, teams, nextStage) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (let i = 0; i < teams.length; i += 2) {
        const match = document.createElement('div');
        match.className = 'match';
        match.dataset.locked = "false";
        match.innerHTML = `
            <div class="team" data-locked="false" onclick="advance(this, '${teams[i]}', '${nextStage}')">
                <img src="assets/img/flag/${teams[i]}.png"> ${capitalize(teams[i])}
            </div>
            VS
            <div class="team" data-locked="false" onclick="advance(this, '${teams[i + 1]}', '${nextStage}')">
                <img src="assets/img/flag/${teams[i + 1]}.png"> ${capitalize(teams[i + 1])}
            </div>
        `;
        container.appendChild(match);
    }
}

function advance(el, team, nextStage) {
    const matchDiv = el.parentNode;
    if (matchDiv.dataset.locked === "true") return;

    matchDiv.dataset.locked = "true"; // 🛡️ lock immediately

    matchDiv.querySelectorAll('.team').forEach(t => {
        t.dataset.locked = "true"; // 🛡️ lock teams too
        t.classList.remove('selected');
    });

    el.classList.add('selected');

    if (nextStage === 'champion') {
        showChampion(team);
        return;
    }

    selections[nextStage].push(team);

    if (nextStage === 'quarterFinals' && selections[nextStage].length === 8) {
        buildStage('quarterFinals', selections[nextStage], 'semiFinals');
    } else if (nextStage === 'semiFinals' && selections[nextStage].length === 4) {
        buildStage('semiFinals', selections[nextStage], 'finalMatch');
    } else if (nextStage === 'finalMatch' && selections[nextStage].length === 2) {
        buildStage('finalMatch', selections[nextStage], 'champion');
    }
}

function showChampion(team) {
    selections.champion = team;
    const championDiv = document.getElementById('champion');
    championDiv.innerHTML = `👑 <span class="winner">${capitalize(team)}</span> 👑`;
}

function capitalize(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

init();