// Переменная для хранения текущего вошедшего пользователя
let currentUser = null;

/* Инициализация "Базы данных" в localStorage */
if (!localStorage.getItem('usersDB')) {
    localStorage.setItem('usersDB', JSON.stringify({}));
}

// DOM элементы
const authContainer = document.getElementById('auth-container');
const gameContainer = document.getElementById('game-container');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const submitBtn = document.getElementById('submit-btn');
const toggleLink = document.getElementById('toggle-link');
const toggleAuthText = document.getElementById('toggle-auth');
const authMessage = document.getElementById('auth-message');

const userDisplay = document.getElementById('user-display');
const damageDisplay = document.getElementById('damage-display');
const attackBtn = document.getElementById('attack-btn');
const logoutBtn = document.getElementById('logout-btn');

let isLoginMode = true; // Режим: вход (true) или регистрация (false)

// Переключение между Входом и Регистрацией
toggleLink.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    authMessage.innerText = "";
    if (isLoginMode) {
        authTitle.innerText = "Вход в аккаунт";
        submitBtn.innerText = "Войти";
        toggleAuthText.innerHTML = 'Нет аккаунта? <span id="toggle-link">Зарегистрироваться</span>';
    } else {
        authTitle.innerText = "Регистрация";
        submitBtn.innerText = "Создать аккаунт";
        toggleAuthText.innerHTML = 'Уже есть аккаунт? <span id="toggle-link">Войти</span>';
    }
    // Переназначаем событие, так как переписали innerHTML
    document.getElementById('toggle-link').addEventListener('click', arguments.callee);
});

// Обработка отправки формы (Логин / Регистрация)
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Достаем актуальную БД
    const db = JSON.parse(localStorage.getItem('usersDB'));

    if (isLoginMode) {
        // Логика Входа
        if (db[username] && db[username].password === password) {
            loginUser(username, db[username].damage);
        } else {
            authMessage.innerText = "Неверный логин или пароль!";
        }
    } else {
        // Логика Регистрации
        if (db[username]) {
            authMessage.innerText = "Пользователь с таким логином уже существует!";
        } else {
            // Записываем нового пользователя в БД
            db[username] = { password: password, damage: 0 };
            localStorage.setItem('usersDB', JSON.stringify(db));
            authMessage.style.color = "lightgreen";
            authMessage.innerText = "Регистрация успешна! Войдите.";
            // Автопереключение на вход
            toggleLink.click();
        }
    }
});

// Функция успешного входа
function loginUser(username, currentDamage) {
    currentUser = username;
    authContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    userDisplay.innerText = username;
    damageDisplay.innerText = currentDamage;
    authForm.reset();
    authMessage.innerText = "";
    authMessage.style.color = "#ff4d4d";
}

// Кнопка АТАКИ
attackBtn.addEventListener('click', () => {
    if (!currentUser) return;

    const db = JSON.parse(localStorage.getItem('usersDB'));
    
    // Увеличиваем урон в нашей "БД"
    db[currentUser].damage += 10; 
    
    // Сохраняем изменения в локальное хранилище
    localStorage.setItem('usersDB', JSON.stringify(db));
    
    // Обновляем на экране
    damageDisplay.innerText = db[currentUser].damage;
});

// Выход из аккаунта
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    gameContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
});
