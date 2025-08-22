document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const tabButtons = document.querySelectorAll('.tab-btn');
    const priceTables = document.querySelectorAll('.price-table');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-indicator');
    
    // Переключение табов
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const hostel = button.getAttribute('data-hostel');
            
            // Убираем активный класс у всех кнопок и таблиц
            tabButtons.forEach(btn => btn.classList.remove('active'));
            priceTables.forEach(table => table.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке и соответствующей таблице
            button.classList.add('active');
            document.getElementById(`${hostel}-prices`).classList.add('active');
        });
    });
    
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
    updateNavIndicator();
    
    // Анимация появления элементов
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.info-card, .info-item, .price-table');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Установка начальных стилей для анимации
    document.querySelectorAll('.info-card, .info-item, .price-table').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    // Запуск анимации при загрузке и скролле
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});