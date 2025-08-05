// ------------------- DATA -------------------
let player = {
  hp: 100, mp: 50, maxHp: 100, maxMp: 50, exp: 0, level: 1, gold: 100,
  job: "Novice", inventory: [], skills: ["Double Hit"], buffs: [], auto: false
};

let logBox = document.getElementById("log");
let intervalId = null;

// ------------------- UI UPDATE -------------------
function updateUI() {
  document.getElementById("hp").textContent = player.hp;
  document.getElementById("mp").textContent = player.mp;
  document.getElementById("exp").textContent = `${player.exp}%`;
  document.getElementById("level").textContent = player.level;
  document.getElementById("job").textContent = player.job;
}

// ------------------- LOG -------------------
function log(msg) {
  logBox.innerHTML += `> ${msg}<br>`;
  logBox.scrollTop = logBox.scrollHeight;
}

// ------------------- AUTO BOT -------------------
function toggleAutoBot() {
  player.auto = !player.auto;
  log(player.auto ? "Auto Bot เริ่มทำงาน..." : "Auto Bot หยุดทำงาน");

  if (player.auto) {
    intervalId = setInterval(() => {
      huntMonster();
      autoHeal();
      autoBuff();
      checkQuest();
    }, 1500);
  } else {
    clearInterval(intervalId);
  }
}

function huntMonster() {
  const damage = 10 + Math.floor(player.level * Math.random());
  log(`โจมตีมอนสเตอร์ สร้างความเสียหาย ${damage}`);
  gainExp(10);
  tryLoot();
}

function autoHeal() {
  if (player.hp < 40) {
    player.hp = Math.min(player.maxHp, player.hp + 30);
    log("ใช้ยา HP อัตโนมัติ");
  }
}

function autoBuff() {
  if (!player.buffs.includes("AttackUp")) {
    player.buffs.push("AttackUp");
    log("ใช้ Buff: AttackUp");
  }
}

function tryLoot() {
  if (Math.random() < 0.3) {
    player.inventory.push("Red Herb");
    log("ได้รับ Red Herb");
  }
}

// ------------------- EXP / LEVEL -------------------
function gainExp(amount) {
  player.exp += amount;
  if (player.exp >= 100) {
    player.exp = 0;
    player.level++;
    player.maxHp += 10;
    player.maxMp += 5;
    log(`อัปเลเวล! ตอนนี้คุณเลเวล ${player.level}`);
  }
  updateUI();
}

// ------------------- QUEST -------------------
function checkQuest() {
  const hasRedHerb = player.inventory.includes("Red Herb");
  if (hasRedHerb) {
    log("ส่งเควส Red Herb สำเร็จ!");
    player.inventory = player.inventory.filter(item => item !== "Red Herb");
    player.gold += 50;
  }
}

// ------------------- SKILLS -------------------
function useSkill(skillName) {
  if (skillName === "Double Hit" && player.mp >= 10) {
    player.mp -= 10;
    log("ใช้สกิล Double Hit!");
    gainExp(5);
  } else {
    log("MP ไม่พอ!");
  }
  updateUI();
}

function useBuff() {
  autoBuff();
  updateUI();
}

// ------------------- SHOP -------------------
function openShop() {
  const cost = 30;
  if (player.gold >= cost) {
    player.gold -= cost;
    player.inventory.push("Blue Potion");
    log("ซื้อ Blue Potion สำเร็จ");
  } else {
    log("เงินไม่พอซื้อของ!");
  }
}

// ------------------- TABS -------------------
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(div => div.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ------------------- INITIAL -------------------
updateUI();
log("พร้อมใช้งาน! เริ่มล่าได้เลย.");
