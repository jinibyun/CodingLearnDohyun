const fakeQrElement = document.getElementById("fake-qr");

const qrPattern = [
    "1111111001011",
    "1000001010011",
    "1011101011101",
    "1011101000101",
    "1011101011101",
    "1000001000001",
    "1111111011111",
    "0001000010010",
    "1110111010111",
    "1000100010001",
    "1011101110111",
    "1000000010001",
    "1111111011101"
];

qrPattern.forEach((row) => {
    row.split("").forEach((cell) => {
        const pixel = document.createElement("span");

        if (cell === "1") {
            pixel.classList.add("is-filled");
        }

        fakeQrElement.appendChild(pixel);
    });
});