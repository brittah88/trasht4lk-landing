const board = document.querySelector('#board');
const addNoteBtn = document.querySelector('#add-note');
const addStickerBtn = document.querySelector('#add-sticker');
const toggleEditBtn = document.querySelector('#toggle-edit');
const resetBoardBtn = document.querySelector('#reset-board');

const STORAGE_KEY = 'trashtalkstudioz-memo-board';

const defaultLayout = {
  notes: [
    {
      id: 'hero',
      type: 'note',
      left: '4%',
      top: '6%',
      width: '460px',
      height: '190px',
      rotate: '-1deg',
      color: '#f7ea65',
      html: `<div class="note-pin"></div><p class="label">EMPIRE SIGNAL</p><h2>TRASHTALKSTUDiOZ</h2><p class="meta-line">Creator coin / toxic culture / onchain experiments / web3 builder energy</p><div class="cta-row"><a href="#" class="chip-link">Zora</a><a href="#" class="chip-link">Base</a><a href="#" class="chip-link">Onchain</a></div>`
    },
    {
      id: 'coin',
      type: 'note',
      left: '42%',
      top: '12%',
      width: '320px',
      height: '220px',
      rotate: '2deg',
      color: '#a7f0d4',
      html: `<div class="note-pin"></div><p class="label">CREATOR COIN</p><h3>TRASHTALK</h3><p>Built for culture, hype, and creator-first value in the onchain economy.</p><div class="link-stack"><a href="#">Zora coin</a><a href="#">Base chain</a></div>`
    },
    {
      id: 'projects',
      type: 'note',
      left: '64%',
      top: '38%',
      width: '290px',
      height: '250px',
      rotate: '-3deg',
      color: '#f5b7d7',
      html: `<div class="note-pin"></div><p class="label">PROJECTS</p><ul><li>Creator coin launch</li><li>Base-native drops</li><li>Web3 identity stack</li><li>Culture-fueled media</li></ul>`
    },
    {
      id: 'build',
      type: 'note',
      left: '16%',
      top: '44%',
      width: '300px',
      height: '235px',
      rotate: '1deg',
      color: '#b9d7ff',
      html: `<div class="note-pin"></div><p class="label">BUILD MODE</p><p>From internet chaos to utility. Launching memetic brand systems and creator-led web3 experiences.</p><div class="mini-grid"><span>Brand</span><span>Drop</span><span>Utility</span><span>Culture</span></div>`
    },
    {
      id: 'brief',
      type: 'note',
      left: '37%',
      top: '58%',
      width: '330px',
      height: '200px',
      rotate: '-2deg',
      color: '#ffc9a1',
      html: `<div class="note-pin"></div><p class="label">EMPIRE BRIEF</p><p>Self-built internet empire for creators, liquidity, culture, and high-voltage community.</p>`
    },
    {
      id: 'links',
      type: 'note',
      left: '72%',
      top: '12%',
      width: '260px',
      height: '185px',
      rotate: '4deg',
      color: '#d9f7a8',
      html: `<div class="note-pin"></div><p class="label">LINKS</p><div class="stack-links"><a href="#">Twitter / X</a><a href="#">Farcaster</a><a href="#">Instagram</a></div>`
    }
  ],
  stickers: [
    { id: 'sticker-1', type: 'sticker', left: '58%', top: '74%', width: '120px', height: '120px', rotate: '-12deg', color: '#ff5d73', text: 'ZORA', shape: 'circle' },
    { id: 'sticker-2', type: 'sticker', left: '71%', top: '68%', width: '120px', height: '120px', rotate: '8deg', color: '#4de1c3', text: 'BASE', shape: 'blob' },
    { id: 'sticker-3', type: 'sticker', left: '22%', top: '78%', width: '120px', height: '120px', rotate: '10deg', color: '#ffd166', text: 'DROP', shape: 'star' },
    { id: 'sticker-4', type: 'sticker', left: '8%', top: '26%', width: '120px', height: '120px', rotate: '-8deg', color: '#9b8cff', text: 'EMPIRE', shape: 'hex' }
  ]
};

let editMode = false;
let dragState = null;

function createElementFromTemplate(item) {
  const el = document.createElement('article');
  el.className = item.type === 'note' ? 'note' : 'sticker';
  el.dataset.id = item.id;
  el.style.left = item.left;
  el.style.top = item.top;
  el.style.width = item.width;
  el.style.height = item.height;
  el.style.setProperty('--note-color', item.color || '#f7cc5a');
  el.style.setProperty('--sticker-color', item.color || '#ff5d73');
  el.style.transform = `rotate(${item.rotate || '0deg'})`;

  if (item.type === 'note') {
    el.innerHTML = item.html;
  } else {
    const shapeClass = item.shape || 'circle';
    el.classList.add(`sticker-${shapeClass}`);
    el.innerHTML = `<span>${item.text || 'NEW'}</span><div class="sticker-pin"></div>`;
  }

  return el;
}

function getBoardState() {
  const notes = [...board.querySelectorAll('.note')].map((note) => {
    const transform = note.style.transform || '';
    const match = transform.match(/rotate\(([^)]+)\)/);
    return {
      id: note.dataset.id,
      left: note.style.left,
      top: note.style.top,
      width: note.style.width,
      height: note.style.height,
      rotate: match ? match[1] : '0deg',
      color: getComputedStyle(note).getPropertyValue('--note-color').trim(),
      html: note.innerHTML
    };
  });

  const stickers = [...board.querySelectorAll('.sticker')].map((sticker) => {
    const transform = sticker.style.transform || '';
    const match = transform.match(/rotate\(([^)]+)\)/);
    const shape = [...sticker.classList].find((cls) => cls.startsWith('sticker-'))?.replace('sticker-', '') || 'circle';
    return {
      id: sticker.dataset.id,
      left: sticker.style.left,
      top: sticker.style.top,
      width: sticker.style.width,
      height: sticker.style.height,
      rotate: match ? match[1] : '0deg',
      color: getComputedStyle(sticker).getPropertyValue('--sticker-color').trim(),
      text: sticker.querySelector('span')?.textContent || 'NEW',
      shape
    };
  });

  return { notes, stickers };
}

function saveBoardState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getBoardState()));
}

function renderDefaultBoard() {
  board.innerHTML = `
    <div class="toxic-bg-text">TRASHTALKSTUDiOZ</div>
    <div class="hero-portrait" aria-label="Toxic glam portrait illustration">
      <div class="portrait-hair"></div>
      <div class="portrait-head">
        <div class="eye left"></div>
        <div class="eye right"></div>
        <div class="nose"></div>
        <div class="smile"></div>
      </div>
      <div class="portrait-gas-mask">
        <div class="mask-top"></div>
        <div class="mask-body"></div>
        <div class="mask-filter"></div>
      </div>
      <div class="trash-bin"></div>
      <div class="drip drip-1"></div>
      <div class="drip drip-2"></div>
      <div class="drip drip-3"></div>
    </div>
  `;

  defaultLayout.notes.forEach((note) => {
    board.appendChild(createElementFromTemplate({ ...note, type: 'note' }));
  });

  defaultLayout.stickers.forEach((sticker) => {
    board.appendChild(createElementFromTemplate({ ...sticker, type: 'sticker' }));
  });

  bindInteractiveItems();
  refreshEditMode();
  saveBoardState();
}

function restoreBoardState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    renderDefaultBoard();
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    if (!parsed.notes || !parsed.stickers) {
      renderDefaultBoard();
      return;
    }

    board.innerHTML = `
      <div class="toxic-bg-text">TRASHTALKSTUDiOZ</div>
      <div class="hero-portrait" aria-label="Toxic glam portrait illustration">
        <div class="portrait-hair"></div>
        <div class="portrait-head">
          <div class="eye left"></div>
          <div class="eye right"></div>
          <div class="nose"></div>
          <div class="smile"></div>
        </div>
        <div class="portrait-gas-mask">
          <div class="mask-top"></div>
          <div class="mask-body"></div>
          <div class="mask-filter"></div>
        </div>
        <div class="trash-bin"></div>
        <div class="drip drip-1"></div>
        <div class="drip drip-2"></div>
        <div class="drip drip-3"></div>
      </div>
    `;

    parsed.notes.forEach((note) => board.appendChild(createElementFromTemplate({ ...note, type: 'note' })));
    parsed.stickers.forEach((sticker) => board.appendChild(createElementFromTemplate({ ...sticker, type: 'sticker' })));

    bindInteractiveItems();
    refreshEditMode();
  } catch (error) {
    renderDefaultBoard();
  }
}

function makeDraggable(item) {
  item.addEventListener('pointerdown', (event) => {
    if (!editMode) return;

    const boardRect = board.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    dragState = {
      target: item,
      offsetX: event.clientX - itemRect.left,
      offsetY: event.clientY - itemRect.top,
      boardRect
    };

    item.setPointerCapture(event.pointerId);
  });

  item.addEventListener('pointermove', (event) => {
    if (!dragState || dragState.target !== item) return;

    const x = event.clientX - dragState.boardRect.left - dragState.offsetX;
    const y = event.clientY - dragState.boardRect.top - dragState.offsetY;

    const maxX = dragState.boardRect.width - item.offsetWidth;
    const maxY = dragState.boardRect.height - item.offsetHeight;

    item.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    item.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
  });

  item.addEventListener('pointerup', () => {
    if (dragState && dragState.target === item) {
      dragState = null;
      saveBoardState();
    }
  });

  item.addEventListener('pointerleave', () => {
    if (dragState && dragState.target === item) {
      dragState = null;
      saveBoardState();
    }
  });
}

function bindInteractiveItems() {
  [...document.querySelectorAll('.note, .sticker')].forEach((item) => {
    makeDraggable(item);
    item.setAttribute('contenteditable', editMode ? 'true' : 'false');
    item.addEventListener('input', saveBoardState);
  });
}

function refreshEditMode() {
  document.body.classList.toggle('edit-mode', editMode);
  [...document.querySelectorAll('.note, .sticker')].forEach((item) => {
    item.setAttribute('contenteditable', editMode ? 'true' : 'false');
  });
  toggleEditBtn.textContent = editMode ? 'Done Editing' : 'Edit Mode';
}

function addNote() {
  const note = document.createElement('article');
  note.className = 'note';
  note.dataset.id = `note-${Date.now()}`;
  note.style.left = '52%';
  note.style.top = '22%';
  note.style.width = '260px';
  note.style.height = '190px';
  note.style.setProperty('--note-color', '#f7d6a5');
  note.style.transform = 'rotate(0deg)';
  note.innerHTML = `
    <div class="note-pin"></div>
    <p class="label">NEW NOTE</p>
    <h3>Idea</h3>
    <p>Drop in a new thought, release, or project update.</p>
  `;
  board.appendChild(note);
  makeDraggable(note);
  note.setAttribute('contenteditable', editMode ? 'true' : 'false');
  saveBoardState();
}

function addSticker() {
  const sticker = document.createElement('article');
  const shapes = ['circle', 'blob', 'star', 'hex'];
  const colors = ['#ff5d73', '#4de1c3', '#ffd166', '#9b8cff', '#7dd3fc'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const pickText = ['ZORA', 'BASE', 'DROP', 'MEMO', 'EMPIRE', 'PULSE'];

  sticker.className = 'sticker';
  sticker.dataset.id = `sticker-${Date.now()}`;
  sticker.style.left = '50%';
  sticker.style.top = '30%';
  sticker.style.width = '120px';
  sticker.style.height = '120px';
  sticker.style.setProperty('--sticker-color', color);
  sticker.style.transform = `rotate(${(Math.random() * 28 - 14).toFixed(1)}deg)`;
  sticker.classList.add(`sticker-${shape}`);
  sticker.innerHTML = `<span>${pickText[Math.floor(Math.random() * pickText.length)]}</span><div class="sticker-pin"></div>`;

  board.appendChild(sticker);
  makeDraggable(sticker);
  sticker.setAttribute('contenteditable', editMode ? 'true' : 'false');
  saveBoardState();
}

function resetBoard() {
  localStorage.removeItem(STORAGE_KEY);
  renderDefaultBoard();
}

addNoteBtn.addEventListener('click', addNote);
addStickerBtn.addEventListener('click', addSticker);
toggleEditBtn.addEventListener('click', () => {
  editMode = !editMode;
  refreshEditMode();
  saveBoardState();
});
resetBoardBtn.addEventListener('click', resetBoard);

restoreBoardState();
window.addEventListener('beforeunload', saveBoardState);

