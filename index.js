const COLORS = ['hearts', 'bells', 'leaves', 'acorns'];
const NUMBERS = ['9', '2', '3', '4', '10', '11'];
const isUsed = new Set();

function updateUnhideAllButton(button) {
  button.disabled = isUsed.size === 0;
  button.style.cursor = button.disabled ? 'not-allowed' : 'pointer';
}

function getHideCardString(cardName) {
  return `Click to unhide ${cardName}`;
}

function unhideCard(cardName, img = undefined) {
  if (img === undefined) {
    img = document.getElementById(cardName);
  }
  isUsed.delete(cardName);
  img.classList.remove('cardHidden');
  img.title = getHideCardString(cardName);
}

window.addEventListener('load', function () {
  const unhideAllButton = document.getElementById("unhideAll");
  unhideAllButton.addEventListener('click', () => {
    isUsed.forEach((cardName) => {
      unhideCard(cardName);
    });
    isUsed.clear();
    updateUnhideAllButton(unhideAllButton);
  });
  updateUnhideAllButton(unhideAllButton);

  const backgroundColorPicker = document.getElementById('backgroundColorPicker');
  backgroundColorPicker.addEventListener('input', (event) => {
    document.body.style.backgroundColor = event.target.value;
  });

  const cardsContainer = document.getElementById('cards');

  const cardsPerRow = 6; // 4 rows of 6
  const imgWidth = 110;

  // Set container styles
  cardsContainer.style.display = 'grid';
  cardsContainer.style.gridTemplateColumns = `repeat(${cardsPerRow}, ${imgWidth}px)`;
  cardsContainer.style.gap = '1rem'; // space between cards
  cardsContainer.style.justifyContent = 'center';
  cardsContainer.style.margin = '2rem';

  COLORS.forEach((color) => {
    NUMBERS.forEach((number) => {
      const cardName = `${number} of ${color}`;
      const hideCardString = `Click to hide ${cardName}`;

      const img = document.createElement('img');

      img.id = cardName;
      img.classList.add('card');
      img.src = `assets/cards/${color}_${number}.png`;
      img.width = imgWidth;
      img.alt = `Card ${cardName}`;
      img.title = hideCardString;
      cardsContainer.appendChild(img);

      img.addEventListener('click', () => {
        if (isUsed.has(cardName)) {
          unhideCard(cardName, img);
        } else {
          isUsed.add(cardName);
          img.classList.add('cardHidden');
          img.title = `Click to unhide ${cardName}`;
        }
        updateUnhideAllButton(unhideAllButton);
      });
    });
  });
});
