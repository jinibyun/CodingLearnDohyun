const priceInput = document.getElementById("food-price");
const tipButtons = document.querySelectorAll(".tip-button");
const totalPriceElement = document.getElementById("total-price");
const resultDetailElement = document.getElementById("result-detail");

let selectedTipPercent = 10;

function formatCurrency(value) {
    return `${value.toLocaleString("ko-KR")}원`;
}

function updateTotal() {
    // let foodPrice =0;
    // if (!isNaN(priceInput.value)) {
    //     foodPrice = Number(priceInput.value);
    // }
    const foodPrice = Number(priceInput.value) || 0;
    const totalPrice = foodPrice + (foodPrice * selectedTipPercent) / 100;
    const tipAmount = totalPrice - foodPrice;

    totalPriceElement.textContent = formatCurrency(totalPrice);
    resultDetailElement.textContent = `음식 가격 ${formatCurrency(foodPrice)} + 팁 ${selectedTipPercent}% (${formatCurrency(tipAmount)})`;
}

tipButtons.forEach((button) => {
    button.addEventListener("click", () => {
        tipButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        selectedTipPercent = Number(button.dataset.tip);
        updateTotal();
    });
});

priceInput.addEventListener("input", updateTotal);

updateTotal();