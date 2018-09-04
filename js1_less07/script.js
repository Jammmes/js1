var FIELD_SIZE_X = 20;
var FIELD_SIZE_Y = 20;
var SNAKE_SPEED = 200; // интервал в мс между перемещениями змейки
var TROUBLE_COUNT = 5; // количество создаваемых препятствий
var snake = []; // змейка
var direction = "x-" // змейка движется вверх
var gameIsRunnig = false; // игра не запущена
var snake_timer;
var game_timer;
var trouble_timer;
var food_timer;
var score = 0;

function init() {
    prepareGameField();
    document.querySelector('#snake-start').addEventListener('click', startGame);
    document.querySelector('#snake-renew').addEventListener('click', refreshGame);
    addEventListener('keydown', changeDirection);
}

// создание игрового поля
function prepareGameField() {
    var game_table = document.createElement('table');
    game_table.classList.add('game-table');

    // в цикле генерируем ячейки игровой таблицы
    for (var i = 0; i < FIELD_SIZE_X; i++) {
        var row = document.createElement('tr');
        row.classList.add('game-table-row');
        row.dataset.row = i;

        for (var j = 0; j < FIELD_SIZE_Y; j++) {
            var cell = document.createElement('td');
            cell.classList.add('game-table-cell');
            cell.dataset.cell = i + '-' + j;

            row.appendChild(cell);
        }
        game_table.appendChild(row);
    }
    //document.querySelector('#snake-field').appendChild(game_table);
    var field = document.querySelector('#snake-field');
    var stat = document.querySelector("#snake-stat");
    field.insertBefore(game_table, stat);
}

// запуск игры
function startGame() {
    gameIsRunnig = true;
    respawn();

    snake_timer = setInterval(move, SNAKE_SPEED);
    game_timer = setInterval(showTimer, 100);
    setTimeout(createFood, 500);
    setTimeout(function() { createTroubles(TROUBLE_COUNT) }, 500);

    //обновляем счет на странице
    showScore();
}

// распологаем змейку на игровом поле
function respawn() {
    // змейка - это массив элементов td.game-table-cell
    // стартовая длина змейки - 2

    // начинаем из центра
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

    var snake_head = document.querySelector("[data-cell='" + start_coord_x + '-' + start_coord_y + "']");
    var snake_tail = document.querySelector("[data-cell='" + (start_coord_x - 1) + "-" + start_coord_y + "']");
    snake_head.classList.add('snake-unit');
    snake_tail.classList.add('snake-unit');

    snake.push(snake_head, snake_tail);
}

// движение змейки
function move() {
    var snake_head = snake[snake.length - 1];

    // сдвигаем голову змейки на 1 клетку
    var new_unit;
    var snake__choords = snake_head.dataset.cell.split('-');
    var choord_x = parseInt(snake__choords[0]);
    var choord_y = parseInt(snake__choords[1]);

    // определяем новую точку
    if (direction == "x-") {
        //new_unit = document.querySelector("[data-cell='" + (choord_x - 1) + '-' +  choord_y + "']");
        new_unit = document.querySelector("[data-cell='" + newChoord(choord_x, '-') + '-' + choord_y + "']");
    } else if (direction == "x+") {
        new_unit = document.querySelector("[data-cell='" + newChoord(choord_x, '+') + '-' + choord_y + "']");
    } else if (direction == "y+") {
        new_unit = document.querySelector("[data-cell='" + choord_x + '-' + newChoord(choord_y, '+') + "']");
    } else if (direction == "y-") {
        new_unit = document.querySelector("[data-cell='" + choord_x + '-' + newChoord(choord_y, '-') + "']");
    }
    // проверяем, что new_unit – это не часть змейки
    // так же проверим, что змейка не дошла до границы и не встретила препятствие
    if (!isSnakeUnit(new_unit) && new_unit !== null && !haveTrouble(new_unit)) {
        new_unit.classList.add('snake-unit');

        //Перерисовываем голову
        new_unit.classList.add('snake-head');
        for (i = 0; i < snake.length; i++) {
            snake[i].classList.remove('snake-head');
        }

        snake.push(new_unit);

        // проверка на еду
        if (!haveFood(new_unit)) {
            // находим удаляемый элемент
            var removed = snake.splice(0, 1)[0];
            removed.classList.remove('snake-unit', 'snake-head', 'snake-eating');
        }

    } else {
        // если новая клетка - часть змейки или препятствие, то заканчиваем игру
        snake[snake.length - 1].classList.add('snake-dead');
        finishTheGame();
    }
}

// Переопределяем координаты для эффекта отсутствия стен
function newChoord(choord, operat) {
    var newChoord;

    switch (operat) {
        case '+':
            newChoord = +choord + 1;
            if (newChoord > 19) {
                newChoord = 0;
            }
            return newChoord;
            break;
        case '-':
            newChoord = +choord - 1;
            if (newChoord < 0) {
                newChoord = 19;
            }
            return newChoord;
            break;
    }
}

// проверяем элемент на принадлежность змейке
function isSnakeUnit(unit) {
    var check = false;

    if (snake.includes(unit)) {
        check = true;
    }

    return check;
}

// проверяем встречу с едой
function haveFood(unit) {
    var check = false;
    var isSnakeEating = unit.classList.contains('food-unit');
    unit.classList.remove('food-unit');
    // змейка нашла еду
    if (isSnakeEating) {
        check = true;

        //Добавляем анимацию при встрече с едой
        snake[snake.length - 1].classList.add('snake-eating');

        // создаем новую еду
        createFood();

        // Убираем старое препятствие препятствие 
        removeTroubles();

        // Создаем новое препятствие
        createTroubles(TROUBLE_COUNT);

        // увеличиваем счет
        score++;

        //обновляем счет на странице
        showScore();
    }
    return check;
}


//проверяем встречу с препятствием
function haveTrouble(unit) {
    var check = false;
    var isTrouble = unit.classList.contains('trouble-unit');

    if (isTrouble) {
        check = true;
    }
    return check;
}

// создаем еду
function createFood() {
    var foodCreated = false;

    while (!foodCreated) {
        // выбираем случайную клетку
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var food_cell = document.querySelector("[data-cell='" + food_x + '-' + food_y + "']");

        var isSnake = food_cell.classList.contains('snake-unit');

        // если тут нет змейки
        if (!isSnake) {
            // ставим сюда еду
            food_cell.classList.add('food-unit');
            foodCreated = true;
        }
    }
}

// Создаем препятствие
function createTrouble() {
    var troubleCreated = false;

    while (!troubleCreated) {
        // выбираем случайную клетку
        var trouble_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var trouble_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var trouble_cell = document.querySelector("[data-cell='" + trouble_x + '-' + trouble_y + "']");

        var isSnake = trouble_cell.classList.contains('snake-unit');
        var isFood = trouble_cell.classList.contains('food-unit');

        // если тут нет змейки или еды
        if (!isSnake && !isFood) {
            // ставим сюда препятствие
            trouble_cell.classList.add('trouble-unit');
            troubleCreated = true;
        }
    }
}

// Создание нескольких препятствий
function createTroubles(countTrouble) {
    for (var i = 0; i < countTrouble; i++) {

        setTimeout(createTrouble, 400);
    }
}

// Убираем все препятствия
function removeTroubles() {

    var trouble_cells = document.querySelectorAll('.trouble-unit');
    if (trouble_cells != null) {
        for (var i = 0; i < trouble_cells.length; i++) {
            trouble_cells[i].classList.remove('trouble-unit');
        }
    }
}

// меняем движение змейки
function changeDirection(e) { // event
    switch (e.keyCode) {
        case 37: // если нажата клавиша влево
            if (direction != "y+") {
                direction = "y-"
            }
            break;
        case 38: // если нажата клавиша вверх
            if (direction != "x+") {
                direction = "x-"
            }
            break;
        case 39: // если нажата клавиша вправо
            if (direction != "y-") {
                direction = "y+"
            }
            break;
        case 40: // если нажата клавиша вниз
            if (direction != "x-") {
                direction = "x+"
            }
            break;
    }
}

// дейстия для завершения игры
function finishTheGame() {
    gameIsRunnig = false;
    clearInterval(snake_timer);
    clearInterval(game_timer);
    setTimeout(function() { alert('Game over! Your score is ' + score) }, 800);

}

// новая игра
function refreshGame() {
    location.reload();
}

window.onload = init;

// Отображение набранных очков
function showScore() {
    var scoreEl = document.querySelector('#score');
    scoreEl.innerText = "";
    scoreEl.innerText = score;
}

// Отображение времени игры
function showTimer() {
    var timeLabel = document.querySelector('#time');
    timeLabel.innerText = +timeLabel.innerText + 1;
}