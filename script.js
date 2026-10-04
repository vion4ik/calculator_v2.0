// ========== НАСТРОЙКИ ==========
// Курс: сколько рублей в 1 долларе.
const USD_RATE = 85;

// ========== ТАБЛИЦЫ ЦЕН (в рублях) ==========
const soloPrices = [
  { min: 900,  max: 1050, pricePerElo: 105 / 25 },
  { min: 1050, max: 1200, pricePerElo: 125 / 25 },
  { min: 1200, max: 1350, pricePerElo: 145 / 25 },
  { min: 1350, max: 1530, pricePerElo: 165 / 25 },
  { min: 1530, max: 1750, pricePerElo: 190 / 25 },
  { min: 1750, max: 2000, pricePerElo: 230 / 25 },
  { min: 2000, max: 2100, pricePerElo: 270 / 25 },
  { min: 2100, max: 2200, pricePerElo: 320 / 25 },
  { min: 2200, max: 2300, pricePerElo: 355 / 25 },
  { min: 2300, max: 2400, pricePerElo: 390 / 25 },
  { min: 2400, max: 2500, pricePerElo: 460 / 25 },
  { min: 2500, max: 2600, pricePerElo: 520 / 25 },
  { min: 2600, max: 2700, pricePerElo: 580 / 25 },
  { min: 2700, max: 2800, pricePerElo: 670 / 25 },
  { min: 2800, max: 2900, pricePerElo: 850 / 25 },
  { min: 2900, max: 3000, pricePerElo: 900 / 25 }
];

const partyPricesByGame = [
  { min: 900,  max: 1050, pricePerGame: 158 },
  { min: 1050, max: 1200, pricePerGame: 188 },
  { min: 1200, max: 1350, pricePerGame: 218 },
  { min: 1350, max: 1530, pricePerGame: 248 },
  { min: 1530, max: 1750, pricePerGame: 285 },
  { min: 1750, max: 2000, pricePerGame: 345 },
  { min: 2000, max: 2100, pricePerGame: 405 },
  { min: 2100, max: 2200, pricePerGame: 480 },
  { min: 2200, max: 2300, pricePerGame: 533 },
  { min: 2300, max: 2400, pricePerGame: 683 },
  { min: 2400, max: 2500, pricePerGame: 805 },
  { min: 2500, max: 2600, pricePerGame: 910 },
  { min: 2600, max: 2700, pricePerGame: 1015 },
  { min: 2700, max: 2800, pricePerGame: 1240 },
  { min: 2800, max: 2900, pricePerGame: 1573 },
  { min: 2900, max: 3000, pricePerGame: 1800 }
];

// ========== ТЕКУЩЕЕ СОСТОЯНИЕ ==========
let currentLang = 'ru';
let currentCurrency = 'RUB';

// ========== ПЕРЕВОДЫ ==========
const translations = {
  ru: {
    title: '🎯 КАЛЬКУЛЯТОР БУСТА CS2',
    boostType: 'Тип буста',
    solo: 'Соло буст (передача)',
    party: 'Пати буст',
    currentElo: 'Начальное ELO',
    targetElo: 'Конечное ELO',
    gamesCount: 'Количество игр',
    targetHint: '📌 Введите конечный ELO (макс. 3000)',
    gamesHint: '📌 Введите количество игр',
    markup: 'Наценка (%)',
    calcBtn: '💰 Рассчитать цену',
    errInvalid: '⚠️ Введите корректные числа',
    errTargetLess: '❌ Конечный ELO должен быть больше начального',
    errNegative: '❌ ELO не может быть отрицательным',
    errMaxElo: '❌ Максимальный ELO — 3000',
    errNoTier: '❌ Нет цен для ELO выше ',
    errGamesMin: '❌ Количество игр должно быть не меньше 1',
    errGamesMax: '❌ Суммарный ELO не может превышать 3000',
    errGamesTier: '❌ Не хватает диапазонов для ',
    errGamesTier2: ' игр (ELO выше ',
    rub: 'руб',
    usd: '$'
  },
  en: {
    title: '🎯 CS2 BOOST CALCULATOR',
    boostType: 'Boost type',
    solo: 'Solo boost (self-play)',
    party: 'Party boost',
    currentElo: 'Current ELO',
    targetElo: 'Target ELO',
    gamesCount: 'Number of games',
    targetHint: '📌 Enter target ELO (max 3000)',
    gamesHint: '📌 Enter number of games',
    markup: 'Markup (%)',
    calcBtn: '💰 Calculate price',
    errInvalid: '⚠️ Please enter valid numbers',
    errTargetLess: '❌ Target ELO must be higher than current',
    errNegative: '❌ ELO cannot be negative',
    errMaxElo: '❌ Maximum ELO is 3000',
    errNoTier: '❌ No prices for ELO above ',
    errGamesMin: '❌ Number of games must be at least 1',
    errGamesMax: '❌ Total ELO cannot exceed 3000',
    errGamesTier: '❌ Not enough tiers for ',
    errGamesTier2: ' games (ELO above ',
    rub: 'RUB',
    usd: '$'
  }
};

function t(key) {
  return translations[currentLang][key];
}

// ========== ЛОГИКА РАСЧЁТА (цены всегда в рублях) ==========

function calculateBoostByElo(currentElo, desiredElo, priceTable, markup) {
  if (currentElo >= desiredElo) return { error: t('errTargetLess') };
  if (currentElo < 0 || desiredElo < 0) return { error: t('errNegative') };
  if (desiredElo > 3000) return { error: t('errMaxElo') };

  let totalCost = 0;
  let remaining = desiredElo - currentElo;
  let pos = currentElo < 900 ? 900 : currentElo;

  if (currentElo < 900 && desiredElo < 900) {
    totalCost = (desiredElo - currentElo) * priceTable[0].pricePerElo;
    const multiplier = 1 + (markup / 100);
    return { totalCost: totalCost * multiplier, error: null };
  }

  for (const tier of priceTable) {
    if (pos >= tier.min && pos < tier.max) {
      const tierMax = tier.max === Infinity ? desiredElo : tier.max;
      const maxGain = tierMax - pos;
      const gain = Math.min(remaining, maxGain);
      if (gain > 0) {
        totalCost += gain * tier.pricePerElo;
        pos += gain;
        remaining -= gain;
      }
    }
    if (remaining <= 0) break;
  }

  if (remaining > 0) return { error: t('errNoTier') + pos };

  const multiplier = 1 + (markup / 100);
  return { totalCost: totalCost * multiplier, error: null };
}

function calculateByGames(currentElo, games, priceTable, markup) {
  if (games < 1) return { error: t('errGamesMin') };
  if (currentElo < 0) return { error: t('errNegative') };
  if (currentElo + games * 25 > 3000) return { error: t('errGamesMax') };

  let totalCost = 0;
  let remainingGames = games;
  let pos = currentElo < 900 ? 900 : currentElo;

  for (const tier of priceTable) {
    if (pos >= tier.min && pos < tier.max) {
      const tierMax = tier.max === Infinity ? Infinity : tier.max;
      const eloPerGame = 25;
      const gamesToReachMax = Math.ceil((tierMax - pos) / eloPerGame);
      const gamesToTake = Math.min(remainingGames, gamesToReachMax);
      if (gamesToTake > 0) {
        totalCost += gamesToTake * tier.pricePerGame;
        pos += gamesToTake * eloPerGame;
        remainingGames -= gamesToTake;
      }
    }
    if (remainingGames <= 0) break;
  }

  if (remainingGames > 0) {
    return { error: t('errGamesTier') + remainingGames + t('errGamesTier2') + pos + ')' };
  }

  const multiplier = 1 + (markup / 100);
  return { totalCost: totalCost * multiplier, error: null };
}

// ========== ОБНОВЛЕНИЕ ПОЛЕЙ ==========
function updateFields() {
  const boostType = document.getElementById('boostType').value;
  const isGamesMode = boostType === 'party';
  const targetLabel = document.getElementById('targetLabel');
  const targetInput = document.getElementById('targetInput');
  const targetHint = document.getElementById('targetHint');
  const currentLabel = document.getElementById('currentLabel');

  currentLabel.textContent = t('currentElo');

  if (isGamesMode) {
    targetLabel.textContent = t('gamesCount');
    targetInput.placeholder = '5';
    targetInput.value = 5;
    targetInput.min = 1;
    targetInput.max = 99999;
    targetInput.step = 1;
    targetHint.textContent = t('gamesHint');
  } else {
    targetLabel.textContent = t('targetElo');
    targetInput.placeholder = '1561';
    targetInput.value = 1561;
    targetInput.min = 0;
    targetInput.max = 3000;
    targetInput.step = 1;
    targetHint.textContent = t('targetHint');
  }
}

// ========== ПЕРЕВОД ВСЕГО ИНТЕРФЕЙСА ==========
function applyLanguage() {
  document.getElementById('titleText').textContent = t('title');
  document.getElementById('boostTypeLabel').textContent = t('boostType');
  document.getElementById('targetLabel').textContent = t('targetElo');
  document.getElementById('markupLabel').textContent = t('markup');
  document.getElementById('calcBtn').textContent = t('calcBtn');

  const options = document.querySelectorAll('#boostType option');
  options.forEach(opt => {
    opt.textContent = opt.getAttribute('data-' + currentLang);
  });

  document.documentElement.lang = currentLang;
  document.title = currentLang === 'ru' ? 'Калькулятор буста CS2' : 'CS2 Boost Calculator';

  updateFields();
}

// ========== ФОРМАТИРОВАНИЕ ЦЕНЫ ==========
function formatPrice(priceInRub) {
  if (currentCurrency === 'USD') {
    const usd = priceInRub / USD_RATE;
    return '$' + usd.toFixed(2);
  }
  return priceInRub.toFixed(2) + ' ' + t('rub');
}

// ========== ГЛАВНАЯ ФУНКЦИЯ РАСЧЁТА ==========
function calculate() {
  const boostType = document.getElementById('boostType').value;
  const currentElo = parseFloat(document.getElementById('currentElo').value);
  const targetValue = parseFloat(document.getElementById('targetInput').value);
  const markup = parseFloat(document.getElementById('markup').value) || 0;
  const resultDiv = document.getElementById('result');

  if (isNaN(currentElo) || isNaN(targetValue)) {
    resultDiv.innerHTML = `<div class="placeholder">${t('errInvalid')}</div>`;
    return;
  }

  let result;
  if (boostType === 'solo') {
    result = calculateBoostByElo(currentElo, targetValue, soloPrices, markup);
  } else if (boostType === 'party') {
    result = calculateByGames(currentElo, Math.round(targetValue), partyPricesByGame, markup);
  } else {
    result = calculateBoostByElo(currentElo, targetValue, soloPrices, markup);
  }

  if (result.error) {
    resultDiv.innerHTML = `<div class="placeholder">${result.error}</div>`;
    return;
  }

  resultDiv.innerHTML = `<div class="price">${formatPrice(result.totalCost)}</div>`;
}

// ========== ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА ==========
document.querySelectorAll('#langSwitch .switch-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#langSwitch .switch-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLang = btn.getAttribute('data-lang');
    applyLanguage();
    calculate();
  });
});

// ========== ПЕРЕКЛЮЧАТЕЛЬ ВАЛЮТЫ ==========
document.querySelectorAll('#currencySwitch .switch-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#currencySwitch .switch-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCurrency = btn.getAttribute('data-currency');
    calculate();
  });
});

// ========== АВТОПЕРЕСЧЁТ ==========
document.getElementById('currentElo').addEventListener('input', calculate);
document.getElementById('targetInput').addEventListener('input', calculate);
document.getElementById('markup').addEventListener('input', calculate);
document.getElementById('boostType').addEventListener('change', function () {
  updateFields();
  calculate();
});

document.querySelectorAll('input').forEach(input => {
  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') calculate();
  });
});

window.onload = function () {
  applyLanguage();
  calculate();
};