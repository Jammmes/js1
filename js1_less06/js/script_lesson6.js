'use strict';
//Урок 6

//Устанавливаем обработчик для всех объектов галереи используя "всплытие"
var galImg = document.querySelector('.gallery');
galImg.addEventListener('click', seeBigImg);

//Устанавливаем обработчикb для прокрутки слайдера
var sliderPrev = document.querySelector('.imgBlock__leftArrow');
var sliderNext = document.querySelector('.imgBlock__rightArrow');
sliderPrev.addEventListener('click', prevImg);
sliderNext.addEventListener('click', nextImg);

function seeBigImg (event) {
	//Получаем имя файла
	var src = event.target.src;
    var arrSrc = src.split('/');
    var imageName = arrSrc[arrSrc.length-1];
    //Получаем объекты для изменения
    var product = document.querySelector('.imgBlock__productImg');
    var prodPrice = document.querySelector(".descrBlock__price");
    var prodName = document.querySelector(".descrBlock__name");
    //Очищаем значения объектов
    product.innerHTML = "";
    prodName.innerHTML = "";
    prodPrice.innerHTML = "";
    //Записываем новые данные
    product.src = 'img/' + imageName;
    product.onerror = function () {
        alert("Увеличенное изображение не найдено");
    };
    prodName.innerText = event.target.dataset.name;
    prodPrice.innerText = event.target.dataset.price; 
}

function prevImg (event) {
    //определим имя большого файла
    var bigImg = document.querySelector(".imgBlock__productImg");
    var bigImgSrc = bigImg.src.split('/');
    var imageName = bigImgSrc[bigImgSrc.length-1];
    var j; //этот номер возвращает функция
    console.log("Это имя файла большого фото "+imageName);
    //переберем все элементы галереи в поисках такого же имени превью файла
    var prevImg = document.querySelectorAll(".gallery__img");
        for (var i = 0; i < prevImg.length; i++) {
        var prevItem = prevImg[i].src;
        var prevItemSrc = prevItem.split('/');
        var prevImageName = prevItemSrc[prevItemSrc.length - 1];
            if (imageName == prevImageName) {
                //Найдена превьюшка
                if (i == 0) {
                    j = prevImg.length - 1;
                }
                else {
                    j = i-1;
                }
            }
        }
    //Нужен элемент с индексом j. Сгенерируем на нем событие клик со всплытием
    var event = new Event("click" ,{bubbles: true, cancelable: true});
    prevImg[j].dispatchEvent(event);   
}

function nextImg (event) {
    //определим имя большого файла
    var bigImg = document.querySelector(".imgBlock__productImg");
    var bigImgSrc = bigImg.src.split('/');
    var imageName = bigImgSrc[bigImgSrc.length-1];
    var j; //этот номер возвращает функция
    console.log("Это имя файла большого фото "+imageName);
    //переберем все элементы галереи в поисках такого же имени превью файла
    var nextImg = document.querySelectorAll(".gallery__img");
        for (var i = 0; i < nextImg.length; i++) {
        var nextItem = nextImg[i].src;
        var nextItemSrc = nextItem.split('/');
        var nextImageName = nextItemSrc[nextItemSrc.length - 1];
            if (imageName == nextImageName) {
                //Найдена превьюшка
                if (i == nextImg.length - 1) {
                    j = 0;
                }
                else {
                    j = i+1;
                }
            }
        }
    //Нужен элемент с индексом j. Сгенерируем на нем событие клик со всплытием
    var event = new Event("click" ,{bubbles: true, cancelable: true});
    nextImg[j].dispatchEvent(event);  
}

// Создадим объект basket
var basket = {
    basketProd:[],
    basketPrice:[],
    addItem:function(name,price){
        //Добавляем товары в массив      
        this.basketProd.push(name);
        this.basketPrice.push(price);
        //Выводим содержимое карзины
        var basketList = document.querySelector(".basket__list");
        var basketTotal = document.querySelector(".basket__total");
        basketList.innerHTML = "";
        basketTotal.innerHTML = "";

        //В цикле выводим содержимое корзины
            for (var i = 0; i <this.basketProd.length; i++) {
                // Создадим элемент списка
                var li = document.createElement("li");
                //Присвоим нужные классы для стилей
                li.classList.add("basket__listItem");
                basketTotal.classList.add("basket__total");
                //Внесем данные
                li.innerHTML = this.basketProd[i] + ", " + this.basketPrice[i] + " руб."
                //Разместим элементы согласно разметке
                basketList.appendChild(li);
            }
        //Выводим сумму заказов
        basketTotal.innerText = "Сумма выбранных товаров: " + +this.summ() + " руб.";      
    },

    summ:function(){
        var s = 0;
        for (var i = 0; i <this.basketPrice.length; i++) {
           s+= +this.basketPrice[i];
        }
        return s;
    } 
}

function addProduct(){
    //подготовим данные и передадим в корзину
    var productName = document.querySelector(".descrBlock__name");
    var productPrice = document.querySelector(".descrBlock__price");
    basket.addItem(productName.innerText, productPrice.innerText);
}

function init() {
    var firstImg = document.querySelectorAll(".gallery__img");
    var event = new Event("click" ,{bubbles: true, cancelable: true});
    firstImg[0].dispatchEvent(event);    
}

window.onload = init();