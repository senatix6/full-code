const puzzle = document.getElementById('puzzle');
const upload = document.getElementById('upload');
const message = document.getElementById('message');
let pieces = [];

upload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      createPuzzle(img);
      message.style.display = 'none';
      puzzle.style.display = 'grid';
    };
  };
  reader.readAsDataURL(file);
});

function createPuzzle(img) {
  puzzle.innerHTML = '';
  pieces = [];

  const rows = 3;
  const cols = 3;

  const maxWidth = Math.min(window.innerWidth * 0.9, img.width);
  const scale = maxWidth / img.width;
  const pieceWidth = img.width / cols * scale;
  const pieceHeight = img.height / rows * scale;

  puzzle.style.gridTemplateColumns = `repeat(${cols}, ${pieceWidth}px)`;
  puzzle.style.gridTemplateRows = `repeat(${rows}, ${pieceHeight}px)`;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const div = document.createElement('div');
      div.className = 'piece';
      div.style.width = `${pieceWidth}px`;
      div.style.height = `${pieceHeight}px`;
      div.style.backgroundImage = `url(${img.src})`;
      div.style.backgroundSize = `${img.width * scale}px ${img.height * scale}px`;
      div.style.backgroundPosition = `-${x * pieceWidth}px -${y * pieceHeight}px`;
      div.dataset.correct = `${x}-${y}`;
      div.draggable = true;
      pieces.push(div);
    }
  }

  shuffleArray(pieces);
  pieces.forEach(piece => puzzle.appendChild(piece));
  addDragAndDrop();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function addDragAndDrop() {
  let dragged = null;
  let touched = null;

  puzzle.querySelectorAll('.piece').forEach(piece => {
    // PC
    piece.addEventListener('dragstart', e => {
      dragged = e.target;
    });

    piece.addEventListener('dragover', e => e.preventDefault());

    piece.addEventListener('drop', e => {
      e.preventDefault();
      if (dragged && dragged !== e.target) {
        swapPieces(dragged, e.target);
      }
    });

    // Móvil
    piece.addEventListener('touchstart', e => {
      touched = e.target;
      touched.classList.add('highlight');
    }, { passive: true });

    piece.addEventListener('touchend', e => {
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (target && target.classList.contains('piece') && touched && target !== touched) {
        swapPieces(touched, target);
      }

      if (touched) touched.classList.remove('highlight');
      touched = null;
    });
  });
}

function swapPieces(p1, p2) {
  const temp = document.createElement('div');
  puzzle.replaceChild(temp, p2);
  puzzle.replaceChild(p2, p1);
  puzzle.replaceChild(p1, temp);
  checkIfCompleted();
}

function checkIfCompleted() {
  const currentPieces = puzzle.querySelectorAll('.piece');
  let completed = true;

  currentPieces.forEach((piece, index) => {
    const x = index % 3;
    const y = Math.floor(index / 3);
    const correct = `${x}-${y}`;
    if (piece.dataset.correct !== correct) {
      completed = false;
    }
  });

  if (completed) {
    puzzle.style.display = 'none';
    message.style.display = 'block';
    launchHearts();
  }
}

function launchHearts() {
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤️';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${Math.random() * 100 + 300}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 3000);
  }
}
