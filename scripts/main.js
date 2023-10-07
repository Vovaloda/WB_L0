//Основной файл, в котором обрабатывается логика удаления, блока с общей суммой и основной блок с активными товарами

const notAvaibleDeleteButtons = document.querySelectorAll('.not-available__product__icons .delete-icon');
const avaibleDeleteButtons = document.querySelectorAll('.basket__available__products .delete-icon');
const notAvaibleCountProducts = document.querySelector('.not-available__menu__check p');
const notAvaibleArrowButton = document.querySelector('.basket__not-available__menu button img');
const avaibleArrowButton = document.querySelector('.basket__menu button img ');
const notAvaibleProductsBlock = document.querySelector('.basket__not-available__products');
const basketMenuCheck = document.querySelector('.basket__menu__check');
const basketMenuHidenText = document.querySelector('.basket__menu-hidden');
const avaibleProductsBlock = document.querySelector('.count');
const priceAvaivleHidden = document.querySelector('.amount');
const lineOnHidden = document.querySelector('.basket__menu .line');
const thridItemInDelivery = document.querySelector('.delivery__products .delevery_product:nth-child(3)');
thridItemInDelivery.style.display = 'none';

const localPrices = document.querySelectorAll('.manage__price-total__span');

const courierDeleteButons = document.querySelectorAll('.delivery__courier__delete');
const pickupDeleteButons = document.querySelectorAll('.delivery__pickup__delete');

const countOfChoosenProductsControl = document.querySelectorAll('.product__control__counter');

const popUpGeneralSale = document.querySelectorAll('.sale__sum p:nth-child(1)');
const popUpPersonalSale = document.querySelectorAll('.sale__sum p + p');
const popUps = document.querySelectorAll('.popup__price');

const basketLabel = document.querySelector('.basket-shop-label');
const mobileBasketLabel = document.querySelector('.menu__mobile__label');

const deliveryDatesFields = document.querySelector('.delivery__dates');

let avaibleInputs = document.querySelectorAll('.basket__product__image input');
const basketEveryInput = document.querySelector('input[name="basket_every"]');

const deliveryDate = document.querySelector('.total-sum__delivery__date');
const basketLabels = [basketLabel, mobileBasketLabel];

const acceptButton = document.querySelector('.total-sum__button-pay');
const totalSumHeadTitle = document.querySelector('.total-sum__head__title__field span');
const totalDiscountHeadTitle = document.querySelector('.total-sum__head__discount__field span');
const totalDeliveryDate = document.querySelector('.total-sum__delivery__date');
const totalCountProducts = document.querySelector('.total-sum__head__products p');
const totalSumWithoutDiscout = document.querySelector('.total-sum__head__products__field span');

const deliveryLabels = document.querySelectorAll('.delivery__image__wrapper__label');

const mobileTotalPrice = document.querySelectorAll('.total-price');
const mobileDiscountPrice = document.querySelectorAll('.crossed span');

const products = [
    {
        totalCost: 1051,
        totalCostWithPrice: 367.9,
        cost: 1051,
        count: 3,
        choose: 1,
        active: true,
    },
    {
        totalCost: 2300047,
        totalCostWithPrice: 805016.45,
        cost: 11500.235,
        count: 205,
        choose: 200,
        active: true,
    },
    {
        totalCost: 950,
        totalCostWithPrice: 332.5,
        cost: 475,
        count: 4,
        choose: 2,
        active: false,
    },
]

const totalInfo = {
    totalSum: 805384.4,
    salePrice: 1495713.7,
    totalCount: 201,
}

const productsCount = {
    notAvaibleProductscount: 3,
    avaibleProductscount: 3,
    deletedAvaibleProducts: [],
}

const sale = 0.55;
const personalSale = 0.1;
const totalSale = 1 - sale - personalSale;

basketMenuHidenText.style.visibility = 'hidden';

//Функция для правильного склонения товаров в зависимости от числа
function formatProductCount(count) {
    if (count < 0 || count % 1 !== 0) {
        return "Неверное количество товаров";
    }

    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;

    if (count === 0) {
        return "товаров";
    } else if (lastTwoDigits >= 11 && lastTwoDigits <= 20) {
        return "товаров";
    } else {
        if (lastDigit === 1) {
            return "товар";
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return "товара";
        } else {
            return "товаров";
        }
    }
}

//Установка цен по умолчанию на позиции
function setDefaultPrices(nodesAray){
    for(let i = 0; i < nodesAray.length; i++){
        let localPriceWithSale = products[i].totalCost * totalSale;
        localPriceWithSale = localPriceWithSale.toFixed(2);
        localPriceWithSale = Math.round(localPriceWithSale * 10) / 10;
        nodesAray[i].textContent = localPriceWithSale.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1 ');
        mobileTotalPrice[i].textContent = localPriceWithSale + ' com';
    }
}

setDefaultPrices(localPrices);

//Установка скидок по умолчанию
function setDefaultPricesSale(nodesArrayPersonal,nodesArrayGeneral){
    for(let i = 0; i < nodesArrayGeneral.length; i++){
        let toGeneralSale = products[i].totalCost * sale;
        let toPersonalSale = products[i].totalCost * personalSale;

        toGeneralSale = priceRound(toGeneralSale);
        toGeneralSale = priceFormatStr(toGeneralSale);

        toPersonalSale = priceRound(toPersonalSale);
        toPersonalSale = priceFormatStr(toPersonalSale);

        nodesArrayPersonal[i].textContent = `−${toPersonalSale} сом`;
        nodesArrayGeneral[i].textContent = `−${toGeneralSale} сом`;

        if(toPersonalSale.length >= 5 || toGeneralSale.length >= 5){
            popUps[i].style.width = '275px'; 
        }
        else if(toPersonalSale.length < 5 && toGeneralSale.length < 5){
            popUps[i].style.width = '241px'; 
        }
    }
}

setDefaultPricesSale(popUpPersonalSale, popUpGeneralSale);

//Общее обновление количества позиций
function updateTotalCoutProducts(){
    totalInfo.totalCount = products.reduce((sum, current) => {
        if(current.active){
            sum += current.choose;
        }

        return sum;
    }, 0);
}

//Добавление функциональности чекбоксам доступных товаров
function avaibleCheckboxActions(nodesAray){

    for(let i = 0; i < nodesAray.length; i++){
        nodesAray[i].addEventListener('change', () => {

            const procutInDelivery = document.querySelector(`.delivery__products .delevery_product:nth-child(${i+1})`);

            if(nodesAray[i].checked){
                products[i].active = true;
                procutInDelivery.style.display = 'block';

                if(i===1){
                    deliveryDatesFields.children[1].style.display = 'flex';
                }
            }
            else if(!nodesAray[i].checked){
                products[i].active = false;
                procutInDelivery.style.display = 'none';

                if(i===1){
                    deliveryDatesFields.children[1].style.display = 'none';
                }
            }

            let countActiveInputs = products.reduce((sum, current) => {
                if(current.active){
                    sum++;
                }
                return sum;
            }, 0);

            if(countActiveInputs == productsCount.avaibleProductscount){
                basketEveryInput.checked = true;
            }
            else if(countActiveInputs !== productsCount.avaibleProductscount){
                basketEveryInput.checked = false;
            }

            if(countActiveInputs === 0){
                deliveryDatesFields.children[0].style.display = 'none';
            }
            else if(countActiveInputs !== 0){
                deliveryDatesFields.children[0].style.display = 'flex';
            }

            updateBasketLabel(basketLabels);
            totalSumUpdate();
        });
    }
}

avaibleCheckboxActions(avaibleInputs);

//Хэндлер для basketEveryInput change 
function toBasketEveryInputActions(){ 
        if(basketEveryInput.checked){
            for(let i = 0; i < avaibleInputs.length; i++){
                if(productsCount.deletedAvaibleProducts.indexOf(i) == -1){
                    const procutInDelivery = document.querySelector(`.delivery__products .delevery_product:nth-child(${i+1})`);
                    procutInDelivery.style.display = 'block';
                    avaibleInputs[i].checked = true;
                    products[i].active = true;
                } 
            }

            if(productsCount.deletedAvaibleProducts.length < products.length){
                deliveryDatesFields.children[0].style.display = 'flex';
            }
            if(products[1].active && products[1].choose > 184){
                deliveryDatesFields.children[1].style.display = 'flex';
            }
        }
        else if(!basketEveryInput.checked){
            for(let i = 0; i < avaibleInputs.length; i++){
                if(productsCount.deletedAvaibleProducts.indexOf(i) == -1){
                    avaibleInputs[i].checked = false;
                    products[i].active = false;
                    const procutInDelivery = document.querySelector(`.delivery__products .delevery_product:nth-child(${i+1})`);
                    procutInDelivery.style.display = 'none';
                }
            }
            deliveryDatesFields.children[0].style.display = 'none';
            deliveryDatesFields.children[1].style.display = 'none';
        }
    
        updateBasketLabel(basketLabels);
        totalSumUpdate();
}

//При изменении общего чекбокса
basketEveryInput.addEventListener('change',toBasketEveryInputActions);

//Обновление инфомарции о количестве недоступных товаров
function updateNotAvaibleCountProducts(){
    const CountFormat = formatProductCount(productsCount.notAvaibleProductscount);
    notAvaibleCountProducts.textContent = `Отсутствуют · ${productsCount.notAvaibleProductscount} ${CountFormat}`;
}

//Округление цен
function priceRound(price){
    price = price.toFixed(2);
    price = Math.round(price * 10) / 10;
    return price;
}

//Форматирование текста цены
function priceFormatStr(price){
    return price.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1 ');
}

//Форматирование текста цены
function priceFormatStrWithSpace(price){
    return price.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1 ');
}

//Обнволение лейблов у корзины
function updateBasketLabel(itemsArray){
    updateTotalCoutProducts();
    for(let i = 0; i<itemsArray.length; i++){
        itemsArray[i].textContent = totalInfo.totalCount;
        if(totalInfo.totalCount >= 1){
            itemsArray[i].style.display = 'inline-block';
        }
        else if(totalInfo.totalCount < 1){
            itemsArray[i].style.display = 'none';
        }
    }
}

//Установка лейблов у корзины по умолчанию
function setDefaultBasketLabel(itemsArray){
    for(let i = 0; i<itemsArray.length; i++){
        itemsArray[i].textContent = '201';
    }
}

setDefaultBasketLabel(basketLabels);

//Функциональность для каунтера выбора продуктов
function counterControl(nodesAray){
    for(let i = 0; i < nodesAray.length; i++){
        const minusButton = nodesAray[i].children[0];
        const inputField = nodesAray[i].children[1];
        const plusButton = nodesAray[i].children[2];
        const productsLeft = nodesAray[i].parentNode.children[1];

        const priseText = nodesAray[i].parentNode.parentNode.children[1].children[0].children[0];

        const priseTextWithoutSale = nodesAray[i].parentNode.parentNode.children[1].children[1].children[0].children[0];
        const popUp = nodesAray[i].parentNode.parentNode.children[1].children[1].children[1];
        const minusGeneralSale = nodesAray[i].parentNode.parentNode.children[1].children[1].children[1].children[1].children[0];
        const minusPersonalSale = nodesAray[i].parentNode.parentNode.children[1].children[1].children[1].children[1].children[1];

        const secondDeliveryDate = document.querySelector('.delivery__dates .delivery__date:nth-child(2)');
        
        //Обновление цен в разных блоках
        function updatePrisesText(){
            let priceToText = inputField.value * products[i].cost * totalSale;
            priceToText = priceRound(priceToText);

            let priceToToalCost = inputField.value * products[i].cost;
            priceToToalCost = priceRound(priceToToalCost);

            products[i].totalCost = priceToToalCost;
            products[i].totalCostWithPrice = priceToText;
            
            priseText.textContent = priceFormatStr(priceToText);
            priseTextWithoutSale.textContent = priceFormatStr(products[i].totalCost);

            mobileTotalPrice[i].textContent = priceFormatStr(priceToText);
            mobileDiscountPrice[i].textContent = priceFormatStr(products[i].totalCost);

            if((priceToText + '').length < 7){
                priseText.classList.add('large-span');
            }
            else if((priceToText + '').length > 6){
                priseText.classList.remove('large-span');
            }

            let personalSaleToPoupup = inputField.value * products[i].cost * personalSale;
            let generalSaleToPoupup = inputField.value * products[i].cost * sale;

            personalSaleToPoupup = priceRound(personalSaleToPoupup);
            generalSaleToPoupup = priceRound(generalSaleToPoupup);

            personalSaleToPoupup = priceFormatStr(personalSaleToPoupup);
            generalSaleToPoupup = priceFormatStr(generalSaleToPoupup);

            minusGeneralSale.textContent = `−${generalSaleToPoupup} сом`;
            minusPersonalSale.textContent = `−${personalSaleToPoupup} сом`;

            if(generalSaleToPoupup.length >= 5 || personalSaleToPoupup >= 5){
                popUp.style.width = '275px'; 
            }
            else if(generalSaleToPoupup.length < 5 && personalSaleToPoupup < 5){
                popUp.style.width = '241px'; 
            }
        }

        function secondDateOpenedLogic(){
            const secondDateDelevery =  products.filter(el => {
                if(el.active && el.choose > 184){
                    return true
                }
                return false;
            });

            if(secondDateDelevery.length == 0){
                secondDeliveryDate.style.display = 'none';
            }
            else if(secondDateDelevery.length !== 0){
                secondDeliveryDate.style.display = 'flex';
            }
        }

        //Обновление информации об оставшихся товарах
        function updateProductsLeftCount(){
            if(inputField.value >= products[i].count - 2){
                productsLeft.style.display = 'block';
            }

            if(inputField.value == products[i].count){
                productsLeft.textContent = 'Осталось 0 шт.';
            }
            else if(inputField.value == products[i].count - 1){
                productsLeft.textContent = 'Осталось 1 шт.';
            }
            else if(inputField.value == products[i].count - 2){
                productsLeft.textContent = 'Осталось 2 шт.';
            }
            else if(inputField.value < products[i].count - 2){
                productsLeft.style.display = 'none';
            }
        }

        minusButton.addEventListener('click', ()=>{
            plusButton.classList.remove('gray');

            if(inputField.value == 2){
                minusButton.classList.add('gray');
            }

            if(inputField.value > 1){
                inputField.value--;
                products[i].choose--;
                updateProductsLeftCount();
                updatePrisesText();
                updateBasketLabel(basketLabels);
                totalSumUpdate();
            }

            secondDateOpenedLogic();
            deliveryLabelsUpdate(deliveryLabels);
        });           

        plusButton.addEventListener('click', ()=>{
            minusButton.classList.remove('gray');

            if(inputField.value == products[i].count - 1){
                plusButton.classList.add('gray');
            }

            if(inputField.value < products[i].count){
                inputField.value++;
                products[i].choose++;
                updateProductsLeftCount();
                updatePrisesText();
                updateBasketLabel(basketLabels);
                totalSumUpdate();
            }

            secondDateOpenedLogic();
            deliveryLabelsUpdate(deliveryLabels);
        });

        inputField.addEventListener('change', ()=>{
            inputField.value = Math.round(inputField.value);

            if(inputField.value > products[i].count){
                inputField.value = products[i].count;
                plusButton.classList.add('gray');
            }
            else if(inputField.value <= 1){
                inputField.value = 1;
                minusButton.classList.add('gray');
            }
            
            if(inputField.value > 1){
                minusButton.classList.remove('gray');
            }
            if(inputField.value < products[i].count){
                plusButton.classList.remove('gray');
            }

            updateProductsLeftCount();
            updatePrisesText();

            products[i].choose = +inputField.value;

            updateBasketLabel(basketLabels);
            totalSumUpdate();

            secondDateOpenedLogic();
            deliveryLabelsUpdate(deliveryLabels);
        });
    }
}

counterControl(countOfChoosenProductsControl);

//Функция для добавления функциональности удаления для неактивных продуктов
function notAvaibleProductsDelete (nodesArray){
    for(let i = 0; i<nodesArray.length; i++){
        nodesArray[i].addEventListener('click', () => {
            nodesArray[i].parentNode.parentNode.parentNode.parentNode.parentNode.remove(); //Удаление родительского блока с товара, где находитс кнопка
            productsCount.notAvaibleProductscount--;
            updateNotAvaibleCountProducts();
        });
    }
}

notAvaibleProductsDelete (notAvaibleDeleteButtons);

//Функция для добавления функциональности удаления для активных продуктов
function avaibleProductsDelete(nodesArray){
    for(let i = 0; i<nodesArray.length; i++){
        nodesArray[i].addEventListener('click', () => {
            const firstDeliveryDate = document.querySelector('.delivery__dates .delivery__date:nth-child(1)');
            const secondDeliveryDate = document.querySelector('.delivery__dates .delivery__date:nth-child(2)');
            const thisWrapperImg = document.querySelectorAll('.delevery_product');
            thisWrapperImg[i].style.display = 'none';
            if(i === 1){
                secondDeliveryDate.style.display = 'none';
                thisWrapperImg[3].style.display = 'none';
            }

            nodesArray[i].parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            productsCount.avaibleProductscount--;
            products[i].active = false;
            productsCount.deletedAvaibleProducts.push(i);

            let countActiveProducts = products.filter((el) => {
                if(el.active){
                    return true;
                }
                return false;
            });

            if(countActiveProducts.length === 0){
                firstDeliveryDate.style.display = 'none';
            }

            let countActiveInputs = products.reduce((sum, current) => {
                if(current.active){
                    sum++;
                }
                return sum;
            }, 0);

            if(countActiveInputs == productsCount.avaibleProductscount){
                basketEveryInput.checked = true;
            }
            else if(countActiveInputs !== productsCount.avaibleProductscount){
                basketEveryInput.checked = false;
            }

            updateBasketLabel(basketLabels);
            totalSumUpdate();
        });
    }
}

avaibleProductsDelete(avaibleDeleteButtons);

//Поведение стрелки-кнопки для неактивных предметов
notAvaibleArrowButton.addEventListener('click', () =>{
    const productsBlock = notAvaibleArrowButton.parentElement.parentElement.parentElement.childNodes[3]; //Блок с товарами
    const ArrowButtonTest = notAvaibleArrowButton.style.transform == 'rotateX(180deg)';
    if(ArrowButtonTest){
        productsBlock.style.display = 'block';
        notAvaibleArrowButton.style.transform = 'rotateX(0deg)';
    }
    else if(!ArrowButtonTest){
        productsBlock.style.display = 'none';
        notAvaibleArrowButton.style.transform = 'rotateX(180deg)';
    }
});

//Логика для кнопок удаления адресов в модальном окне
function radiosDeleteManage(nodesArray){
    for(let i = 0; i<nodesArray.length; i++){
        nodesArray[i].addEventListener('click', ()=>{
            const thisParentBlock = nodesArray[i].parentElement.parentElement;
            const thisInput = nodesArray[i].parentElement.parentElement.childNodes[1];
            if(thisInput.checked){
                alert('Внимание ! Нельзя удалять активный адрес!');
            }
            if(!thisInput.checked){
                thisParentBlock.remove();
            }
        })
    }
}

radiosDeleteManage(courierDeleteButons);
radiosDeleteManage(pickupDeleteButons);

//Поведение стрелки-кнопки для активных предметов
avaibleArrowButton.addEventListener('click', () =>{
    const productsBlock = avaibleArrowButton.parentElement.parentElement.parentElement.childNodes[5].childNodes[1]; //Блок с товарами
    const ArrowButtonTest = avaibleArrowButton.style.transform == 'rotateX(180deg)';

    if(ArrowButtonTest){
        productsBlock.style.display = 'block';
        avaibleArrowButton.style.transform = 'rotateX(0deg)';
        basketMenuCheck.style.display = "flex";
        basketMenuHidenText.style.visibility = 'hidden';
        lineOnHidden.style.display = 'none';
    }
    else if(!ArrowButtonTest){
        productsBlock.style.display = 'none';
        avaibleArrowButton.style.transform = 'rotateX(180deg)';
        basketMenuCheck.style.display = "none";
        basketMenuHidenText.style.visibility = 'visible';
        lineOnHidden.style.display = 'block';
        avaibleProductsBlock.textContent = totalInfo.totalCount + " " + formatProductCount(totalInfo.totalCount);
        priceAvaivleHidden.textContent =  priceFormatStrWithSpace(priceRound(totalInfo.totalSum)); 
    }
});

//Обновление лейблов в способе доставки
function deliveryLabelsUpdate(nodesArray){
    for(let i = 0; i < nodesArray.length; i++){
        if(i < products.length){
            nodesArray[i].textContent = products[i].choose;

            if(products[i].choose == 1){
                nodesArray[i].style.display = 'none';
            }
            else if(products[i].choose !== 1){
                nodesArray[i].style.display = 'inline-block';
            }
    
            if(i == 1 && products[i].choose > 184){
                nodesArray[i].textContent = '184';
                nodesArray[3].textContent = products[i].choose - 184;
            }
        }
    }
}

deliveryLabelsUpdate(deliveryLabels); 

function setDefaultTotalSum(){
    totalSumHeadTitle.textContent = '805 384.4';
    totalDiscountHeadTitle.textContent = '1 495 713.7';
    totalSumWithoutDiscout.textContent = '2 301 098';
    totalCountProducts.textContent = '201 товар';
}

setDefaultTotalSum();

//Логика с окном общей суммы
function totalSumUpdate(){

    totalCountProducts.textContent = totalInfo.totalCount + " " + formatProductCount(totalInfo.totalCount);

    const sumToTotalSumHeadTitle = products.reduce((sum, current) => {
        if(current.active){
            sum += current.totalCostWithPrice;
        }
        return sum;
    },0);

    totalSumHeadTitle.textContent = priceFormatStrWithSpace(priceRound(sumToTotalSumHeadTitle));
    totalInfo.totalSum = sumToTotalSumHeadTitle;

    const sumToTotalSumWithoutDiscout = products.reduce((sum, current) => {
        if(current.active){
            sum += current.totalCost;
        }
        return sum;
    },0);

    totalSumWithoutDiscout.textContent = priceFormatStrWithSpace(priceRound(sumToTotalSumWithoutDiscout));

    const sumToTotalDiscountHeadTitle = products.reduce((sum, current) => {
        if(current.active){
            sum += current.totalCost - current.totalCostWithPrice;
        }
        return sum;
    },0);

    totalDiscountHeadTitle.textContent = priceFormatStrWithSpace(priceRound(sumToTotalDiscountHeadTitle));
    totalInfo.salePrice = sumToTotalDiscountHeadTitle;

    if(products[1].choose > 184 && products[1].active){
        totalDeliveryDate.textContent = '5–8 фев';
    }
    else if(products[1].choose <= 184 || !products[1].active){
        totalDeliveryDate.textContent = '5–6 фев';
    }

    if(totalInfo.totalCount == 0){
        totalDeliveryDate.style.display = 'none';
    }
    else if(totalInfo.totalCount !== 0){
        totalDeliveryDate.style.display = 'block';
    }

    if(totalInfo.totalCount == 0){
        acceptButton.disabled = true;
    }
    else if(totalInfo.totalCount !== 0){
        acceptButton.disabled = false;
    }

    if(paimentCheck.checked){
        orderButton.textContent = `Оплатить ${(priceFormatStrWithSpace(priceRound(sumToTotalSumHeadTitle)))} com`;
    }
}