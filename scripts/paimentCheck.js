//Здесь обрабатывается логика чекбокса и кнопки типа оплаты

const paimentCheck = document.querySelector('input[name="check__payment"]');
const payInfo = document.querySelector('.total-sum__payment-pay-info');
const paimentInfo = document.querySelector('.payment-info');
const orderButton = document.querySelector('.total-sum__button-pay');

//totalInfo.totalSum - переменная, в которой общая цена

//Изменение объектов в зависимости от спасоба оплаты
paimentCheck.addEventListener('change', () => {
    if (paimentCheck.checked) {
        let textToThisButton = priceFormatStrWithSpace(priceRound(totalInfo.totalSum));
        payInfo.style.display = 'none';
        paimentInfo.style.display = 'none';
        orderButton.textContent = `Оплатить ${(textToThisButton)} сом`;
    }
    else if (!paimentCheck.checked) {
        payInfo.style.display = 'block';
        paimentInfo.style.display = 'block';
        orderButton.textContent = 'Заказать';
    }
});
