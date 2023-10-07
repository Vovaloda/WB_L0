//Здесь обрабатывается логика с модальными окнами

const paymentModal = document.querySelector('.payment__modal');
const editPaymentButton = document.querySelector('.edit__payment');
const paymentChangeButton = document.querySelector('.payment_change');
const paymentModalCloseButton = document.querySelector('.payment__modal__head .close');
const paymentModalForm = document.querySelector('.payment__modal__form');

const deliveryModal = document.querySelector('.delivery__modal');
const deliveryEditPathButton = document.querySelector('.edit_path');
const deliveryMethodChangeButton = document.querySelector('.delivery__method__change');
const deliveryModalForm = document.querySelector('.delivery__modal__content__form');
const deliveryModalCloseButton = document.querySelector('.close__delivery');

const paymentChooseButton = document.querySelector('.payment__modal__form__choose');
const cardImage = document.querySelector('.card-wrapper img');
const paimentCardImage = document.querySelector('.paiment__body__img-wrapper img');
const paimentRadioInputs = document.querySelectorAll('input[name="payment-radio"]');

const pickupButton = document.querySelector('.pickup');
const courierButton = document.querySelector('.courier');
const pickupChooseField = document.querySelector('.pickup__choose');
const courierChooseField = document.querySelector('.courier__choose');

const deliveryChooseButton = document.querySelector('.delivery__modal__accept');
const courierRadioInputs = document.querySelectorAll('input[name="courier-radio"]');
const pickupRadioInputs = document.querySelectorAll('input[name="pickup-radio"]');

const deliveryType = document.querySelector('.delivery__type');
const deliveryHeadTitle = document.querySelector('.total-sum__delivery__head__title');
const deliveryAddress = document.querySelector('.total-sum__delivery__address');
const deliveryAddressTitle = document.querySelector('.delivery__address');
const deliveryPointInfo = document.querySelector('.delivery__point__info');

//Открытие модального окна
function openModal(modal){
    document.body.style.overflow = "hidden";
    modal.style.display = 'flex';
}

//Закрытие модального окна
function closeModal(modal){
    document.body.style.overflow = "";
    modal.style.display = 'none';
}

//При клике исполняет функцию с модальным окном
function getEventModalOnClick(itemsArray, modal, funcOnModal){
    for(let i = 0; i < itemsArray.length; i++){
        itemsArray[i].addEventListener('click', () => funcOnModal(modal));
    }
}

//Отмена действий по умолчанию для форм
function FormsPreventDefault(formsArray){
    for(let i = 0; i < formsArray.length; i++){
        formsArray[i].addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
}

FormsPreventDefault([deliveryModalForm, paymentModalForm]);

getEventModalOnClick([paymentChangeButton, editPaymentButton], paymentModal, openModal);
getEventModalOnClick([paymentModalCloseButton], paymentModal, closeModal);
getEventModalOnClick([deliveryEditPathButton, deliveryMethodChangeButton], deliveryModal, openModal);
getEventModalOnClick([deliveryModalCloseButton], deliveryModal, closeModal);

//Закрывает модальное окно при нажатии на кнопку
window.onclick = function(event) {
    if (event.target == deliveryModal) {
        closeModal(deliveryModal)
    }
    else if (event.target == paymentModal) {
        closeModal(paymentModal)
    }
}

//Применение карты по нажатии на кнопку
paymentChooseButton.addEventListener('click', () => {
    for(let i = 0; i<paimentRadioInputs.length; i++){
        if(paimentRadioInputs[i].checked){
            let nameCardIcon = paimentRadioInputs[i].value.split('-')[1];
            cardImage.src = `./assets/${nameCardIcon}-icon.svg`;
            paimentCardImage.src = `./assets/${nameCardIcon}-icon.svg`;
        }
    }
    closeModal(paymentModal);
});

//Изменение на пункт выдачи в модальном окне
pickupButton.addEventListener('click', () => {
    pickupButton.classList.add('selected-button');
    courierButton.classList.remove('selected-button');
    pickupChooseField.style.display = 'flex';
    courierChooseField. style.display = 'none';
});

//Изменение на курьера в модальном окне
courierButton.addEventListener('click', () => {
    courierButton.classList.add('selected-button');
    pickupButton.classList.remove('selected-button');
    courierChooseField.style.display = 'flex';
    pickupChooseField. style.display = 'none';
});

//Применение адреса и типа доставки при нажатии 
deliveryChooseButton.addEventListener('click', () => {
    if(courierButton.classList.contains('selected-button')){
        for(let i = 0; i<courierRadioInputs.length; i++){
            if(courierRadioInputs[i].checked){
                const courierAddress = document.querySelector('.courier__choose .delivery__modal__radio input[type=radio]:checked + label div .courier__address').textContent;
                deliveryHeadTitle.textContent = 'Доствка курьером';
                deliveryType.textContent = 'Курьером';
                deliveryAddress.textContent = courierAddress;
                deliveryAddressTitle.textContent = courierAddress;
                deliveryPointInfo.style.display = 'none';
            }
        }
    }
    else if(pickupButton.classList.contains('selected-button')){
        for(let i = 0; i<pickupRadioInputs.length; i++){
            if(pickupRadioInputs[i].checked){
                const pickupAddress = document.querySelector('.pickup__choose .delivery__modal__radio input[type=radio]:checked + label div .pickup__address').textContent;
                deliveryHeadTitle.textContent = 'Доставка в пункт выдачи';
                deliveryType.textContent = 'Пункт выдачи';
                deliveryAddress.textContent = pickupAddress;
                deliveryAddressTitle.textContent = pickupAddress;
                deliveryPointInfo.style.display = 'flex';
            }
        }
    }
    closeModal(deliveryModal);
});