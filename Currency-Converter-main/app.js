const BASE_URL = "https://open.er-api.com/v6/latest/"
const dropdowns = document.querySelectorAll(".dropdown select");
const convertBtn = document.getElementById("convert-btn");
const clearBtn = document.getElementById("clear-btn");
const fromCurr = document.getElementById("from-currency");
const toCurr = document.getElementById("to-currency");
const msg = document.querySelector(".msg");
const amountInput = document.getElementById("amount");

// Country & Currency List
const countryList = {
    AED: "AE",
     AFN: "AF",
      XCD: "AG", 
      ALL: "AL", 
      AMD: "AM", 
      ANG: "AN",
       AOA: "AO",
        AQD: "AQ", 
    ARS: "AR",
     AUD: "AU",
      AZN: "AZ",
       BAM: "BA", 
       BBD: "BB",
        BDT: "BD",
         XOF: "BE",
          BGN: "BG", 
    BHD: "BH",
     BIF: "BI",
      BMD: "BM",
       BND: "BN",
        BOB: "BO",
         BRL: "BR",
          BSD: "BS",
           NOK: "BV", 
    BWP: "BW",
     BYR: "BY",
      BZD: "BZ",
       CAD: "CA",
        CDF: "CD",
         XAF: "CF",
          CHF: "CH",
           CLP: "CL", 
    CNY: "CN",
     COP: "CO",
      CRC: "CR",
       CUP: "CU",
        CVE: "CV", 
        CYP: "CY", 
        CZK: "CZ", 
        DJF: "DJ", 
    DKK: "DK",
     DOP: "DO",
      DZD: "DZ",
       ECS: "EC",
        EEK: "EE",
         EGP: "EG",
          ETB: "ET",
           EUR: "FR", 
    FJD: "FJ", 
    FKP: "FK",
     GBP: "GB",
      GEL: "GE",
       GGP: "GG", 
       GHS: "GH", 
       GIP: "GI", 
       GMD: "GM", 
    GNF: "GN", 
    GTQ: "GT", 
    GYD: "GY", 
    HKD: "HK", 
    HNL: "HN", 
    HRK: "HR", 
    HTG: "HT", 
    HUF: "HU", 
    IDR: "ID", 
    ILS: "IL", 
    INR: "IN", 
    IQD: "IQ", 
    IRR: "IR", 
    ISK: "IS", 
    JMD: "JM", 
    JOD: "JO", 
    JPY: "JP", 
    KES: "KE", 
    KGS: "KG", 
    KHR: "KH", 
    KMF: "KM", 
    KPW: "KP", 
    KRW: "KR", 
    KWD: "KW", 
    KYD: "KY", 
    KZT: "KZ", 
    LAK: "LA", 
    LBP: "LB", 
    LKR: "LK", 
    LRD: "LR", 
    LSL: "LS", 
    LTL: "LT", 
    LVL: "LV", 
    LYD: "LY", 
    MAD: "MA", 
    MDL: "MD", 
    MGA: "MG", 
    MKD: "MK", 
    MMK: "MM", 
    MNT: "MN", 
    MOP: "MO", 
    MRO: "MR", 
    MTL: "MT", 
    MUR: "MU", 
    MVR: "MV", 
    MWK: "MW", 
    MXN: "MX", 
    MYR: "MY", 
    MZN: "MZ", 
    NAD: "NA",
     XPF: "NC", 
     NGN: "NG", 
     NIO: "NI", 
     NPR: "NP", 
     NZD: "NZ", 
     OMR: "OM", 
    PAB: "PA", 
    PEN: "PE", 
    PGK: "PG", 
    PHP: "PH", 
    PKR: "PK", 
    PLN: "PL", 
    PYG: "PY", 
    QAR: "QA", 
    RON: "RO", 
    RSD: "RS",
     RUB: "RU",
      RWF: "RW", 
      SAR: "SA", 
      SBD: "SB", 
      SCR: "SC", 
      SDG: "SD", 
    SEK: "SE", 
    SGD: "SG", 
    SKK: "SK", 
    SLL: "SL", 
    SOS: "SO", 
    SRD: "SR", 
    STD: "ST", 
    SVC: "SV", 
    SYP: "SY", 
    SZL: "SZ", 
    THB: "TH", 
    TJS: "TJ", 
    TMT: "TM", 
    TND: "TN", 
    TOP: "TO", 
    TRY: "TR", 
    TTD: "TT", 
    TWD: "TW", 
    TZS: "TZ", 
    UAH: "UA", 
    UGX: "UG", 
    USD: "US", 
    UYU: "UY", 
    UZS: "UZ", 
    VEF: "VE", 
    VND: "VN", 
    VUV: "VU", 
    YER: "YE", 
    ZAR: "ZA", 
    ZMK: "ZM", 
    ZWD: "ZW"
};

// Populate dropdowns
for (let select of dropdowns) {
    Object.keys(countryList)
        .sort()
        .forEach((currCode) => {
            let option = document.createElement("option");
            option.innerText = currCode;
            option.value = currCode;
            select.appendChild(option);
        });
}

// Set default selections
fromCurr.value = "USD";
toCurr.value = "INR";

// Update flag based on selection
const updateFlag = (selectElement) => {
    let currencyCode = selectElement.value;
    let countryCode = countryList[currencyCode];
    let flagElement = selectElement.parentElement.querySelector("img");
    flagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Initial flag update


updateFlag(fromCurr);
updateFlag(toCurr);


// Update flag on currency change
fromCurr.addEventListener("change", () => updateFlag(fromCurr));
toCurr.addEventListener("change", () => updateFlag(toCurr));

// Fetch exchange rate and display result
const getExchangeRate = async () => {
    let amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        msg.innerText = "Please enter a valid amount!";
        msg.style.color = "red";
        return;
    }

    let fromCurrency = fromCurr.value;
    let toCurrency = toCurr.value;

    try {
        let response = await fetch(`${BASE_URL}${fromCurrency}`);
        let data = await response.json();

        if (data.result !== "success") {
    msg.innerText = "Unable to fetch exchange rate.";
    msg.style.color = "red";
    return;
}

        let exchangeRate = data.rates[toCurrency];
        let convertedAmount = (amount * exchangeRate).toFixed(2);
        msg.innerText = `${amount} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
        msg.style.color = "green";
    } catch (error) {
        msg.innerText = "Unable to fetch exchange rate. Please check your internet connection.";
        msg.style.color = "red";
    }
};

// Convert button event listener
convertBtn.addEventListener("click", getExchangeRate);

convertBtn.disabled = true;
convertBtn.innerText = "Converting...";

convertBtn.disabled = false;
convertBtn.innerText = "Get Exchange Rate";

// Clear button event listener
clearBtn.addEventListener("click", () => {
    amountInput.value = "1"; // Clears the amount input
    msg.innerText = ""; // Clears the exchange rate message
    fromCurr.value = "USD"; // Reset to default
    toCurr.value = "INR"; // Reset to default
    updateFlag(fromCurr);
    updateFlag(toCurr);
});

document
    .getElementById("converter-form")
    .addEventListener("submit", (e) => {
        e.preventDefault();
        getExchangeRate();
    });