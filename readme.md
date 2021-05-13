# Cryptose
Cryptose is a small application that sends you notifications for certains events.

It can send notification when a crypto is currently going to the moon or is crashing.

It's also possible to define treshold, for example when a crypto is less or more than a certain price, it will also send you a notification.

Still in WIP.
# Setup

Clone the project
```
git clone https://github.com/nicoblabla/cryptose.git

cd cryptose
npm install
```

## config.json
Rename `config.example.json` as `config.json`
* CMC_API_KEY
Get your api key https://pro.coinmarketcap.com/ (free) and paste it in the config file.
* treshold
How many percent does a crypto need to go up/down for a notification.
* interval
Time in seconds between each update. Max 333 API call per day with the free api key.
* coins
Arrays of tokens you want to watch.
Here is the list off all coinbase tradable tokens:
```
["1INCH", "AAVE", "ADA", "ALGO", "ANKR", "ATOM", "BAL", "BAND", "BAT", "BCH", "BNT", "BSV", "BTC", "Celo", "COMP", "CRV", "CTSI", "CVC", "DAI", "DASH", "DNT", "ENJ", "EOS", "ETC", "ETH", "FORTH", "FIL", "GRT", "GNT", "KNC", "LINK", "LOOM", "LRC", "LTC", "MANA", "MATIC", "MIR", "MKR", "NMR", "NKN", "NU", "OGN", "OMG", "OXT", "REN", "REP", "RLC", "SUSHI", "SKL", "SNX", "STORJ", "TRB", "USDC", "USDT", "UMA", "UNI", "WBTC", "XLM", "XRP", "XTZ", "YFI", "ZEC", "ZRX"],
```
* convert
The price currency
* saveFile
True if you want to save the data in a file.
* saveLocation
The save file location.

The program need to restart after each change

## tresholds.json
Rename `tresholds.example.json`  as `tresholds.json`
Array of tresholds:
* token
* price
* moreOrLess
'+' or '-'

## Launching
To simply launch it:
```
node cryptose.js
```

Use [forever](https://www.npmjs.com/package/forever) to launch it as a service and to run infinitely:
```
forever start cryptose.js
forever stop cryptose.js
```
