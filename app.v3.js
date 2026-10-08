const STAT_NAMES = {
  str: "Strength",
  ess: "Essence",
  wis: "Wisdom",
  con: "Constitution",
  dex: "Dexterity",
};

const OUTPUTS = ["Dmg", "Def", "CK Dmg", "CK Def", "VE", "HP", "AR", "Dodge", "CK AR", "CK DR", "CK Dodge"];

const DATA = {
  New: {
    Vagabond: {
      str: { Dmg: 3, Def: 1 },
      ess: { "CK Def": 5, VE: 15 },
      wis: { "CK Dmg": 3, "CK Def": 1 },
      con: { HP: 22, Def: 5 },
      dex: { AR: 15, Dodge: 10, "CK DR": 15, "CK Dodge": 10 },
    },
    Warrior: {
      str: { Dmg: 5, Def: 4 },
      ess: { "CK Def": 5, VE: 37 },
      wis: { "CK Dmg": 3, "CK Def": 4 },
      con: { HP: 60, Def: 8 },
      dex: { AR: 20, Dodge: 16, "CK AR": 15, "CK Dodge": 12 },
    },
    Nuker: {
      str: { Dmg: 3, Def: 3 },
      ess: { "CK Def": 8, VE: 35 },
      wis: { "CK Dmg": 5, "CK Def": 4 },
      con: { HP: 25.5, Def: 5 },
      dex: { AR: 15, Dodge: 12, "CK AR": 20, "CK Dodge": 16 },
    },
    Healer: {
      str: { Dmg: 4, Def: 4 },
      ess: { "CK Def": 6, VE: 29 },
      wis: { "CK Dmg": 4, "CK Def": 4 },
      con: { HP: 42, Def: 6 },
      dex: { AR: 16, Dodge: 18, "CK AR": 16, "CK Dodge": 18 },
    },
    Hybrid: {
      str: { Dmg: 4, Def: 3 },
      ess: { "CK Def": 5, VE: 27 },
      wis: { "CK Dmg": 4, "CK Def": 2 },
      con: { HP: 36, Def: 6 },
      dex: { AR: 18, Dodge: 14, "CK AR": 18, "CK Dodge": 14 },
    },
  },
  Old: {
    Vagabond: {
      str: { Dmg: 3, Def: 6 },
      ess: { "CK Dmg": 4, "CK Def": 2 },
      wis: { "CK AR": 2, "CK Def": 1, "CK Dodge": 1 },
      con: { HP: 20 },
      dex: { AR: 4, Dodge: 4 },
    },
    Warrior: {
      str: { Dmg: 3, Def: 6 },
      ess: { VE: 35, "CK Dmg": 4, "CK Def": 2 },
      wis: { "CK AR": 3, "CK Def": 1, "CK Dodge": 1 },
      con: { HP: 40 },
      dex: { AR: 5, Dodge: 4 },
    },
    Nuker: {
      str: { Dmg: 3, Def: 6 },
      ess: { VE: 35, "CK Dmg": 4, "CK Def": 2 },
      wis: { "CK AR": 3, "CK Def": 1, "CK Dodge": 1 },
      con: { HP: 25 },
      dex: { AR: 4, Dodge: 4 },
    },
    Healer: {
      str: { Dmg: 3, Def: 6 },
      ess: { VE: 30, "CK Dmg": 4, "CK Def": 2 },
      wis: { "CK AR": 3, "CK Def": 1, "CK Dodge": 1 },
      con: { HP: 40 },
      dex: { AR: 4, Dodge: 4 },
    },
    Hybrid: {
      str: { Dmg: 3, Def: 6 },
      ess: { VE: 25, "CK Dmg": 4, "CK Def": 1 },
      wis: { "CK AR": 2, "CK Def": 1, "CK Dodge": 1 },
      con: { HP: 35 },
      dex: { AR: 5, Dodge: 4 },
    },
  },
};

const versionEl = document.querySelector("#version");
const roleEl = document.querySelector("#role");
const inputsEl = document.querySelector("#inputs");
const resultsEl = document.querySelector("#results");
const totalPointsEl = document.querySelector("#totalPoints");
const selectedBuildEl = document.querySelector("#selectedBuild");
const statsTitleEl = document.querySelector("#statsTitle");
const resetEl = document.querySelector("#reset");
const copyEl = document.querySelector("#copy");

const state = { str: 0, ess: 0, wis: 0, con: 0, dex: 0 };

function init() {
  Object.keys(DATA).forEach((version) => versionEl.add(new Option(version, version)));
  Object.keys(DATA.New).forEach((role) => roleEl.add(new Option(role, role)));

  inputsEl.innerHTML = Object.entries(STAT_NAMES)
    .map(
      ([key, label]) => `
        <div class="stat-input">
          <div>
            <span>${label}</span>
            <small>${key.toUpperCase()}</small>
          </div>
          <input id="${key}" type="number" min="0" max="9999" value="0" inputmode="numeric" />
        </div>
      `,
    )
    .join("");

  Object.keys(state).forEach((key) => {
    document.querySelector(`#${key}`).addEventListener("input", (event) => {
      state[key] = Math.max(0, Number(event.target.value || 0));
      render();
    });
  });

  versionEl.addEventListener("change", render);
  roleEl.addEventListener("change", render);
  resetEl.addEventListener("click", reset);
  copyEl.addEventListener("click", copyBuild);
  render();
}

function calculate(version, role) {
  const rates = DATA[version][role];
  const total = Object.fromEntries(OUTPUTS.map((name) => [name, 0]));

  Object.entries(state).forEach(([stat, points]) => {
    Object.entries(rates[stat]).forEach(([output, value]) => {
      total[output] += points * value;
    });
  });

  return total;
}

function format(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function renderCards(target, values) {
  target.innerHTML = OUTPUTS.map((name) => {
    const value = values[name] || 0;
    return `<div class="card"><span>${name}</span><strong>${format(value)}</strong></div>`;
  }).join("");
}

function render() {
  const version = versionEl.value;
  const role = roleEl.value;
  const totalPoints = Object.values(state).reduce((sum, value) => sum + value, 0);
  const result = calculate(version, role);

  totalPointsEl.textContent = totalPoints;
  selectedBuildEl.textContent = `${version} ${role}`;
  statsTitleEl.textContent = `${version} Stats`;
  renderCards(resultsEl, result);
}

function reset() {
  Object.keys(state).forEach((key) => {
    state[key] = 0;
    document.querySelector(`#${key}`).value = 0;
  });
  render();
}

async function copyBuild() {
  const version = versionEl.value;
  const role = roleEl.value;
  const result = calculate(version, role);
  const statText = Object.entries(state)
    .map(([key, value]) => `${STAT_NAMES[key]} ${value}`)
    .join(", ");
  const resultText = OUTPUTS.map((name) => `${name}: ${format(result[name])}`).join(", ");
  await navigator.clipboard.writeText(`${version} ${role} build | ${statText} | ${resultText}`);
  copyEl.textContent = "Copied";
  setTimeout(() => (copyEl.textContent = "Copy Build"), 1000);
}

init();
