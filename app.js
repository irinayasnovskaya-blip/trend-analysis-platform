'use strict';

const materials = [
    { name: 'Iso E Super', type: 'Синтетичний матеріал', role: 'База', character: 'Сухе дерево, прозорий кедровий відтінок.', doses: ['ледь помітний деревний фон', 'м’який кедровий акцент', 'виразніша деревна опора', 'стійкий деревний фон'], pair: 'Hedione для повітряності, Ambroxan для сухої амбрової бази.' },
    { name: 'Hedione', type: 'Синтетичний матеріал', role: 'Серце', character: 'Прозорий жасминовий відтінок.', doses: ['легке просвітлення серця', 'м’яка квіткова повітряність', 'помітніший жасминовий об’єм', 'розгорнуте прозоре серце'], pair: 'Iso E Super для прозорої деревної композиції.' },
    { name: 'Ambroxan', type: 'Синтетичний матеріал', role: 'База', character: 'Сухий амбровий, іноді мінеральний відтінок.', doses: ['тонкий амбровий штрих', 'відчутна суха база', 'помітна амброва присутність', 'амброва база може вийти на передній план'], pair: 'Iso E Super для деревного напрямку, Hedione для контрасту.' },
    { name: 'Ethylene Brassylate', type: 'Синтетичний матеріал', role: 'База', character: 'М’який мускусний відтінок.', doses: ['легке округлення', 'м’яка мускусна підкладка', 'помітна м’якість бази', 'виразніший мускусний фон'], pair: 'Hedione для повітряного квітково-мускусного акорду.' }
];

const find = (selector) => document.querySelector(selector);
const fmt = (value) => new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 4 }).format(value);
const catalog = find('#material-list');

function element(tag, value, className) {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
}

function card(title, paragraphs, className = 'card') {
    const item = element('article', '', className);
    item.append(element('h3', title), ...paragraphs.map((value) => element('p', value)));
    return item;
}

function renderCatalog() {
    const query = find('#material-search').value.trim().toLowerCase();
    const matches = materials.filter((item) => item.name.toLowerCase().includes(query));
    catalog.replaceChildren(...matches.map((item) => card(item.name, [
        item.type + ' · ' + item.role,
        item.character,
        item.doses.map((dose, index) => ['0,5%', '1%', '3%', '5%'][index] + ' — ' + dose).join(' · '),
        item.pair
    ])));
    if (!matches.length) catalog.append(element('p', 'За цією назвою матеріалів немає.'));
}

find('#material-search').addEventListener('input', renderCatalog);
renderCatalog();

const ingredientRules = [
    [/\bglycerin\b|гліцерин/i, 'Гліцерин — інгредієнт для зволоження.'],
    [/\bpanthenol\b|пантенол/i, 'Пантенол — інгредієнт для зволоження або кондиціонування.'],
    [/\bdimethicone\b|диметикон/i, 'Диметикон може додавати гладкості на дотик.'],
    [/\bniacinamide\b|ніацинамід/i, 'Ніацинамід — інгредієнт, який використовують у догляді за шкірою.']
];

const expectations = {
    'Парфуми': 'Опис нот допомагає уявити напрям запаху. Стійкість і шлейф варто оцінити на шкірі або блотері.',
    'Креми': 'Можна оцінити, чи склад схожий на зволожувальний або пом’якшувальний. Сам список інгредієнтів дає обмежене уявлення про силу ефекту.',
    'Шампуні': 'Спершу оцінюй очищення шкіри голови й відчуття після змивання. Обіцянки довготривалих змін потребують окремих доказів.',
    'Інший догляд': 'Зістав обіцяний ефект зі складом і способом використання. Для оцінки результату важливо, скільки часу засіб контактує зі шкірою або волоссям.'
};

find('#trend-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const claims = data.get('claims').trim();
    const ingredients = data.get('ingredients').trim();
    const recognized = ingredientRules.filter(([pattern]) => pattern.test(ingredients)).map(([, description]) => description);
    const source = data.get('url').trim();
    const result = find('#trend-result');
    if (!claims) {
        result.replaceChildren(element('p', 'Впиши обіцянку з відео або опису.'));
        return;
    }
    result.replaceChildren(
        card('Що обіцяє відео', [claims, ...(source ? ['Джерело — ' + source] : [])], 'result'),
        card('Що відомо про склад', recognized.length ? recognized : [ingredients ? 'У введеному складі немає інгредієнтів, які розпізнає стартовий довідник.' : 'Додай склад з етикетки, щоб перевірити інгредієнти.'], 'result'),
        card('Чого реально очікувати', [expectations[data.get('category')]], 'result')
    );
});

const profileTips = {
    'Суха шкіра': 'Для базового догляду почни з м’якого очищення та крему, після якого шкіру не стягує.',
    'Жирна шкіра': 'Обирай легку текстуру крему й очищення, після якого комфортно шкірі.',
    'Комбінована шкіра': 'Легкий засіб можна наносити на все обличчя, а сухі ділянки додатково зволожувати.',
    'Сухе волосся': 'Нанось кондиціонер переважно на довжину і кінчики.',
    'Жирна шкіра голови': 'Очищуй передусім шкіру голови, а кондиціонер розподіляй по довжині.'
};

const goalTips = {
    'Зволоження': ['Для шкіри підійде зволожувальна емульсія або крем.', 'Для довжини спробуй кондиціонер, після якого волосся легко розчісується.'],
    'М’яке очищення': ['Обирай засіб, після якого шкіру не стягує.', 'Оціни комфорт шкіри голови після миття й підбери зручну частоту.'],
    'Менше відчуття жирності': ['Почни з легкої текстури засобу й регулярного м’якого очищення.', 'Нанось шампунь на шкіру голови, а олії та маски залишай для кінчиків.'],
    'М’якість і гладкість': ['Обирай крем або емульсію, після яких шкіра м’яка на дотик.', 'Перевір, чи кондиціонер полегшує розчісування та зменшує тертя по довжині.']
};

find('#care-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const profile = data.get('profile');
    const hair = profile === 'Сухе волосся' || profile === 'Жирна шкіра голови';
    const tips = [profileTips[profile], goalTips[data.get('goal')][Number(hair)]];
    if (data.get('age') && Number(data.get('age')) < 18) tips.push('Для дитячого й підліткового догляду звіряй вікове маркування засобу.');
    find('#care-result').replaceChildren(card(data.get('goal'), tips, 'result'));
});

const form = find('#formula-form');
const lines = find('#formula-lines');
const storageKey = 'trend-platform.formulas.v1';
const saveMessage = find('#save-message');
let currentId = null;
let saved = [];

try {
    saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(saved)) saved = [];
} catch {
    saveMessage.textContent = 'Не вдалося прочитати збережені формули.';
}

function updateTotal() {
    const mass = Number(form.elements.mass.value);
    const strength = Number(form.elements.strength.value);
    const concentrate = mass * strength / 100;
    let total = 0;
    for (const row of lines.children) {
        const share = Number(row.querySelector('input').value);
        total += share;
        row.querySelector('small').textContent = fmt(concentrate * share / 100) + ' г у формулі · ' + fmt(share * strength / 100) + '% у готових парфумах';
    }
    find('#formula-total').textContent = 'Заповнено ' + fmt(total) + '% концентрату. Концентрат — ' + fmt(concentrate) + ' г, основа — ' + fmt(mass - concentrate) + ' г.';
}

function addLine(name = '', share = '') {
    const row = element('div', '', 'formula-line');
    const materialLabel = element('label', 'Матеріал');
    const select = document.createElement('select');
    select.required = true;
    for (const value of ['', ...materials.map((item) => item.name)]) select.add(new Option(value || 'Обери матеріал', value));
    select.value = name;
    materialLabel.append(select);

    const shareLabel = element('label', '% у концентраті');
    const input = document.createElement('input');
    Object.assign(input, { type: 'number', min: '0.01', max: '100', step: '0.01', value: share, required: true });
    shareLabel.append(input);

    const remove = element('button', 'Прибрати', 'secondary');
    remove.type = 'button';
    remove.addEventListener('click', () => {
        row.remove();
        if (!lines.children.length) addLine();
        updateTotal();
    });
    row.append(materialLabel, shareLabel, remove, element('small', ''));
    lines.append(row);
    updateTotal();
}

function loadVersion(id, version) {
    currentId = id;
    form.elements.title.value = version.title;
    form.elements.mass.value = version.mass;
    form.elements.strength.value = version.strength;
    lines.replaceChildren();
    version.items.forEach((item) => addLine(item.name, item.share));
    saveMessage.textContent = 'Відкрито збережену версію.';
    form.elements.title.focus();
}

function renderLibrary() {
    const library = find('#library-list');
    library.replaceChildren();
    for (const entry of saved) {
        const item = card(entry.versions[0].title, ['Версій — ' + entry.versions.length]);
        entry.versions.forEach((version, index) => {
            const row = element('p', '');
            const button = element('button', 'Версія ' + (entry.versions.length - index), 'secondary');
            button.addEventListener('click', () => loadVersion(entry.id, version));
            row.append(button, document.createTextNode(' · ' + new Date(version.date).toLocaleString('uk-UA')));
            item.append(row);
        });
        library.append(item);
    }
    if (!saved.length) library.append(element('p', 'Тут з’являться збережені формули.'));
}

const newFormula = element('button', 'Нова формула', 'secondary');
newFormula.type = 'button';
newFormula.addEventListener('click', () => {
    currentId = null;
    form.reset();
    lines.replaceChildren();
    addLine();
    saveMessage.textContent = '';
    form.elements.title.focus();
});
form.querySelector('.actions').prepend(newFormula);

find('#add-line').addEventListener('click', () => addLine());
form.addEventListener('input', updateTotal);
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = form.elements.title.value.trim();
    const items = [...lines.children].map((row) => ({
        name: row.querySelector('select').value,
        share: Number(row.querySelector('input').value)
    }));
    if (!title || !items.length) {
        saveMessage.textContent = 'Вкажи назву й додай матеріали.';
        return;
    }
    const total = items.reduce((sum, item) => sum + Math.round(item.share * 100), 0);
    if (total > 10000) {
        saveMessage.textContent = 'Сума часток перевищує 100%. Зменш частку одного або кількох матеріалів.';
        return;
    }
    if (new Set(items.map((item) => item.name)).size !== items.length) {
        saveMessage.textContent = 'Внеси кожен матеріал в один рядок, об’єднавши його частки.';
        return;
    }
    const version = {
        title,
        mass: Number(form.elements.mass.value),
        strength: Number(form.elements.strength.value),
        items,
        date: new Date().toISOString()
    };
    const previous = saved.find((entry) => entry.id === currentId);
    const entry = { id: previous?.id || crypto.randomUUID(), versions: [version, ...(previous?.versions || [])] };
    const next = [entry, ...saved.filter((item) => item.id !== entry.id)];
    try {
        localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
        saveMessage.textContent = 'Браузер не дозволив зберегти формулу.';
        return;
    }
    saved = next;
    currentId = entry.id;
    renderLibrary();
    saveMessage.textContent = total === 10000 ? 'Версію збережено.' : 'Чернетку збережено. У формулі ще є вільна частка.';
});

addLine();
renderLibrary();
