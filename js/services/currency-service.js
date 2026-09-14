// Multi-Currency Converter Service

class CurrencyService {
  constructor() {
    this.currentCurrency = localStorage.getItem("voyage_currency") || "USD";
    // Base rates relative to 1 USD
    this.rates = {
      USD: { symbol: "$", rate: 1.0, name: "US Dollar" },
      EUR: { symbol: "€", rate: 0.92, name: "Euro" },
      GBP: { symbol: "£", rate: 0.79, name: "British Pound" },
      JPY: { symbol: "¥", rate: 155.0, name: "Japanese Yen" },
      INR: { symbol: "₹", rate: 84.5, name: "Indian Rupee" },
      AUD: { symbol: "A$", rate: 1.52, name: "Australian Dollar" },
      CAD: { symbol: "C$", rate: 1.38, name: "Canadian Dollar" }
    };
  }

  getCurrencies() {
    return Object.entries(this.rates).map(([code, meta]) => ({
      code,
      symbol: meta.symbol,
      name: meta.name
    }));
  }

  getCurrency() {
    return this.currentCurrency;
  }

  setCurrency(code) {
    if (this.rates[code]) {
      this.currentCurrency = code;
      localStorage.setItem("voyage_currency", code);
      window.dispatchEvent(new CustomEvent("voyage:currency-changed", { detail: { code, symbol: this.rates[code].symbol } }));
    }
  }

  convertFromUSD(usdAmount) {
    if (usdAmount === null || usdAmount === undefined || isNaN(usdAmount)) return 0;
    const rate = this.rates[this.currentCurrency]?.rate || 1.0;
    return Math.round(usdAmount * rate);
  }

  formatUSD(usdAmount) {
    const converted = this.convertFromUSD(usdAmount);
    const meta = this.rates[this.currentCurrency] || this.rates.USD;
    if (this.currentCurrency === "JPY") {
      return `${meta.symbol}${converted.toLocaleString()}`;
    }
    return `${meta.symbol}${converted.toLocaleString()}`;
  }

  formatBudgetRange(minUsd, maxUsd) {
    const minC = this.convertFromUSD(minUsd);
    const maxC = this.convertFromUSD(maxUsd);
    const meta = this.rates[this.currentCurrency] || this.rates.USD;
    return `${meta.symbol}${minC.toLocaleString()} – ${meta.symbol}${maxC.toLocaleString()} ${this.currentCurrency}`;
  }
}

export const currencyService = new CurrencyService();
