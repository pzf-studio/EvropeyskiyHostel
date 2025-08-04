document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const progressSteps = document.querySelectorAll('.progress-step');
    const bookingSteps = document.querySelectorAll('.booking-step');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const btnSubmit = document.querySelector('.btn-submit');
    const hostelCards = document.querySelectorAll('.hostel-card');
    const checkinDateInput = document.getElementById('checkin-date');
    const checkoutDateInput = document.getElementById('checkout-date');
    const calendarPlaceholder = document.querySelector('.calendar-placeholder');
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalCloseBtnMain = document.getElementById('modal-close-btn');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-indicator');
    
    // Переменные состояния
    let currentStep = 1;
    let selectedHostel = null;
    let checkinDate = null;
    let checkoutDate = null;
    let nightsCount = 0;
    let totalPrice = 0;
    
    // Инициализация дат
    initDates();
    
    // Навигация по шагам
    btnNext.addEventListener('click', nextStep);
    btnPrev.addEventListener('click', prevStep);
    btnSubmit.addEventListener('click', submitBooking);
    
    // Выбор хостела
    hostelCards.forEach(card => {
        card.addEventListener('click', () => {
            hostelCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedHostel = card.getAttribute('data-hostel');
            updateSummary();
        });
    });
    
    // Изменение дат
    checkinDateInput.addEventListener('change', handleDateChange);
    checkoutDateInput.addEventListener('change', handleDateChange);
    
    // Модальное окно
    modalCloseBtn.addEventListener('click', closeModal);
    modalCloseBtnMain.addEventListener('click', closeModal);
    
    // Мобильное меню
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Индикатор навигации
    updateNavIndicator();
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateNavIndicator();
        });
    });
    
    // Функции
    
    function initDates() {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        
        // Форматирование дат для input[type="date"]
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        checkinDateInput.value = formatDate(today);
        checkoutDateInput.value = formatDate(tomorrow);
        checkinDateInput.min = formatDate(today);
        checkoutDateInput.min = formatDate(tomorrow);
        
        checkinDate = today;
        checkoutDate = tomorrow;
        calculateNights();
    }
    
    function handleDateChange() {
        if (!checkinDateInput.value || !checkoutDateInput.value) return;
        
        const newCheckin = new Date(checkinDateInput.value);
        const newCheckout = new Date(checkoutDateInput.value);
        
        // Проверка на корректность дат
        if (newCheckout <= newCheckin) {
            alert('Дата выезда должна быть позже даты заезда');
            checkoutDateInput.value = formatDate(new Date(newCheckin.getTime() + 86400000)); // +1 день
            return;
        }
        
        checkinDate = newCheckin;
        checkoutDate = newCheckout;
        calculateNights();
        updateSummary();
        
        // Здесь можно добавить загрузку календаря
        simulateCalendarLoad();
    }
    
    function calculateNights() {
        if (!checkinDate || !checkoutDate) {
            nightsCount = 0;
            return;
        }
        
        const diffTime = checkoutDate - checkinDate;
        nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalPrice = nightsCount * 500; // 500 руб за ночь
        
        // Применение скидки 10% за 3+ ночей
        if (nightsCount >= 3) {
            totalPrice = totalPrice * 0.9;
        }
    }
    
    function updateSummary() {
        document.getElementById('summary-hostel').textContent = selectedHostel || 'Не выбран';
        
        if (checkinDate && checkoutDate) {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const checkinStr = checkinDate.toLocaleDateString('ru-RU', options);
            const checkoutStr = checkoutDate.toLocaleDateString('ru-RU', options);
            document.getElementById('summary-dates').textContent = `${checkinStr} - ${checkoutStr}`;
            document.getElementById('confirmation-dates').textContent = `${checkinStr} - ${checkoutStr}`;
        } else {
            document.getElementById('summary-dates').textContent = 'Не выбраны';
        }
        
        document.getElementById('summary-nights').textContent = nightsCount;
        document.getElementById('summary-total').textContent = `${totalPrice}₽`;
        document.getElementById('confirmation-total').textContent = `${totalPrice}₽`;
        
        if (selectedHostel) {
            document.getElementById('confirmation-hostel').textContent = selectedHostel;
        }
    }
    
    function nextStep() {
        // Валидация перед переходом на следующий шаг
        if (currentStep === 1 && !selectedHostel) {
            alert('Пожалуйста, выберите хостел');
            return;
        }
        
        if (currentStep === 2 && (!checkinDate || !checkoutDate)) {
            alert('Пожалуйста, выберите даты заезда и выезда');
            return;
        }
        
        // Переход на следующий шаг
        progressSteps[currentStep - 1].classList.remove('active');
        bookingSteps[currentStep - 1].classList.remove('active');
        
        currentStep++;
        
        progressSteps[currentStep - 1].classList.add('active');
        bookingSteps[currentStep - 1].classList.add('active');
        
        // Обновление кнопок навигации
        updateNavigationButtons();
    }
    
    function prevStep() {
        // Переход на предыдущий шаг
        progressSteps[currentStep - 1].classList.remove('active');
        bookingSteps[currentStep - 1].classList.remove('active');
        
        currentStep--;
        
        progressSteps[currentStep - 1].classList.add('active');
        bookingSteps[currentStep - 1].classList.add('active');
        
        // Обновление кнопок навигации
        updateNavigationButtons();
    }
    
    function updateNavigationButtons() {
        btnPrev.disabled = currentStep === 1;
        
        if (currentStep === 3) {
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'inline-flex';
        } else {
            btnNext.style.display = 'inline-flex';
            btnSubmit.style.display = 'none';
        }
    }
    
    function submitBooking() {
        // Валидация формы
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        
        if (!nameInput.value.trim()) {
            alert('Пожалуйста, введите ваше имя');
            nameInput.focus();
            return;
        }
        
        if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
            alert('Пожалуйста, введите корректный email');
            emailInput.focus();
            return;
        }
        
        // Генерация номера бронирования
        const bookingNumber = `HST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        document.getElementById('booking-number').textContent = bookingNumber;
        
        // Показ модального окна
        confirmationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Анимация появления
        gsap.from('.modal-content', {
            duration: 0.5,
            y: 50,
            opacity: 0,
            ease: 'back.out(1.7)'
        });
    }
    
    function closeModal() {
        confirmationModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function toggleMobileMenu() {
        nav.classList.toggle('active');
        mobileMenuBtn.innerHTML = nav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    }
    
    function updateNavIndicator() {
        const activeLink = document.querySelector('.nav-links a.active');
        if (!activeLink || !navIndicator) return;
        
        navIndicator.style.width = `${activeLink.offsetWidth}px`;
        navIndicator.style.height = `${activeLink.offsetHeight}px`;
        navIndicator.style.left = `${activeLink.offsetLeft}px`;
        navIndicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
    }
    
    function simulateCalendarLoad() {
        calendarPlaceholder.innerHTML = `
            <div class="calendar">
                <div class="calendar-header">
                    <button class="calendar-prev"><i class="fas fa-chevron-left"></i></button>
                    <h4>${getMonthYearString(checkinDate)}</h4>
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
                    ${generateCalendarDays(checkinDate)}
                </div>
            </div>
        `;
    }
    
    function generateCalendarDays(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        let daysHtml = '';
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Пн-Вс (0-6)
        
        // Пустые ячейки для начала месяца
        for (let i = 0; i < startDay; i++) {
            daysHtml += '<div class="calendar-empty"></div>';
        }
        
        // Дни месяца
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const currentDate = new Date(year, month, day);
            const isBooked = Math.random() < 0.2; // 20% chance to be booked
            const isSelected = isSameDay(currentDate, checkinDate) || isSameDay(currentDate, checkoutDate);
            const isInRange = currentDate > checkinDate && currentDate < checkoutDate;
            
            let dayClass = 'calendar-day';
            if (isBooked) dayClass += ' booked';
            if (isSameDay(currentDate, checkinDate)) dayClass += ' selected-start';
            if (isSameDay(currentDate, checkoutDate)) dayClass += ' selected-end';
            if (isInRange) dayClass += ' selected-range';
            
            daysHtml += `<div class="${dayClass}">${day}</div>`;
        }
        
        return daysHtml;
    }
    
    function getMonthYearString(date) {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Прокрутка шапки при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Инициализация при загрузке
    updateNavigationButtons();
    simulateCalendarLoad();
});