//Скрипт для замены иконок при наведении

const favouriteImages = document.querySelectorAll('.favourite-icon');
const deleteImagesInBasket = document.querySelectorAll('.left .delete-icon');
const deleteImagesInModal = document.querySelectorAll('.delivery__modal__content .delete-icon');

//Добавляет ивенты при наведении мыши 
function imageIconsSwap(imgArray, funcOver, funcOut) {
    for (let i = 0; i < imgArray.length; i++) {
      imgArray[i].onmouseover = funcOver;
      imgArray[i].onmouseout = funcOut;
    }
}
  
// Установка пути до файла
function thisSrc(src) {
    return function(){
        this.src = src;
    }
}

//Уставнока состояния фаворита
function addStateFavourite(item){
    for(let i = 0; i<item.length; i++){
        item[i].addEventListener('click', () => item[i].classList.toggle('favourite'));
    }
}

//Функция для установки hover на иконку фаворита в зависимости от значения
function favouriteHoverManage(srcOnFavourite, srcOnNonFavourite){
    return function(){
        if(this.classList.contains('favourite')){
            this.src = './assets/heart-hover-purple-icon.svg';
        }
        else if(!this.classList.contains('favourite')){
            this.src = './assets/favourite-icon.svg';
        }
    }
}

addStateFavourite(favouriteImages);

// Замена при наведении мыши иконок фаворит
imageIconsSwap(favouriteImages, thisSrc('./assets/heart-hover-purple-icon.svg'), favouriteHoverManage('./assets/heart-hover-purple-icon.svg', './assets/favourite-icon.svg'));

// Замена при наведении мыши иконок удаления в корзине
imageIconsSwap(deleteImagesInBasket, thisSrc('./assets/basket-hover-orange-icon.svg'), thisSrc('./assets/delete-icon.svg'));

//Замена при наведении мыши иконок удаления в модальном окне
imageIconsSwap(deleteImagesInModal, thisSrc('./assets/basket-hover-orange-icon.svg'), thisSrc('./assets/gray-basket-icon.svg'));
