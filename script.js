let productsList = document.getElementById("products_list");
let cardsList = document.getElementById("card_list");
let cardsItem = [];

async function getProducts() {
    const response = await fetch("https://api.escuelajs.co/api/v1/products");
    const data = await response.json();
    return data;
};

let showBtn = document.getElementById("show");
let containerCard = document.getElementsByClassName("container_card")[0];
let container = document.getElementsByClassName("container")[0];

showBtn.addEventListener("click", () => {
    containerCard.classList.toggle("active");
    container.classList.toggle("activeScroll");
    if (cardsList.innerHTML === "") {
        cardsList.innerHTML = "The cart is empty";
    }

});

containerCard.addEventListener("click", () => {
    containerCard.classList.toggle("active");
});

let basket = document.getElementsByClassName("basket")[0];
basket.addEventListener("click", (event) => {
    event.stopPropagation();
});

getProducts().then(products => {
    productsList.innerHTML = "";
    products.forEach(product => {
        let productsItem = document.createElement("div");
        productsItem.classList.add("products_item");

        let imgBG = document.createElement("div");
        imgBG.classList.add("img_bg");
        productsItem.appendChild(imgBG);

        let images = document.createElement("img");
        images.classList.add("product_img");
        images.src = product.images;
        imgBG.appendChild(images);

        let title = document.createElement("h3");
        title.innerHTML = product.title;
        productsItem.appendChild(title);

        let priceBtn = document.createElement("div");
        priceBtn.classList.add("price_btn");
        productsItem.appendChild(priceBtn);

        let price = document.createElement("p");
        price.innerHTML = product.price + " $";
        priceBtn.appendChild(price);

        let btnAdd = document.createElement("button");
        btnAdd.classList.add("btn_add")
        btnAdd.innerHTML = "+";
        priceBtn.appendChild(btnAdd);

        btnAdd.onclick = () => addCard(product, productsItem);
        productsList.appendChild(productsItem);

    });
});

function getCards() {
    if (cardsItem.length) {
        cardsList.innerHTML = "";
    } else {
        cardsList.innerHTML = "The cart is empty";
        return;
    }

    cardsItem.forEach(card => {
        let cardsElement = document.createElement("div");
        cardsElement.classList.add("cards_item");

        let imgBG = document.createElement("div");
        imgBG.classList.add("cards_img_bg");
        cardsElement.appendChild(imgBG);

        let images = document.createElement("img");
        images.classList.add("cards_img");
        images.src = card.images;
        imgBG.appendChild(images);

        let title = document.createElement("h3");
        title.innerHTML = card.title;
        cardsElement.appendChild(title);

        let price = document.createElement("p");
        price.innerHTML = card.price + " $";
        cardsElement.appendChild(price);

        let block = document.createElement("div");
        block.classList.add("block_quantity");

        let remuveCard = document.createElement("button");
        remuveCard.classList.add("btn_hide")
        remuveCard.innerHTML = "Remove";
        block.appendChild(remuveCard);

        let countBlock = document.createElement("div");
        countBlock.classList.add("count_block");
        block.appendChild(countBlock);

        let btnQuantityMinus = document.createElement("button");
        btnQuantityMinus.classList.add("btn_minus");
        btnQuantityMinus.innerHTML = "-";

        let btnQuantityPlus = document.createElement("button");
        btnQuantityPlus.classList.add("btn_plus");
        btnQuantityPlus.innerHTML = "+";


        let count = document.createElement("div");
        count.innerHTML = card.quantity;
        countBlock.appendChild(btnQuantityMinus);
        countBlock.appendChild(count);
        countBlock.appendChild(btnQuantityPlus);

        cardsElement.appendChild(block);

        btnQuantityPlus.onclick = function () {
            card.quantity += 1;
            count.innerHTML = card.quantity;
            calculatePrice();
        }

        btnQuantityMinus.onclick = function () {
            if (card.quantity > 1) {
                card.quantity -= 1;
                count.innerHTML = card.quantity;
                calculatePrice()
            } else {
                confirmActiv(card);
            }
        }

        remuveCard.onclick = () => {
            confirmActiv(card);
        };
        cardsList.appendChild(cardsElement);

    });
};

// function onRemove(card) {
//     cardsItem = cardsItem.filter(item => item.id !== card.id);
//     getCards();
//     calculatePrice();
// };

function calculatePrice() {
    let countEl = document.getElementById("span");
    if (cardsItem.length === 0) {
        countEl.innerHTML = "";
        countEl.style.display = "none";
    } else {
        countEl.innerHTML = cardsItem.length;
        countEl.style.display = "block";
    }

    let sumEl = document.getElementsByClassName("sum")[0];

    let sum = 0;
    cardsItem.forEach(cart => {
        sum += cart.price * cart.quantity;
    });
    sumEl.innerText = `$${Math.floor(sum)}`;

};

function addCard(product, parent) {
    let successMeasageEl = document.createElement("div");
    successMeasageEl.classList.add("success-measage-el");
    successMeasageEl.innerText = "Item added to cart";
    parent.appendChild(successMeasageEl);
    setTimeout(() => {
        successMeasageEl.remove();
    }, 1500);
    let result = cardsItem.find(card => card.id === product.id);
    if (!result) {
        cardsItem.push({
            ...product,
            quantity: 1
        });
    } else {
        result.quantity += 1;
    }
    getCards();
    calculatePrice();
};


function confirmActiv(card){
    let confirm1 = document.getElementById("confirm-1");
    
    let confirm = document.createElement("div");
    confirm.classList.add("confirm");
    confirm1.appendChild(confirm);

    let confirmBlock = document.createElement("div");
    confirmBlock.classList.add("confirm-block");
    confirm.appendChild(confirmBlock);

    let h3 = document.createElement("h3");
    h3.innerText = "Are you sure you want to remove?";
    confirmBlock.appendChild(h3);

    let buttonCancle = document.createElement("button");
    buttonCancle.classList.add("cancle");
    buttonCancle.innerText = "Cancle";
    confirmBlock.appendChild(buttonCancle);

    let buttonOk = document.createElement("button");
    buttonOk.classList.add("ok");
    buttonOk.innerText = "Ok";
    confirmBlock.appendChild(buttonOk);

    buttonCancle.onclick = () => {
        confirm.remove();
    }

    buttonOk.onclick = function(){
        cardsItem = cardsItem.filter(item => item.id !== card.id);
        getCards();
        calculatePrice();
        confirm.remove();
    };

};

