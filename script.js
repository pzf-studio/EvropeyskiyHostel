// script.js

// ==================== Инициализация слайдера hero-секции ====================
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.pagination-dots');
    let currentSlide = 0;
    let slideInterval;

    // Создание точек пагинации
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(index);
            startSlideTimer();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function startSlideTimer() {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    // Запуск автоматической смены слайдов
    startSlideTimer();
}

function initBookingSystem() {
    const bookingForm = document.getElementById('booking-form');
    const steps = document.querySelectorAll('.booking-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const hostelCards = document.querySelectorAll('.hostel-card');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');
    const bookingControls = document.querySelector('.booking-controls');
    
    let currentStep = 1;
    let selectedHostel = null;
    let checkinDate = null;
    let checkoutDate = null;
    
    // Обработчики для карточек хостелов
    hostelCards.forEach(card => {
        card.addEventListener('click', () => {
            hostelCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedHostel = card.dataset.hostel;
        });
    });
    
    // Обработчики для кнопок навигации
    nextBtn.addEventListener('click', goToNextStep);
    prevBtn.addEventListener('click', goToPrevStep);
    submitBtn.addEventListener('click', submitBooking);
    
    // Обработчики для дат
    document.getElementById('checkin-date').addEventListener('change', updateDates);
    document.getElementById('checkout-date').addEventListener('change', updateDates);
    
    // Функция перехода к следующему шагу
    function goToNextStep() {
        if (currentStep === 1 && !selectedHostel) {
            alert('Пожалуйста, выберите хостел');
            return;
        }
        
        if (currentStep === 2 && (!checkinDate || !checkoutDate)) {
            alert('Пожалуйста, выберите даты заезда и выезда');
            return;
        }
        
        // Обновляем шаги
        steps.forEach(step => step.classList.remove('active'));
        progressSteps.forEach(step => step.classList.remove('active'));
        
        currentStep++;
        
        document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step:nth-child(${currentStep})`).classList.add('active');
        
        // Обновляем кнопки
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === 3) {
            updateBookingSummary();
            bookingControls.classList.add('step-3');
        }
    }
    
    // Функция перехода к предыдущему шагу
    function goToPrevStep() {
        steps.forEach(step => step.classList.remove('active'));
        progressSteps.forEach(step => step.classList.remove('active'));
        
        currentStep--;
        
        document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step:nth-child(${currentStep})`).classList.add('active');
        
        // Обновляем кнопки
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep < 3) {
            bookingControls.classList.remove('step-3');
        }
    }
    
    // Обновление дат
    function updateDates() {
        checkinDate = document.getElementById('checkin-date').value;
        checkoutDate = document.getElementById('checkout-date').value;
        
        if (checkinDate && checkoutDate) {
            // Здесь будет логика для календаря
            generateCalendarPreview();
        }
    }
    
    // Генерация календаря
    function generateCalendarPreview() {
        const placeholder = document.querySelector('.calendar-placeholder');
        placeholder.innerHTML = `
            <div class="calendar">
                <div class="calendar-header">
                    <button class="calendar-prev"><i class="fas fa-chevron-left"></i></button>
                    <h4>Май 2025</h4>
                    <button class="calendar-next"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="calendar-grid">
                    <div class="calendar-weekday">Пн</div>
                    <div class="calendar-weekday">Вт</div>
                    <div class="calendar-weekday">Ср</div>
                    <div class="calendar-weekday">Чт</div>
                    <div class="calendar-weekday">Пт</div>
                    <div class="calendar-weekday">Сб</div>
                    <div class="calendar-weekday">Вс</div>
                    
                    <!-- Пустые ячейки для первого дня месяца -->
                    <div class="calendar-empty"></div>
                    <div class="calendar-empty"></div>
                    <div class="calendar-empty"></div>
                    
                    <!-- Дни месяца -->
                    ${Array.from({length: 31}, (_, i) => {
                        const day = i + 1;
                        let className = 'calendar-day';
                        
                        // Пример: выделяем занятые даты
                        if (day % 7 === 0 || day % 5 === 0) className += ' booked';
                        if (day === 15) className += ' selected-start';
                        if (day === 20) className += ' selected-end';
                        if (day > 15 && day < 20) className += ' selected-range';
                        
                        return `<div class="${className}">${day}</div>`;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // Обновление сводки бронирования
    function updateBookingSummary() {
        document.getElementById('summary-hostel').textContent = selectedHostel;
        
        if (checkinDate && checkoutDate) {
            const nights = calculateNights(checkinDate, checkoutDate);
            const pricePerNight = 500; // Базовая цена
            let total = nights * pricePerNight;
            
            // Скидка 10% при бронировании от 3 ночей
            if (nights >= 3) {
                total *= 0.9;
            }
            
            document.getElementById('summary-dates').textContent = 
                `${formatDate(checkinDate)} - ${formatDate(checkoutDate)}`;
            document.getElementById('summary-nights').textContent = nights;
            document.getElementById('summary-total').textContent = `${total.toFixed(0)}₽`;
        }
    }
    
    // Расчет количества ночей
    function calculateNights(checkin, checkout) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(checkin);
        const secondDate = new Date(checkout);
        return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    }
    
    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short'
        });
    }
    
    // Отправка формы
    function submitBooking(e) {
        e.preventDefault();
        
        // Здесь будет AJAX запрос
        alert('Бронирование успешно отправлено! С вами свяжутся для подтверждения.');
        
        // Сброс формы
        bookingForm.reset();
        hostelCards.forEach(card => card.classList.remove('selected'));
        goToStep(1);
    }
    
    // Инициализация системы бронирования
    function init() {
        // Устанавливаем минимальную дату - сегодня
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('checkin-date').min = today;
        
        // Генерируем календарь при загрузке
        generateCalendarPreview();
    }
    
    init();
}

// ==================== Индикатор навигации в шапке ====================
function initNavIndicator() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-indicator');
    const btn = document.querySelector('.nav .btn');
    
    // Установка позиции индикатора
    function setIndicatorPosition(element) {
        const rect = element.getBoundingClientRect();
        const navRect = document.querySelector('.nav').getBoundingClientRect();
        
        navIndicator.style.width = `${rect.width}px`;
        navIndicator.style.height = `${rect.height}px`;
        navIndicator.style.left = `${rect.left - navRect.left}px`;
        navIndicator.style.top = `${rect.top - navRect.top}px`;
        navIndicator.style.opacity = '1';
    }
    
    // Инициализация для первого элемента
    if (navLinks.length > 0) {
        setIndicatorPosition(navLinks[0]);
    }
    
    // Обработчики для пунктов меню
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            setIndicatorPosition(link);
        });
        
        link.addEventListener('click', () => {
            setIndicatorPosition(link);
        });
    });
    
    // Скрытие индикатора при наведении на кнопку
    btn.addEventListener('mouseenter', () => {
        navIndicator.style.opacity = '0';
    });
    
    // Восстановление индикатора
    btn.addEventListener('mouseleave', () => {
        if (document.querySelector('.nav-links a:hover')) {
            setIndicatorPosition(document.querySelector('.nav-links a:hover'));
        } else {
            setIndicatorPosition(document.querySelector('.nav-links a:first-child'));
        }
    });
}

// ==================== Система частиц для hero-секции ====================
const initParticles = () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 150;
    
    // Создание частиц
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `hsla(${Math.random() * 60 + 180}, 100%, 70%, ${Math.random() * 0.5 + 0.1})`
        });
    }
    
    // Отслеживание позиции мыши
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };
    
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Анимация частиц
    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            // Движение частиц
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Реакция на курсор мыши
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                p.x += Math.cos(angle) * force * 5;
                p.y += Math.sin(angle) * force * 5;
            }
            
            // Переход через границы
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            // Отрисовка частицы
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Соединение частиц линиями
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `hsla(180, 100%, 70%, ${0.1 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
};

// ==================== Магнитный эффект для кнопки ====================
const initMagneticEffect = () => {
    const btn = document.querySelector('.magnetic');
    if (!btn) return;
    
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (x - centerX) / centerX * 10;
        const angleY = (y - centerY) / centerY * 10;
        
        btn.style.transform = `perspective(1000px) rotateY(${angleX}deg) rotateX(${-angleY}deg) scale(1.05)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    });
};

// ==================== Параллакс-эффект для фона ====================


// ==================== 3D сцена с использованием Three.js ====================
const initThreeJS = () => {
    // Проверка наличия контейнера
    const container = document.getElementById('webgl-container');
    if (!container) return;
    
    // Проверка поддержки WebGL
    if (typeof WEBGL === 'undefined' || !WEBGL.isWebGLAvailable()) {
        console.warn('WebGL не поддерживается');
        return;
    }
    
    // Создание сцены
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Загрузка 3D модели
    const loader = new THREE.GLTFLoader();
    loader.load('models/hostel.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.y = -1;
        scene.add(model);
        
        // Анимация вращения модели
        gsap.to(model.rotation, { 
            y: Math.PI * 2, 
            duration: 30, 
            repeat: -1, 
            ease: 'linear' 
        });
    }, undefined, (error) => {
        console.error('Ошибка загрузки модели:', error);
    });
    
    // Настройка освещения
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00ffea, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Позиция камеры
    camera.position.z = 5;
    
    // Функция анимации
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// ==================== Инициализация всех компонентов ====================
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация слайдера hero-секции
    initHeroSlider();
    
    // Инициализация индикатора навигации
    initNavIndicator();
    
    // Инициализация системы частиц
    initParticles();
    
    // Инициализация магнитного эффекта для кнопки
    initMagneticEffect();
    
    // Инициализация параллакс-эффекта
    initBookingSystem();
    
    // Инициализация 3D сцены
    initThreeJS();
    
    // Дополнительные анимации при скролле
    gsap.utils.toArray('.grid-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2
        });
    });
    
    // Параллакс для галереи
    gsap.utils.toArray('.gallery-item').forEach(item => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                scrub: true
            },
            y: (i) => i % 2 ? -50 : 50
        });
    });
    
    // Обработчик мобильного меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
});

// ==================== Дополнительные функции ====================
// Анимация для цен
function animatePrices() {
    gsap.to('.price', {
        scale: 1.1,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
    });
}

// Инициализация карты
function initMap() {
    // Код инициализации Яндекс.Карт
    ymaps.ready(init);
    
    function init() {
        // ...существующий код карты...
    }
}

function initNavIndicator() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-indicator');
    const btn = document.querySelector('.nav .btn');
    
    // Устанавливаем начальную позицию
    function setIndicatorPosition(element) {
        const rect = element.getBoundingClientRect();
        const navRect = document.querySelector('.nav').getBoundingClientRect();
        
        navIndicator.style.width = `${rect.width}px`;
        navIndicator.style.height = `${rect.height}px`;
        navIndicator.style.left = `${rect.left - navRect.left}px`;
        navIndicator.style.top = `${rect.top - navRect.top}px`;
        navIndicator.style.opacity = '1';
    }
    
    // Инициализация для первого элемента
    if (navLinks.length > 0) {
        setIndicatorPosition(navLinks[0]);
    }
    
    // Обработчики для пунктов меню
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            setIndicatorPosition(link);
        });
        
        link.addEventListener('click', () => {
            setIndicatorPosition(link);
        });
    });
    
    // Скрываем индикатор при наведении на кнопку
    btn.addEventListener('mouseenter', () => {
        navIndicator.style.opacity = '0';
    });
    
    // Возвращаем индикатор при выходе из кнопки
    btn.addEventListener('mouseleave', () => {
        if (document.querySelector('.nav-links a:hover')) {
            setIndicatorPosition(document.querySelector('.nav-links a:hover'));
        } else {
            setIndicatorPosition(document.querySelector('.nav-links a:first-child'));
        }
    });
}

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initNavIndicator();
    // Остальной код инициализации...
});

// Инициализация галереи
function initGallery() {
    // Данные галереи
    const galleryData = {
        "Бульвар Дмитрия донского": {
            address: "Москва, Бульвар Дмитрия Донского, 17",
            images: [
                'images/hostel1/1.jpg', 'images/hostel1/2.jpg', 'images/hostel1/3.jpg',
                'images/hostel1/4.jpg', 'images/hostel1/5.jpg', 'images/hostel1/6.jpg'
            ]
        },
        "Пражская": {
            address: "Москва, Кировоградская улица, 17к1А",
            images: [
                'images/hostel2/1.jpg', 'images/hostel2/2.jpg', 'images/hostel2/3.jpg',
                'images/hostel2/4.jpg', 'images/hostel2/5.jpg', 'images/hostel2/6.jpg'
            ]
        },
        "Нахимовский проспект": {
            address: "Москва, Варшавское шоссе 60",
            images: [
                'images/hostel3/1.jpg', 'images/hostel3/2.jpg', 'images/hostel3/3.jpg',
                'images/hostel3/4.jpg', 'images/hostel3/5.jpg', 'images/hostel3/6.jpg'
            ]
        },
        "Балтийская": {
            address: "Москва, Ленинградское шоссе 25к1",
            images: [
                'images/hostel4/1.jpg', 'images/hostel4/2.jpg', 'images/hostel4/3.jpg',
                'images/hostel4/4.jpg', 'images/hostel4/5.jpg', 'images/hostel4/6.jpg'
            ]
        }
    };

    // DOM элементы
    const mainImage = document.querySelector('.main-image');
    const addressText = document.querySelector('.address-text');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const thumbnailsRows = document.querySelectorAll('.thumbnails-row');
    
    // Состояние галереи
    let currentHostel = null;
    let currentImageIndex = 0;
    let allImages = [];
    let currentHostelImages = [];
    let slideInterval;
    
    // Создаем массив всех изображений для случайной галереи
    Object.keys(galleryData).forEach(hostel => {
        galleryData[hostel].images.forEach(img => {
            allImages.push({
                image: img,
                hostel: hostel,
                address: galleryData[hostel].address
            });
        });
    });
    
    // Инициализация миниатюр
    Object.keys(galleryData).forEach((hostel, hostelIndex) => {
        const thumbnailsRow = thumbnailsRows[hostelIndex];
        
        galleryData[hostel].images.forEach((img, imgIndex) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            thumbnail.dataset.hostel = hostel;
            thumbnail.dataset.index = imgIndex;
            
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = `Фото хостела ${hostel} ${imgIndex + 1}`;
            imgElement.loading = 'lazy';
            
            thumbnail.appendChild(imgElement);
            thumbnailsRow.appendChild(thumbnail);
            
            // Обработчик клика по миниатюре
            thumbnail.addEventListener('click', () => {
                selectThumbnail(hostel, imgIndex);
                resetTimer();
            });
        });
    });
    
    // Функция выбора миниатюры
    function selectThumbnail(hostel, index) {
        // Сброс активного класса у миниатюр
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        // Установка активного класса выбранной миниатюре
        const activeThumbnail = document.querySelector(`.thumbnail[data-hostel="${hostel}"][data-index="${index}"]`);
        if (activeThumbnail) {
            activeThumbnail.classList.add('active');
        }
        
        const mainSlide = document.querySelector('.main-slide');
        const currentImage = mainSlide.querySelector('.main-image.active');
        const newImage = document.createElement('img');
        
        newImage.src = galleryData[hostel].images[index];
        newImage.alt = `Фото хостела ${hostel}`;
        newImage.classList.add('main-image');
        
        // Добавляем новое изображение в контейнер
        mainSlide.appendChild(newImage);
        
        // Начинаем анимацию перехода
        setTimeout(() => {
            // Показываем новое изображение
            newImage.style.opacity = 1;
            newImage.classList.add('active');
            
            // Скрываем старое изображение
            if (currentImage) {
                currentImage.style.opacity = 0;
                
                // Удаляем старое изображение после анимации
                setTimeout(() => {
                    if (currentImage.parentNode) {
                        currentImage.parentNode.removeChild(currentImage);
                    }
                }, 700);
            }
        }, 50);
        
        currentHostel = hostel;
        currentImageIndex = index;
        currentHostelImages = galleryData[hostel].images;
        
        // Обновление адреса
        updateAddress(galleryData[hostel].address);
    }
        
    // Функция обновления адреса
    function updateAddress(address) {
        addressText.textContent = address;
        addressText.classList.remove('address-change');
        void addressText.offsetWidth; // Триггер перерисовки
        addressText.classList.add('address-change');
    }
    
    // Следующее изображение
    function nextImage() {
        if (!currentHostel) return;
        
        currentImageIndex = (currentImageIndex + 1) % currentHostelImages.length;
        selectThumbnail(currentHostel, currentImageIndex);
    }

    // Обновленная функция prevImage
    function prevImage() {
        if (!currentHostel) return;
        
        currentImageIndex = (currentImageIndex - 1 + currentHostelImages.length) % currentHostelImages.length;
        selectThumbnail(currentHostel, currentImageIndex);
    }

    // Обновленная функция randomImage
    function randomImage() {
        const randomIndex = Math.floor(Math.random() * allImages.length);
        const randomImage = allImages[randomIndex];
        
        currentHostel = randomImage.hostel;
        currentHostelImages = galleryData[currentHostel].images;
        currentImageIndex = galleryData[currentHostel].images.indexOf(randomImage.image);
        
        selectThumbnail(currentHostel, currentImageIndex);
    }
    
    // Запуск таймера
    function startTimer() {
        slideInterval = setInterval(randomImage, 5000);
    }
    
    // Сброс таймера
    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }
    
    // Обработчики кнопок
    prevBtn.addEventListener('click', () => {
        prevImage();
        resetTimer();
    });
    
    nextBtn.addEventListener('click', () => {
        nextImage();
        resetTimer();
    });
    
    // Обработчик клика по основному изображению для увеличения
    mainImage.addEventListener('click', () => {
        mainImage.classList.toggle('zoomed');
    });
    
    // Выбираем первую миниатюру по умолчанию
    setTimeout(() => {
        selectThumbnail("Бульвар Дмитрия донского", 0);
        startTimer();
    }, 100);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initGallery);

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('main-image')) {
        e.target.classList.toggle('zoomed');
    }
});

function initInteractiveFeatures() {
    // Анимация индикаторов
    const speedBar = document.querySelector('.speed-bar');
    const distanceBar = document.querySelector('.distance-bar');
    
    if (speedBar) {
        const speed = speedBar.dataset.speed;
        setTimeout(() => {
            speedBar.style.width = `${speed}%`;
        }, 300);
    }
    
    if (distanceBar) {
        const distance = distanceBar.dataset.distance;
        setTimeout(() => {
            distanceBar.style.width = `${distance * 10}%`;
        }, 300);
    }
    
    // Анимация звезд рейтинга
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        const rating = parseFloat(starsContainer.dataset.rating);
        const stars = starsContainer.querySelectorAll('i');
        
        stars.forEach((star, index) => {
            if (rating >= index + 1) {
                star.style.opacity = '1';
            } else if (rating > index && rating < index + 1) {
                star.classList.remove('fa-star');
                star.classList.add('fa-star-half-alt');
                star.style.opacity = '1';
            }
        });
    }
    
    // Анимация кругового индикатора
    const gaugeCircle = document.querySelector('.gauge-circle');
    if (gaugeCircle) {
        const percent = parseInt(gaugeCircle.dataset.percent);
        gaugeCircle.style.background = `conic-gradient(#3b82f6 0deg, #1e3a8a ${percent}%, transparent ${percent}%)`;
    }
}

// Вызовите функцию при загрузке
document.addEventListener('DOMContentLoaded', initInteractiveFeatures);

// Инициализация сертификатов
function initCertificates() {
    const certificatePreviews = document.querySelectorAll('.certificate-preview');
    const certificateFulls = document.querySelectorAll('.certificate-full');
    const closeButtons = document.querySelectorAll('.close-certificate');
    
    // Обработчик для открытия сертификата
    certificatePreviews.forEach((preview, index) => {
        preview.addEventListener('click', () => {
            certificateFulls[index].classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Обработчик для закрытия сертификата
    closeButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            certificateFulls[index].classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие при клике вне изображения
    certificateFulls.forEach(full => {
        full.addEventListener('click', (e) => {
            if (e.target === full) {
                full.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            certificateFulls.forEach(full => {
                full.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// Добавьте вызов функции в DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initCertificates();
    // ... остальной код инициализации ...
});