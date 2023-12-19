//Здесь обрабатывается логика с формой получателя

const payButton = document.querySelector('.total__paybutton');
const nameInput = document.querySelector('input[name="Имя"]');
const lastNameInput = document.querySelector('input[name="Фамилия"]');
const mailInput = document.querySelector('input[name="Почта"]');
const phoneInput = document.querySelector('input[name="Телефон"]');
const innInput = document.querySelector('input[name="ИНН"]');
const receiverForm = document.querySelector('.recipient');

const inputsArray = [innInput, phoneInput, mailInput, lastNameInput, nameInput]; //Массив всех инпутов формы

//Общие правила при изменении инпутов
function onChangeInputsGeneral(itemsArray) {
    for (let i = 0; i < itemsArray.length; i++) {
        itemsArray[i].addEventListener('change', () => {
            const errorMessege = itemsArray[i].parentNode.querySelector('.error');
            const lineBelowInput = itemsArray[i].parentNode.querySelector('.recipient__line');
            itemsArray[i].style.color = '#000000';
            itemsArray[i].parentNode.classList.remove('errorValue');
            lineBelowInput.classList.remove('error-line');
            getClassDisplayNone(errorMessege);
        });
    }
}

onChangeInputsGeneral(inputsArray);

//Действия если инпуты не заполнены
function zeroValueActions(itemsArray) {

    const errorMessages = {
        'ИНН': 'Укажите ИНН',
        'Телефон': 'Укажите номер телефона',
        'Почта': 'Укажите электронную почту',
        'Фамилия': 'Введите фамилию',
        'Имя': 'Укажите имя',
    };

    itemsArray.forEach(element => {
        if (!element.value) {
            const errorMessage = element.parentNode.querySelector('.error');
            const lineBelowInput = element.parentNode.querySelector('.recipient__line');
            element.scrollIntoView();
            element.style.color = '#F55123';
            element.parentNode.classList.add('errorValue');
            lineBelowInput.classList.add('error-line');

            const elementName = element.name;

            if (errorMessages[elementName]) {
                errorMessage.textContent = errorMessages[elementName];
                getClassDisplayBlock(errorMessage);
            }
        }
    });
}

//Правила для появления текста сверху инпутов
function upperTextManage(itemsArray) {
    for (let i = 0; i < itemsArray.length; i++) {
        itemsArray[i].addEventListener('input', () => {
            const currentLength = itemsArray[i].value.length;
            const upperText = itemsArray[i].parentNode.querySelector('.text-up');
            if (currentLength == 0 || (itemsArray[i] == phoneInput && itemsArray[i].value == "+")) {
                getClassDisplayNone(upperText);
            }
            else if (currentLength > 0) {
                getClassDisplayBlock(upperText);
            }
        });
    }
}

upperTextManage(inputsArray);

//Обработка инпута INN 
innInput.addEventListener('keypress', (e) => {
    const maxLength = parseInt(innInput.getAttribute("maxlength"));
    const currentLength = innInput.value.length;

    // Получаем введенный символ
    const inputChar = String.fromCharCode(e.charCode);

    // Если вышли за предел допустимой длины, или введенный символ не является цифрой, то отменяем событие
    if (currentLength >= maxLength || isNaN(parseInt(inputChar))) {
        e.preventDefault();
    }
});

//Обработка инпута ИНН при вставке
innInput.addEventListener('paste', (e) => {
    // Получаем вставленный текст
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');

    // Проверяем, содержит ли вставленный текст только цифры
    if (!/^\d+$/.test(pastedText)) {
        e.preventDefault();
    }

    // Если вставленный текст приводит к превышению максимальной длины, отменяем событие
    if (innInput.value.length + pastedText.length > parseInt(innInput.getAttribute("maxlength"))) {
        e.preventDefault();
    }
});

//Правила для ввода телефона
phoneInput.addEventListener('input', (e) => {
    const matrix = "+7 ___ ___-__-__"
    let i = 0;
    const val = e.target.value.replace(/\D/g, "");

    e.target.value = matrix.replace(/./g, function (a) {
        return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
    });
});

//Действия, при некорректном вводе ИНН
innInput.addEventListener('change', () => {
    const errorMessege = innInput.parentNode.querySelector('.error');
    const lineBelowInput = innInput.parentNode.querySelector('.recipient__line');
    let innTest = /^\d{14}$/.test(innInput.value);
    if (!innTest && innInput.value.length > 0) {
        innInput.style.color = '#F55123';
        innInput.parentNode.classList.add('errorValue');
        lineBelowInput.classList.add('error-line');
        errorMessege.textContent = 'Проверьте ИНН';
        getClassDisplayBlock(errorMessege);
    }
});

//Действия, при некорректном вводе телефона
phoneInput.addEventListener('change', () => {
    const errorMessege = phoneInput.parentNode.querySelector('.error');
    const lineBelowInput = phoneInput.parentNode.querySelector('.recipient__line');
    let phoneTest = /^\+\d \d{3} \d{3}-\d{2}-\d{2}$/.test(phoneInput.value);
    if (!phoneTest && phoneInput.value.length > 0) {
        phoneInput.style.color = '#F55123';
        phoneInput.parentNode.classList.add('errorValue');
        lineBelowInput.classList.add('error-line');
        errorMessege.textContent = 'Формат: +9 999 999 99 99';
        getClassDisplayBlock(errorMessege);
    }
});

//Действия, при некорректном вводе электронной почты
mailInput.addEventListener('change', () => {
    const errorMessege = mailInput.parentNode.querySelector('.error');
    const lineBelowInput = mailInput.parentNode.querySelector('.recipient__line');
    let mailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mailInput.value);
    if (!mailTest && mailInput.value.length > 0) {
        mailInput.style.color = '#F55123';
        mailInput.parentNode.classList.add('errorValue');
        lineBelowInput.classList.add('error-line');
        errorMessege.textContent = 'Проверьте адрес электронной почты';
        getClassDisplayBlock(errorMessege);
    }
});

//При нажатии на кнопку заказа
orderButton.addEventListener('click', () => {
    zeroValueActions(inputsArray);
    let hasError = false;
    inputsArray.forEach(el => { if (el.value == 0) hasError = true });
    if (!(/^\d{14}$/.test(innInput.value))) {
        hasError = true;
    }
    if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mailInput.value))) {
        hasError = true;
    }
    if (!(/^\+\d \d{3} \d{3}-\d{2}-\d{2}$/.test(phoneInput.value))) {
        hasError = true;
    }

    if (hasError) {
        receiverForm.scrollIntoView();
    }
    else if (!hasError) {
        alert('Поздравляем ! Заказ успешно оформлен!');
    }
})
