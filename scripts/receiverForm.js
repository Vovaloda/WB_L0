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
            const errorMessege = itemsArray[i].parentNode.childNodes[7];
            const lineBelowInput = itemsArray[i].parentNode.childNodes[5];
            itemsArray[i].style.color = '#000000';
            itemsArray[i].parentNode.classList.remove('errorValue');
            lineBelowInput.classList.remove('error-line');
            errorMessege.style.display = 'none';
        });
    }
}

onChangeInputsGeneral(inputsArray);

//Действия если инпуты не заполнены
function zeroValueActions(itemsArray) {
    itemsArray.forEach(element => {
        if (!element.value) {
            const errorMessege = element.parentNode.childNodes[7];
            const lineBelowInput = element.parentNode.childNodes[5];
            element.scrollIntoView();
            element.style.color = '#F55123';
            element.parentNode.classList.add('errorValue');
            lineBelowInput.classList.add('error-line');
            switch (element.name) {
                case 'ИНН':
                    errorMessege.textContent = 'Укажите ИНН';
                    break;
                case 'Телефон':
                    errorMessege.textContent = 'Укажите номер телефона';
                    break;
                case 'Почта':
                    errorMessege.textContent = 'Укажите электронную почту';
                    break;
                case 'Фамилия':
                    errorMessege.textContent = 'Введите фамилию';
                    break;
                case 'Имя':
                    errorMessege.textContent = 'Укажите имя';
                    break;
            }
            errorMessege.style.display = 'block';
        }
    });
}

//Правила для появления текста сверху инпутов
function upperTextManage(itemsArray) {
    for (let i = 0; i < itemsArray.length; i++) {
        itemsArray[i].addEventListener('input', () => {
            const currentLength = itemsArray[i].value.length;
            const upperText = itemsArray[i].parentNode.childNodes[1];
            if (currentLength == 0 || (itemsArray[i] == phoneInput && itemsArray[i].value == "+")) {
                upperText.style.display = 'none';;
            }
            else if (currentLength > 0) {
                upperText.style.display = 'block';
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
    const errorMessege = innInput.parentNode.childNodes[7];
    const lineBelowInput = innInput.parentNode.childNodes[5];
    let innTest = /^\d{14}$/.test(innInput.value);
    if (!innTest && innInput.value.length > 0) {
        innInput.style.color = '#F55123';
        innInput.parentNode.classList.add('errorValue');
        lineBelowInput.classList.add('error-line');
        errorMessege.textContent = 'Проверьте ИНН';
        errorMessege.style.display = 'block';
    }
});

//Действия, при некорректном вводе телефона
phoneInput.addEventListener('change', () => {
    const errorMessege = phoneInput.parentNode.childNodes[7];
    const lineBelowInput = phoneInput.parentNode.childNodes[5];
    let phoneTest = /^\+\d \d{3} \d{3}-\d{2}-\d{2}$/.test(phoneInput.value);
    if (!phoneTest && phoneInput.value.length > 0) {
        phoneInput.style.color = '#F55123';
        phoneInput.parentNode.classList.add('errorValue');
        lineBelowInput.classList.add('error-line');
        errorMessege.textContent = 'Формат: +9 999 999 99 99';
        errorMessege.style.display = 'block';
    }
});

//Действия, при некорректном вводе электронной почты
mailInput.addEventListener('change', () => {
    const errorMessege = mailInput.parentNode.childNodes[7];
    const lineBelowInput = mailInput.parentNode.childNodes[5];
    let mailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mailInput.value);
    if (!mailTest && mailInput.value.length > 0) {
        mailInput.style.color = '#F55123';
        mailInput.parentNode.classList.add('errorValue');
        lineBelowInput.classList.add('error-line');
        errorMessege.textContent = 'Проверьте адрес электронной почты';
        errorMessege.style.display = 'block';
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
