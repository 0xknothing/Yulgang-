// ------------------- MONSTERS -------------------
const monsters = [
  {
    id: 1,
    name: "หมาป่าในหุบเขา",
    hp: 50,
    atk: 8,
    exp: 10,
    drop: ["Red Herb", "Wolf Fur"]
  },
  {
    id: 2,
    name: "แมงมุมมีพิษ",
    hp: 60,
    atk: 12,
    exp: 15,
    drop: ["Blue Potion", "Spider Leg"]
  }
];

// ------------------- NPC -------------------
const npcs = [
  {
    id: 1,
    name: "ยายมดแดง",
    position: { x: 5, y: 5 },
    questId: 101,
    dialog: ["หนูจ๋า... ไปเก็บ Red Herb มาให้ยายหน่อยสิ"]
  }
];

// ------------------- QUESTS -------------------
const quests = [
  {
    id: 101,
    name: "ช่วยยายมดแดง",
    requiredItem: "Red Herb",
    reward: {
      gold: 50,
      exp: 20
    }
  }
];

// ------------------- ITEMS -------------------
const items = {
  "Red Herb": {
    type: "consumable",
    effect: "ฟื้น HP 30",
    price: 10
  },
  "Blue Potion": {
    type: "consumable",
    effect: "ฟื้น MP 30",
    price: 30
  },
  "Wolf Fur": {
    type: "material",
    description: "ขนหมาป่า ใช้คราฟชุด"
  },
  "Spider Leg": {
    type: "material",
    description: "ขาแมงมุมสำหรับขาย"
  }
};
