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

let groupSelections = {};  
let selections = {
    round16: [],
    quarterFinals: [],
    semiFinals: [],
    finalMatch: [],
    champion: ""
};

let allSubmitted = false;

function init() {
    const groupsDiv = document.getElementById('groups');
    for (const [group, teams] of Object.entries(groups)) {
        const groupBox = document.createElement('div');
        groupBox.className = 'group';
        groupBox.innerHTML = `<h3>Group ${group}</h3>`;
        teams.forEach(team => {
            const teamDiv = document.createElement('div');
            teamDiv.className = 'team';
            teamDiv.innerHTML = `<img src="assets/img/flag/${team}.png"> ${capitalize(team)}`;
            teamDiv.onclick = () => selectGroupTeam(group, team, teamDiv);
            groupBox.appendChild(teamDiv);
        });
        groupsDiv.appendChild(groupBox);
    }

    document.getElementById('submitAll').onclick = submitAll;
}

function selectGroupTeam(group, team, el) {
    if (allSubmitted) return;

    if (!groupSelections[group]) groupSelections[group] = [];

    if (groupSelections[group].includes(team)) {
        groupSelections[group] = groupSelections[group].filter(t => t !== team);
        el.classList.remove('selected');
    } else {
        if (groupSelections[group].length >= 2) {
            alert('Max 2 teams per group!');
            return;
        }
        groupSelections[group].push(team);
        el.classList.add('selected');
    }

    if (Object.values(groupSelections).every(g => g.length === 2) && selections.round16.length === 0) {
        buildRoundOf16();
    }
}

function submitAll() {
    if (Object.values(groupSelections).some(g => g.length !== 2)) {
        alert('Complete group selections!');
        return;
    }
    if (!selections.champion) {
        alert('Please select your champion!');
        return;
    }
    allSubmitted = true;
    alert('✅ All predictions submitted and locked!');
}

function buildRoundOf16() {
    const matchups = [
        [groupSelections.A[0], groupSelections.B[1]],
        [groupSelections.C[0], groupSelections.D[1]],
        [groupSelections.E[0], groupSelections.F[1]],
        [groupSelections.G[0], groupSelections.H[1]],
        [groupSelections.B[0], groupSelections.A[1]],
        [groupSelections.D[0], groupSelections.C[1]],
        [groupSelections.F[0], groupSelections.E[1]],
        [groupSelections.H[0], groupSelections.G[1]],
    ];
    buildStage('round16', matchups, 'quarterFinals');
}

function buildStage(containerId, matchups, nextStage) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    selections[nextStage] = new Array(matchups.length).fill(null);

    matchups.forEach((pair, index) => {
        const match = document.createElement('div');
        match.className = 'match';
        match.innerHTML = `
            <div class="team" onclick="advance(this, '${pair[0]}', '${nextStage}', ${index})">
                <img src="assets/img/flag/${pair[0]}.png"> ${capitalize(pair[0])}
            </div>
            VS
            <div class="team" onclick="advance(this, '${pair[1]}', '${nextStage}', ${index})">
                <img src="assets/img/flag/${pair[1]}.png"> ${capitalize(pair[1])}
            </div>
        `;
        container.appendChild(match);
    });
}

function advance(el, team, nextStage, index) {
    if (allSubmitted) return;

    const matchDiv = el.parentNode;
    matchDiv.querySelectorAll('.team').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');

    selections[nextStage][index] = team;

    if (nextStage === 'quarterFinals' && selections[nextStage].every(t => t)) {
        buildStage('quarterFinals', makePairs(selections[nextStage]), 'semiFinals');
    } else if (nextStage === 'semiFinals' && selections[nextStage].every(t => t)) {
        buildStage('semiFinals', makePairs(selections[nextStage]), 'finalMatch');
    } else if (nextStage === 'finalMatch' && selections[nextStage].every(t => t)) {
        buildStage('finalMatch', makePairs(selections[nextStage]), 'champion');
    } else if (nextStage === 'champion') {
        selections.champion = team;
        showChampion(team);
    }
}

function makePairs(list) {
    const pairs = [];
    for (let i = 0; i < list.length; i += 2) {
        pairs.push([list[i], list[i + 1]]);
    }
    return pairs;
}

function showChampion(team) {
    const championDiv = document.getElementById('champion');
    championDiv.innerHTML = `👑 <span class="winner">${capitalize(team)}</span> 👑`;
}

function capitalize(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

init();