 let stars = document.getElementById("star");
let header = document.querySelector("header");

let moon = document.getElementById("moon");
const style = window.getComputedStyle(moon);
let topValue = parseInt(style.getPropertyValue('top'));

let backgroundPosition = 0;
window.addEventListener('scroll', function () {
    let scrollValue = window.scrollY;

    backgroundPosition += 1;
    document.body.style.backgroundPosition = backgroundPosition + "0px";

    if (scrollValue > 30) {
        header.style.opacity = 0;
        header.style.display = "none";
    }

    if (scrollValue < 110) {
        header.style.opacity = 1;
        header.style.display = "flex";
    }

    header.style.top = scrollValue * 0.25 + "px";
    moon.style.top = (scrollValue * 0.10 + topValue) + "px";

    let scaleValue = 1 - Math.min(scrollValue / (15 * window.innerHeight), 1);
    moon.style.transform = `scale(${scaleValue})`;
})

function onEntry(entry) {
    entry.forEach(change => {
        if (change.isIntersecting) {
            change.target.classList.add('element-show');
        }
    });
}

let options = {
    threshold: [0.5]
};
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.element-animation');

for (let elm of elements) {
    observer.observe(elm);
}

let isAsteroidActivated = false; // Добавляем новый флаг

moon.addEventListener('click', function () {
    isAsteroidActivated = !isAsteroidActivated; // Переключаем флаг при каждом клике на луну
    console.log('Asteroid is ' + (isAsteroidActivated ? 'activated' : 'deactivated'));

    if (isAsteroidActivated) {
        // Если isAsteroidActivated активирован, отключаем переход по всем ссылкам
        var links = document.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function(event) {
                event.preventDefault();
            });
        }
    } else {
        // Если isAsteroidActivated деактивирован, включаем переход по всем ссылкам
        var links = document.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            links[i].removeEventListener('click', function(event) {
                event.preventDefault();
            });
        }
    }
})

var asteroid = document.getElementById('meteor');
var isAsteroidMoving = false; // Добавляем новый флаг

// Define constants for the tag names and class name
const IGNORED_TAGS = ['html', 'head', 'body', 'main', 'header', 'nav', 'ul'];
const IGNORED_CLASS = ['contact-inform', 'main__wrapper', 'about-us', 'about-inform', 'contact-li'];

// Обработчик события клика для всей страницы
document.body.addEventListener('click', function(event) {
    if (!isAsteroidActivated || isAsteroidMoving) return; // Если астероид уже запущен, мы ничего не делаем

    isAsteroidMoving = true; // Устанавливаем флаг в true, когда астероид запускается

    // Запускаем астероид с анимацией
    var start = null;
    var duration = 1000; // Duration of the animation in milliseconds
    var startX = asteroid.offsetLeft;
    var startY = asteroid.offsetTop;
    var endX = event.clientX;
    var endY = event.clientY;

    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        asteroid.style.left = startX + (endX - startX) * progress + 'px';
        asteroid.style.top = startY + (endY - startY) * progress + 'px';
    
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            isAsteroidMoving = false; // Сбрасываем флаг, когда анимация завершена
        }
    }
    
    // Проверяем, вышел ли астероид за пределы экрана после окончания анимации
    asteroid.addEventListener('transitionend', function() {
        if (asteroid.offsetLeft > window.innerWidth || asteroid.offsetTop > window.innerHeight) {
            // Возвращаем астероид на исходную позицию
            asteroid.style.top = '-30px';
            asteroid.style.left = '0';
        }
    });

    window.requestAnimationFrame(step);

    // Проверяем столкновение с другими элементами
    var elements = document.elementsFromPoint(event.clientX, event.clientY);
    elements.forEach(element => {
        if (element !== asteroid && element !== document.body && !IGNORED_TAGS.includes(element.tagName.toLowerCase()) && !element.classList.contains(IGNORED_CLASS)) {
            // Уничтожаем элемент с анимацией
            setTimeout(function() {
                element.style.display = 'none';
            }, 800);

            setTimeout(function() {
                // Возвращаем астероид на исходную позицию
                asteroid.style.top = '-30px';
                asteroid.style.left = '0';
            }, duration);
        }
    });
});