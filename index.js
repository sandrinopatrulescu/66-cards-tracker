const COLORS = ['hearts', 'bells', 'leaves', 'acorns'];
const NUMBERS = ['9', '2', '3', '4', '10', '11'];

const NUMBER_OF_CARDS = COLORS.length * NUMBERS.length;

//@formatter:off
const HANDS_COLORS = {
  1: '#FF0000',
  2: '#FF8000',
  3: '#00FF00',
  4: '#00FFFF',
  5: '#8F00FF',
  6: '#EE88EE',
}
//@formatter:on

const CARD_BORDER_SIZE = "0.5rem";
const CARD_BORDER = `${CARD_BORDER_SIZE} solid transparent`;

const isUsed = new Set();

function rgbToHex(rgbString) {
  const nums = rgbString.match(/\d+/g).map(Number);
  return '#' + nums.map(x => {
    const hex = (x + 0).toString(16);
    return hex.length === 1 ? '0' + hex : hex
  }).join('');
}

function forEachCard(cardConsumer) {
  COLORS.forEach((color) => {
    NUMBERS.forEach((number) => {
      cardConsumer(color, number);
    });
  })
}

function updateAll(unhideAllButton) {
  unhideAllButton.disabled = isUsed.size === 0;
  unhideAllButton.style.cursor = unhideAllButton.disabled ? 'not-allowed' : 'pointer'

  const hideAllButton = document.getElementById("hideAll");
  hideAllButton.disabled = isUsed.size === NUMBER_OF_CARDS;
  hideAllButton.style.cursor = hideAllButton.disabled ? 'not-allowed' : 'pointer'

  document.getElementById('handsPlayed').value = `${isUsed.size} / 4 = ${isUsed.size / 4}`;
  const cardsLeft = NUMBER_OF_CARDS - isUsed.size;
  document.getElementById('handsLeft').value = `${cardsLeft} / 4 = ${cardsLeft / 4}`;
}

function getHideCardString(cardName) {
  return `Click to hide ${cardName}`;
}

function unhideCard(cardName, img = undefined) {
  if (img === undefined) {
    img = document.getElementById(cardName);
  }
  isUsed.delete(cardName);
  img.classList.remove('cardHidden');
  img.title = getHideCardString(cardName);
  img.style.border = CARD_BORDER;
  document.getElementById(`${cardName} handNumber`)?.remove();
}

function hideCard(cardName, img = undefined, imageContainer = undefined) {
  if (img === undefined) {
    img = document.getElementById(cardName);
  }
  if (imageContainer === undefined) {
    imageContainer = document.getElementById(`${cardName} container`);
  }

  isUsed.add(cardName);
  img.classList.add('cardHidden');
  img.title = `Click to unhide ${cardName}`;

  const handsPlayed = isUsed.size / 4;
  const handsPlayedRounded = Math.ceil(handsPlayed);
  img.style.border = `${CARD_BORDER_SIZE} solid ${HANDS_COLORS[handsPlayedRounded]}`;

  const handNumberOverlay = document.createElement('div');

  handNumberOverlay.id = `${cardName} handNumber`;
  handNumberOverlay.innerText = `Hand ${handsPlayedRounded} (${handsPlayed})`;
  handNumberOverlay.style.position = 'absolute';
  handNumberOverlay.style.bottom = '0.5rem';
  handNumberOverlay.style.left = '0.5rem';
  handNumberOverlay.style.fontSize = '0.75rem';

  imageContainer.appendChild(handNumberOverlay);
}

window.addEventListener('load', function () {
  const unhideAllButton = document.getElementById("unhideAll");
  unhideAllButton.addEventListener('click', () => {
    isUsed.forEach((cardName) => {
      unhideCard(cardName);
    });
    isUsed.clear();
    updateAll(unhideAllButton);
  });
  updateAll(unhideAllButton);

  const hideAllButton = document.getElementById("hideAll");
  hideAllButton.addEventListener('click', () => {
    forEachCard((color, number) => {
      const cardName = `${number} of ${color}`;
      if (!isUsed.has(cardName)) {
        hideCard(cardName);
      }
    });
    updateAll(unhideAllButton);
  });

  const backgroundColorPicker = document.getElementById('backgroundColorPicker');
  backgroundColorPicker.value = rgbToHex(getComputedStyle(document.body).getPropertyValue('background-color'));
  backgroundColorPicker.addEventListener('input', (event) => {
    document.body.style.backgroundColor = event.target.value;
  });

  const cardsContainer = document.getElementById('cards');

  const cardsPerRow = 6; // 4 rows of 6
  const imgWidth = 110;

  // Set container styles
  cardsContainer.style.display = 'grid';
  cardsContainer.style.gridTemplateColumns = `repeat(${cardsPerRow}, ${imgWidth}px)`;
  cardsContainer.style.gap = '0.5rem 2rem'; // space between cards
  cardsContainer.style.justifyContent = 'center';
  cardsContainer.style.margin = '2rem';

  const flipCardAudio = new Audio('assets/flip-card.mp3');

  forEachCard((color, number) => {
    const cardName = `${number} of ${color}`;
    const hideCardString = `Click to hide ${cardName}`;

    const imageContainer = document.createElement('div');
    const img = document.createElement('img');

    imageContainer.id = cardName + ' container';
    imageContainer.style.position = 'relative';
    imageContainer.style.display = 'inline-block';
    imageContainer.style.border = CARD_BORDER_SIZE;

    img.id = cardName;
    img.classList.add('card');
    img.src = `assets/cards/${color}_${number}.png`;
    img.width = imgWidth;
    img.alt = `Card ${cardName}`;
    img.title = hideCardString;
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = 'auto';
    imageContainer.appendChild(img);
    cardsContainer.appendChild(imageContainer);
    unhideCard(cardName, img);

    img.addEventListener('click', () => {
      void flipCardAudio.play();

      if (isUsed.has(cardName)) {
        unhideCard(cardName, img);
      } else {
        hideCard(cardName, img, imageContainer);
      }
      updateAll(unhideAllButton);
    });
  });
});
