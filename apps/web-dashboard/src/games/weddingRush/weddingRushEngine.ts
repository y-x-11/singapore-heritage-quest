import './weddingRush.css';

const ASSETS = {
  intro: '/games/little-india/wedding-rush/scene-intro.jpg',
  market: '/games/little-india/wedding-rush/scene-market.png',
  end: '/games/little-india/wedding-rush/scene-end.jpg',
  flower: '/games/little-india/wedding-rush/scene-flower.jpg',
  sweet: '/games/little-india/wedding-rush/scene-sweet.jpg',
  textile: '/games/little-india/wedding-rush/scene-textile.svg',
} as const;

const TIMER_START = 75;
const BUDGET_START = 30;
const PENALTY_MONEY = 5;
const PENALTY_TIME = 10;

type Shop = 'flower' | 'sweet' | 'textile';
type Flower = 'marigold' | 'jasmine' | 'rose';
type Screen = 'intro' | 'instructions' | 'hub' | 'victory' | 'end';

const FLOWER_META: Record<Flower, { emoji: string; label: string }> = {
  marigold: { emoji: '🌼', label: 'Marigold' },
  jasmine: { emoji: '🤍', label: 'Jasmine' },
  rose: { emoji: '🌹', label: 'Rose' },
};

const ALL_FLOWERS: Flower[] = ['marigold', 'jasmine', 'rose'];
const SWEET_ZONE_WIDTH = 16;

function randomRecipe(): Flower[] {
  return Array.from({ length: 3 }, () => ALL_FLOWERS[Math.floor(Math.random() * ALL_FLOWERS.length)]);
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SPICES = [
  { id: 'cardamom', emoji: '🟢', label: 'Cardamom', jar: 'chai', clue: 'Crushed into masala chai at Tekka stalls' },
  { id: 'cinnamon', emoji: '🟤', label: 'Cinnamon', jar: 'dessert', clue: 'Warms mithai and festive sweet trays' },
  { id: 'cloves', emoji: '🫚', label: 'Cloves', jar: 'biryani', clue: 'Whole pods perfume biryani spice blends' },
] as const;

const JARS = [
  { id: 'chai', emoji: '🫖', label: 'Chai Spice' },
  { id: 'biryani', emoji: '🍛', label: 'Biryani Spice' },
  { id: 'dessert', emoji: '🍬', label: 'Dessert' },
] as const;

const SHOP_INSTRUCTIONS: Record<
  Shop,
  { title: string; emoji: string; image: string; imageClass?: string; steps: string[] }
> = {
  flower: {
    title: 'Flower Garland Sequence',
    emoji: '🌸',
    image: ASSETS.flower,
    steps: [
      'Look at the 3 flower icons in the recipe banner.',
      'Tap the matching flowers below in the same order.',
      'Complete 2 recipes to earn the garland.',
      'Wrong taps cost $5 and 10 seconds.',
    ],
  },
  sweet: {
    title: 'Sweet Shop Spice Sort',
    emoji: '🍬',
    image: ASSETS.sweet,
    steps: [
      'Drag each spice card to the jar that matches its use.',
      'Cardamom goes with chai, cinnamon with desserts, cloves with biryani.',
      'Sort all 3 spices correctly to earn sweets.',
      'Wrong jars cost $5 and 10 seconds.',
    ],
  },
  textile: {
    title: 'Crisp Fold Timing Gauge',
    emoji: '🧵',
    image: ASSETS.textile,
    imageClass: 'wr-modal-bg-textile',
    steps: [
      'Watch the gold needle swing across the bar.',
      'Press Space or tap the bar when the needle is in the green zone.',
      'Land 3 perfect folds to earn the veshti.',
      'The green zone moves after each fold. Misses cost $5 and 10 seconds.',
    ],
  },
};

export interface WeddingRushOptions {
  onWin?: (mistakes: number) => void;
}

export class WeddingRushEngine {
  private root: HTMLElement;
  private options: WeddingRushOptions;
  private destroyed = false;
  private mistakes = 0;
  private screen: Screen = 'intro';
  private hubUsesMarket = true;
  private timeLeft = TIMER_START;
  private budget = BUDGET_START;
  private items = { garland: false, sweets: false, veshti: false };
  private completedShops = new Set<Shop>();
  private timerId: ReturnType<typeof setInterval> | null = null;
  private timerPaused = false;
  private modalEl: HTMLElement | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private needleRaf = 0;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private textileAnimGen = 0;
  private textileFoldLock = false;

  private currentRecipe: Flower[] = [];
  private flowerStep = 0;
  private flowerRecipesDone = 0;

  private spicePlaced = new Set<string>();
  private jarOrder: string[] = [];
  private spiceOrder: string[] = [];

  private foldHits = 0;
  private needlePos = 0;
  private needleDir = 1;
  private sweetZoneLeft = 42;
  private victoryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(container: HTMLElement, options: WeddingRushOptions = {}) {
    this.root = container;
    this.options = options;
    this.root.className = 'wr-root';
    this.render();
  }

  destroy() {
    this.destroyed = true;
    this.stopTimer();
    this.clearVictoryTimer();
    this.closeModal();
    this.stopNeedle();
    this.root.innerHTML = '';
  }

  private clearVictoryTimer() {
    if (this.victoryTimer) {
      clearTimeout(this.victoryTimer);
      this.victoryTimer = null;
    }
  }

  private stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private startTimer() {
    this.stopTimer();
    this.timerPaused = false;
    this.timerId = setInterval(() => {
      if (this.destroyed || this.timerPaused) return;
      this.timeLeft -= 1;
      this.updateHud();
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.stopTimer();
        this.triggerEnd(false);
      }
    }, 1000);
  }

  private pauseTimer() {
    this.timerPaused = true;
    this.updateHud();
  }

  private resumeTimer() {
    this.timerPaused = false;
    this.updateHud();
    if (!this.timerId) this.startTimer();
  }

  private allItemsEarned() {
    return this.items.garland && this.items.sweets && this.items.veshti;
  }

  private applyPenalty() {
    this.mistakes += 1;
    this.budget = Math.max(0, this.budget - PENALTY_MONEY);
    this.timeLeft = Math.max(0, this.timeLeft - PENALTY_TIME);
    this.showToast(`Lost $${PENALTY_MONEY} and ${PENALTY_TIME}s!`);
    this.updateHud();
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.stopTimer();
      this.triggerEnd(false);
    }
  }

  private showToast(msg: string) {
    const existing = this.root.querySelector('.wr-toast');
    existing?.remove();
    if (this.toastTimer) clearTimeout(this.toastTimer);
    const toast = document.createElement('div');
    toast.className = 'wr-toast';
    toast.textContent = msg;
    this.root.appendChild(toast);
    this.toastTimer = setTimeout(() => toast.remove(), 1800);
  }

  private updateHud() {
    const clock = this.root.querySelector('.wr-clock-face');
    const clockLabel = this.root.querySelector('.wr-clock-label');
    const wallet = this.root.querySelector('.wr-wallet-amount');
    if (clock) clock.textContent = String(this.timeLeft);
    if (clock) clock.classList.toggle('wr-clock-paused', this.timerPaused);
    if (clockLabel) clockLabel.textContent = this.timerPaused ? 'Paused' : 'Time';
    if (wallet) wallet.textContent = `$${this.budget}`;
    (['garland', 'sweets', 'veshti'] as const).forEach((key, i) => {
      const slot = this.root.querySelectorAll('.wr-slot')[i];
      if (slot) slot.classList.toggle('earned', this.items[key]);
    });
  }

  private render() {
    this.root.innerHTML = '';
    const hudHidden = this.screen === 'intro' || this.screen === 'victory' || this.screen === 'end';
    const hud = document.createElement('header');
    hud.className = `wr-hud${hudHidden ? ' hidden' : ''}`;
    hud.innerHTML = `
      <div class="wr-clock">
        <div class="wr-clock-face">${this.timeLeft}</div>
        <span class="wr-clock-label">Time</span>
      </div>
      <div class="wr-wallet">
        <span class="wr-wallet-icon">💰</span>
        <span class="wr-wallet-amount">$${this.budget}</span>
      </div>
      <div class="wr-slots">
        <div class="wr-slot${this.items.garland ? ' earned' : ''}" title="Garland">
          💐<span class="wr-slot-label">Garland</span>
        </div>
        <div class="wr-slot${this.items.sweets ? ' earned' : ''}" title="Sweets">
          🍬<span class="wr-slot-label">Sweets</span>
        </div>
        <div class="wr-slot${this.items.veshti ? ' earned' : ''}" title="Veshti">
          🧣<span class="wr-slot-label">Veshti</span>
        </div>
      </div>
    `;
    this.root.appendChild(hud);

    const scene = document.createElement('div');
    scene.className = 'wr-scene';

    if (this.screen === 'intro') {
      scene.innerHTML = `
        <img src="${ASSETS.intro}" alt="Little India festive street at night" />
        <div class="wr-scene-overlay">
          <div class="wr-title-banner">
            <h2>The Little India Wedding Rush</h2>
            <p>Collect garland, sweets, and veshti before the baraat arrives!</p>
          </div>
          <button type="button" class="wr-btn wr-start-btn">Start the Rush</button>
        </div>
      `;
      scene.querySelector('.wr-start-btn')?.addEventListener('click', () => {
        this.screen = 'instructions';
        this.render();
      });
    } else if (this.screen === 'instructions') {
      scene.innerHTML = `
        <img src="${ASSETS.intro}" alt="Little India market" />
        <div class="wr-scene-overlay">
          <div class="wr-instructions-panel">
            <strong>🪔 Mission Brief</strong>
            <ul>
              <li>75 seconds on the clock. Budget starts at $30.</li>
              <li>Visit all 3 shops and complete each challenge.</li>
              <li>Wrong moves cost $5 and 10 precious seconds.</li>
              <li>Collect Garland, Sweets, and Veshti to win!</li>
            </ul>
            <button type="button" class="wr-btn wr-go-btn" style="margin-top:0.75rem;width:100%">Enter the Market</button>
          </div>
        </div>
      `;
      scene.querySelector('.wr-go-btn')?.addEventListener('click', () => {
        this.screen = 'hub';
        this.hubUsesMarket = true;
        this.startTimer();
        this.render();
      });
    } else if (this.screen === 'hub') {
      const hubImg = this.hubUsesMarket ? ASSETS.market : ASSETS.intro;
      const hubAlt = this.hubUsesMarket ? 'Little India market street' : 'Little India Serangoon Road';
      scene.innerHTML = `<img src="${hubImg}" alt="${hubAlt}" />`;

      if (this.hubUsesMarket) {
        const hotspots = document.createElement('div');
        hotspots.className = 'wr-hub-hotspots';
        const shops: { shop: Shop; label: string }[] = [
          { shop: 'flower', label: '🌸 Flower Stall' },
          { shop: 'sweet', label: '🍬 Sweet Shop' },
          { shop: 'textile', label: '🧵 Textile Shop' },
        ];
        shops.forEach(({ shop, label }) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `wr-hotspot${this.completedShops.has(shop) ? ' done' : ''}`;
          btn.innerHTML = `<span class="wr-hotspot-label">${label}</span>`;
          if (!this.completedShops.has(shop)) {
            btn.addEventListener('click', () => this.openShop(shop));
          }
          hotspots.appendChild(btn);
        });
        scene.appendChild(hotspots);
      } else {
        const overlay = document.createElement('div');
        overlay.className = 'wr-scene-overlay wr-hub-overlay';
        const row = document.createElement('div');
        row.className = 'wr-storefront-row';
        const shops: { shop: Shop; label: string; emoji: string }[] = [
          { shop: 'flower', label: 'Flower Stall', emoji: '🌸' },
          { shop: 'sweet', label: 'Sweet Shop', emoji: '🍬' },
          { shop: 'textile', label: 'Textile Shop', emoji: '🧵' },
        ];
        shops.forEach(({ shop, label, emoji }) => {
          const card = document.createElement('button');
          card.type = 'button';
          card.className = `wr-storefront-card${this.completedShops.has(shop) ? ' done' : ''}`;
          card.innerHTML = `<span class="wr-storefront-emoji">${emoji}</span><span>${label}</span>`;
          if (!this.completedShops.has(shop)) {
            card.addEventListener('click', () => this.openShop(shop));
          }
          row.appendChild(card);
        });
        overlay.appendChild(row);
        scene.appendChild(overlay);
      }
    } else if (this.screen === 'victory') {
      scene.className = 'wr-scene wr-victory-scene';
      scene.innerHTML = `
        <div class="wr-victory-bg"></div>
        <div class="wr-confetti wr-confetti-burst"></div>
        <div class="wr-victory-overlay">
          <div class="wr-victory-crown">👑</div>
          <div class="wr-end-title">Little India Legend!</div>
          <div class="wr-end-sub">Garland, sweets, and veshti secured! The wedding rush is complete.</div>
          <div class="wr-victory-items">
            <span class="wr-victory-item earned">💐 Garland</span>
            <span class="wr-victory-item earned">🍬 Sweets</span>
            <span class="wr-victory-item earned">🧣 Veshti</span>
          </div>
          <button type="button" class="wr-btn wr-victory-btn">Continue to Temple</button>
        </div>
      `;
      this.spawnConfetti(scene.querySelector('.wr-confetti') as HTMLElement, 80);
      scene.querySelector('.wr-victory-btn')?.addEventListener('click', () => this.goToEndScreen(true));
      this.victoryTimer = setTimeout(() => {
        if (!this.destroyed && this.screen === 'victory') this.goToEndScreen(true);
      }, 4500);
    } else if (this.screen === 'end') {
      const won = this.allItemsEarned();
      scene.className = 'wr-scene wr-end-scene';
      scene.innerHTML = `
        <img src="${ASSETS.end}" alt="Sri Veeramakaliamman Temple" />
        ${won ? '<div class="wr-confetti"></div>' : ''}
        <div class="${won ? 'wr-scene-overlay wr-end-win-overlay' : 'wr-chaos-overlay'}">
          ${won ? '' : '<div class="wr-chaos-groom">🤵💦</div>'}
          <div class="wr-face-overlay">${won ? '😊' : '😢'}</div>
          <div class="wr-end-title">${won ? 'Baraat Ready!' : 'Chaos Ending!'}</div>
          <div class="wr-end-sub">${
            won
              ? 'You gathered every wedding treasure in time. The baraat is saved!'
              : 'Time ran out before the wedding list was complete. The groom is frantic!'
          }</div>
          <button type="button" class="wr-btn wr-replay-btn" style="margin-top:1rem">Play Again</button>
        </div>
      `;
      if (won) this.spawnConfetti(scene.querySelector('.wr-confetti') as HTMLElement, 50);
      scene.querySelector('.wr-replay-btn')?.addEventListener('click', () => this.reset());
    }

    this.root.appendChild(scene);
    this.updateHud();
  }

  private spawnConfetti(container: HTMLElement | null, count = 40) {
    if (!container) return;
    const colors = ['#ffd166', '#9b2335', '#2a9d8f', '#ffb703', '#e63946', '#fff8e7'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'wr-confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.8}s`;
      piece.style.animationDuration = `${1.8 + Math.random() * 2}s`;
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = `${6 + Math.random() * 8}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }
  }

  private reset() {
    this.stopTimer();
    this.clearVictoryTimer();
    this.closeModal();
    this.mistakes = 0;
    this.screen = 'intro';
    this.hubUsesMarket = true;
    this.timeLeft = TIMER_START;
    this.budget = BUDGET_START;
    this.items = { garland: false, sweets: false, veshti: false };
    this.completedShops.clear();
    this.currentRecipe = [];
    this.flowerStep = 0;
    this.flowerRecipesDone = 0;
    this.spicePlaced.clear();
    this.foldHits = 0;
    this.render();
  }

  private triggerEnd(won: boolean) {
    if (!won && this.allItemsEarned()) {
      this.triggerVictory();
      return;
    }
    this.closeModal();
    this.stopTimer();
    this.screen = 'end';
    this.render();
  }

  private triggerVictory() {
    this.closeModal();
    this.stopTimer();
    this.clearVictoryTimer();
    this.screen = 'victory';
    this.render();
    this.options.onWin?.(this.mistakes);
  }

  private goToEndScreen(_won: boolean) {
    this.clearVictoryTimer();
    this.screen = 'end';
    this.render();
  }

  private returnToHub() {
    this.closeModal();
    this.hubUsesMarket = false;
    this.screen = 'hub';
    this.render();
  }

  private completeShop(shop: Shop, itemKey: keyof typeof this.items) {
    this.completedShops.add(shop);
    this.items[itemKey] = true;
    this.updateHud();
    if (this.allItemsEarned()) {
      this.showToast('All items secured! 🎉');
      setTimeout(() => this.triggerVictory(), 700);
    } else {
      this.returnToHub();
    }
  }

  private openShop(shop: Shop) {
    if (this.completedShops.has(shop)) return;
    this.closeModal();
    this.pauseTimer();

    const backdrop = document.createElement('div');
    backdrop.className = 'wr-modal-backdrop';
    const modal = document.createElement('div');
    modal.className = 'wr-modal';

    backdrop.appendChild(modal);
    this.root.appendChild(backdrop);
    this.modalEl = backdrop;

    this.renderShopInstructions(modal, shop);
  }

  private renderShopInstructions(modal: HTMLElement, shop: Shop) {
    const info = SHOP_INSTRUCTIONS[shop];
    const imgClass = info.imageClass ? `wr-modal-bg ${info.imageClass}` : 'wr-modal-bg';
    modal.innerHTML = `
      <div class="wr-modal-header"><h3>${info.emoji} ${info.title}</h3></div>
      <div class="wr-modal-panel">
        <img class="${imgClass}" src="${info.image}" alt="${info.title}" />
        <div class="wr-shop-instructions">
          <p class="wr-shop-instructions-lead">How to play</p>
          <ul>
            ${info.steps.map((step) => `<li>${step}</li>`).join('')}
          </ul>
        </div>
        <button type="button" class="wr-btn wr-play-btn">Play</button>
      </div>
    `;
    modal.querySelector('.wr-play-btn')?.addEventListener('click', () => {
      this.resumeTimer();
      this.startShopGame(shop, modal);
    });
  }

  private startShopGame(shop: Shop, modal: HTMLElement) {
    if (shop === 'flower') {
      this.flowerStep = 0;
      this.flowerRecipesDone = 0;
      this.currentRecipe = randomRecipe();
      this.renderFlowerModal(modal);
    } else if (shop === 'sweet') {
      this.spicePlaced.clear();
      this.jarOrder = shuffle(JARS.map((j) => j.id));
      this.spiceOrder = shuffle(SPICES.map((s) => s.id));
      this.renderSweetModal(modal);
    } else {
      this.foldHits = 0;
      this.textileFoldLock = false;
      this.randomizeSweetZone();
      this.renderTextileModal(modal);
    }
  }

  private closeModal() {
    this.stopNeedle();
    this.modalEl?.remove();
    this.modalEl = null;
  }

  private renderFlowerModal(modal: HTMLElement) {
    const recipe = this.currentRecipe;
    modal.innerHTML = `
      <div class="wr-modal-header"><h3>🌸 Flower Garland Sequence</h3></div>
      <div class="wr-modal-panel">
        <img class="wr-modal-bg" src="${ASSETS.flower}" alt="Flower stall garlands" />
        <div class="wr-recipe-banner">
          <span class="wr-recipe-label">Target Recipe ${this.flowerRecipesDone + 1}/2</span>
          <div class="wr-recipe-icons">${recipe
            .map(
              (f, i) =>
                `<span class="wr-recipe-icon${i < this.flowerStep ? ' done' : ''}" title="${FLOWER_META[f].label}">${FLOWER_META[f].emoji}</span>`
            )
            .join('')}</div>
        </div>
        <div class="wr-flower-grid">
          ${ALL_FLOWERS.map(
            (f) =>
              `<button type="button" class="wr-flower-btn" data-flower="${f}"><span>${FLOWER_META[f].emoji}</span>${FLOWER_META[f].label}</button>`
          ).join('')}
        </div>
        <p class="wr-progress-text">Match the recipe order exactly</p>
      </div>
    `;
    modal.querySelectorAll('.wr-flower-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const picked = (btn as HTMLElement).dataset.flower as Flower;
        const expected = recipe[this.flowerStep];
        if (picked === expected) {
          btn.classList.add('flash-ok');
          this.flowerStep += 1;
          this.updateRecipeIcons(modal);
          if (this.flowerStep >= recipe.length) {
            this.flowerRecipesDone += 1;
            if (this.flowerRecipesDone >= 2) {
              this.showToast('Garland secured! 💐');
              setTimeout(() => this.completeShop('flower', 'garland'), 500);
            } else {
              this.currentRecipe = randomRecipe();
              this.flowerStep = 0;
              setTimeout(() => this.renderFlowerModal(modal), 400);
            }
          }
        } else {
          btn.classList.add('shake');
          this.applyPenalty();
          this.flowerStep = 0;
          this.updateRecipeIcons(modal);
          setTimeout(() => btn.classList.remove('shake'), 450);
        }
        setTimeout(() => btn.classList.remove('flash-ok'), 450);
      });
    });
  }

  private updateRecipeIcons(modal: HTMLElement) {
    modal.querySelectorAll('.wr-recipe-icon').forEach((icon, i) => {
      icon.classList.toggle('done', i < this.flowerStep);
    });
  }

  private randomizeSweetZone() {
    const maxLeft = 100 - SWEET_ZONE_WIDTH - 4;
    this.sweetZoneLeft = 4 + Math.random() * (maxLeft - 4);
  }

  private renderSweetModal(modal: HTMLElement) {
    modal.innerHTML = `
      <div class="wr-modal-header"><h3>🍬 Sweet Shop Spice Sort</h3></div>
      <div class="wr-modal-panel">
        <img class="wr-modal-bg" src="${ASSETS.sweet}" alt="Moghul Sweet Shop" />
        <div class="wr-jars">
          ${this.jarOrder
            .map((jarId) => JARS.find((j) => j.id === jarId)!)
            .map(
              (j) =>
                `<div class="wr-jar${this.spicePlaced.has(j.id) ? ' filled' : ''}" data-jar="${j.id}"><span class="wr-jar-icon">${j.emoji}</span><span class="wr-jar-label">${j.label}</span></div>`
            )
            .join('')}
        </div>
        <div class="wr-spice-tray">
          ${this.spiceOrder
            .map((spiceId) => SPICES.find((s) => s.id === spiceId)!)
            .filter((s) => !this.spicePlaced.has(s.jar))
            .map(
              (s) =>
                `<div class="wr-spice-card" draggable="true" data-spice="${s.id}" title="${s.clue}"><span class="wr-spice-emoji">${s.emoji}</span>${s.label}</div>`
            )
            .join('')}
        </div>
        <p class="wr-progress-text">Drag each spice to its cultural use jar</p>
      </div>
    `;

    let draggedId: string | null = null;
    modal.querySelectorAll('.wr-spice-card').forEach((card) => {
      card.addEventListener('dragstart', (e) => {
        draggedId = (card as HTMLElement).dataset.spice ?? null;
        card.classList.add('dragging');
        (e as DragEvent).dataTransfer?.setData('text/plain', draggedId ?? '');
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });

    modal.querySelectorAll('.wr-jar').forEach((jar) => {
      jar.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      jar.addEventListener('drop', (e) => {
        e.preventDefault();
        const jarId = (jar as HTMLElement).dataset.jar;
        const spice = SPICES.find((s) => s.id === draggedId);
        if (!spice || !jarId || this.spicePlaced.has(jarId)) return;
        if (spice.jar === jarId) {
          this.spicePlaced.add(jarId);
          jar.classList.add('pulse-glow', 'filled');
          this.showToast(`${spice.label} sorted!`);
          if (this.spicePlaced.size >= 3) {
            setTimeout(() => this.completeShop('sweet', 'sweets'), 600);
          } else {
            setTimeout(() => this.renderSweetModal(modal), 400);
          }
        } else {
          this.applyPenalty();
        }
      });
    });
  }

  private stopNeedle() {
    if (this.needleRaf) cancelAnimationFrame(this.needleRaf);
    this.needleRaf = 0;
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
  }

  private renderTextileModal(modal: HTMLElement) {
    this.stopNeedle();
    const animGen = ++this.textileAnimGen;
    modal.innerHTML = `
      <div class="wr-modal-header"><h3>🧵 Crisp Fold Timing Gauge</h3></div>
      <div class="wr-modal-panel">
        <img class="wr-modal-bg wr-modal-bg-textile" src="${ASSETS.textile}" alt="Textile shop" />
        <div class="wr-veshti-scene">
          <div class="wr-veshti-img">🧣</div>
          <p class="wr-progress-text">Press Space or tap when the needle hits the green zone</p>
          <div class="wr-timing-bar">
            <div class="wr-sweet-zone" style="left:${this.sweetZoneLeft}%;width:${SWEET_ZONE_WIDTH}%"></div>
            <div class="wr-needle" style="left:50%"></div>
          </div>
          <div class="wr-fold-progress">
            ${[0, 1, 2].map((i) => `<div class="wr-fold-dot${i < this.foldHits ? ' hit' : ''}"></div>`).join('')}
          </div>
          <p class="wr-progress-text">Perfect folds: ${this.foldHits}/3</p>
        </div>
      </div>
    `;

    const needle = modal.querySelector('.wr-needle') as HTMLElement;
    const bar = modal.querySelector('.wr-timing-bar') as HTMLElement;
    const SPEED = 1.8;

    const tick = () => {
      if (this.destroyed || animGen !== this.textileAnimGen || !needle.isConnected) return;
      this.needlePos += this.needleDir * SPEED;
      if (this.needlePos >= 100) {
        this.needlePos = 100;
        this.needleDir = -1;
      } else if (this.needlePos <= 0) {
        this.needlePos = 0;
        this.needleDir = 1;
      }
      needle.style.left = `${this.needlePos}%`;
      this.needleRaf = requestAnimationFrame(tick);
    };
    this.needleRaf = requestAnimationFrame(tick);

    const inSweetZone = () =>
      this.needlePos >= this.sweetZoneLeft && this.needlePos <= this.sweetZoneLeft + SWEET_ZONE_WIDTH;

    const tryFold = () => {
      if (this.textileFoldLock) return;
      if (inSweetZone()) {
        this.textileFoldLock = true;
        this.foldHits += 1;
        this.showToast('Perfect fold! ✨');
        if (this.foldHits >= 3) {
          setTimeout(() => this.completeShop('textile', 'veshti'), 500);
        } else {
          this.randomizeSweetZone();
          setTimeout(() => {
            this.textileFoldLock = false;
            if (modal.isConnected) this.renderTextileModal(modal);
          }, 200);
        }
      } else {
        this.applyPenalty();
        bar.classList.add('shake');
        setTimeout(() => bar.classList.remove('shake'), 450);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        tryFold();
      }
    };
    this.keydownHandler = onKey;
    window.addEventListener('keydown', onKey);
    bar?.addEventListener('click', tryFold);
  }
}
