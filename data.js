// data.js
export const GRID_SIZE = 50; // pixels
export const MAP_WIDTH = 1920; // pixels
export const MAP_HEIGHT = 1080; // pixels

const gridCols = Math.floor(MAP_WIDTH / GRID_SIZE);
const gridRows = Math.floor(MAP_HEIGHT / GRID_SIZE);
export const mapGrid = Array(gridRows).fill(0).map(() => Array(gridCols).fill(0));

export let character = {
  name: "YulgangPlayer",
  level: 10,
  hp: 150,
  maxHp: 150,
  mp: 50,
  maxMp: 50,
  exp: 0,
  expToLevelUp: 1000,
  position: { x: 960, y: 540 },
  speed: 150, // pixels per second
  path: [],
  attackRange: 75,
  inventory: {
    'HP Potion': 20,
    'MP Potion': 15,
    'Gold': 50000,
  },
  skills: [
    { name: 'Blessing', duration: 15000, lastUsed: 0, mpCost: 10 },
    { name: 'Increase AGI', duration: 20000, lastUsed: 0, mpCost: 15 }
  ],
  activeQuestId: null,
  questProgress: {
    killCount: 0
  }
};

export let settings = {
  autoPot: {
    hpThreshold: 0.5,
    mpThreshold: 0.3,
  },
  autoBuff: { enabled: true },
  autoPickup: { enabled: true },
};

export const monstersData = {
  "Poring": {
    name: "Poring", maxHp: 30, attack: 5, exp: 10,
    drops: [{ itemName: 'Jellopy', chance: 0.8 }, { itemName: 'HP Potion', chance: 0.1 }],
    respawnDelay: 10000
  },
  "Fox": {
    name: "Fox", maxHp: 100, attack: 15, exp: 35,
    drops: [{ itemName: 'Fox Tail', chance: 0.5 }, { itemName: 'MP Potion', chance: 0.15 }],
    respawnDelay: 20000
  },
  "World_Boss": {
    name: "World Boss", maxHp: 2000, attack: 50, exp: 1000,
    drops: [{ itemName: 'RARE_NFT_DROP', chance: 1.0 }],
    respawnDelay: 300000
  }
};

export let activeMonsters = [
  { id: 'm1', ...monstersData.Poring, hp: 30, position: { x: 800, y: 600 }, isDead: false, respawnTime: 0 },
  { id: 'm2', ...monstersData.Poring, hp: 30, position: { x: 900, y: 650 }, isDead: false, respawnTime: 0 },
  { id: 'm3', ...monstersData.Fox, hp: 100, position: { x: 1100, y: 400 }, isDead: false, respawnTime: 0 },
  { id: 'm4', ...monstersData.Poring, hp: 30, position: { x: 1200, y: 700 }, isDead: false, respawnTime: 0 },
  { id: 'boss1', ...monstersData.World_Boss, hp: 2000, position: {x: 1500, y: 500}, isDead: false, respawnTime: 0 }
];

export let lootOnGround = [];

export const npcs = [
    { id: 'npc1', name: 'Quest Master', type: 'Quest', position: { x: 900, y: 450 } },
    { id: 'npc2', name: 'Potion Seller', type: 'Shop', position: { x: 1000, y: 450 } }
];

export const quests = {
    'Q101': {
        id: 'Q101',
        title: 'Poring Extermination',
        npcId: 'npc1',
        description: 'Please help us by defeating 5 Porings.',
        objective: { type: 'kill', targetName: 'Poring', amount: 5 },
        rewards: { exp: 500, gold: 1000 }
    }
};
