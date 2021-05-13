const notifier = require('node-notifier');
const rp = require('request-promise');
const fs = require('fs');

const config = require('./config.json');

function notify(crypto, breaking = false) {
    notifier.notify({
        title: crypto.symbol + ' is exploding 🚀',
        message: crypto.name + ' ( ' + Math.round(c.quote.EUR.percent_change_1h * 100)/100 + '%)',
        sound: "Ping",
        wait: true,
        timeout: 60,
        open: 'https://coinmarketcap.com/currencies/' + crypto.slug,
        closeLabel: 'Close',
        actions: '',
    });

    console.log(now() + crypto.name + " " + c.quote.EUR.price + "€" + ' (+ ' + Math.round(c.quote.EUR.percent_change_1h * 100)/100 + '%)');
}

function notifyTreshold(treshold, currentPrice, buyOrSell) {
    notifier.notify({
        title: "⚠️Treshold achieved⚠️",
        message: buyOrSell + ' ' + treshold.token + ' at ' + currentPrice + '€ (treshold: ' + treshold.price + ')',
        sound: "Ping",
        wait: true,
        timeout: 60,
        closeLabel: 'Close',
        actions: '',
    });

    console.log(now() + buyOrSell + ' ' + treshold.token + ' ' + currentPrice + '€ (treshold: ' + treshold.price + ')');
}


function breaking(crypto, percent) {
    notifier.notify({
        title: 'Breaking ' + crypto.symbol + ' 🚀',
        message: crypto.name + ' (' + Math.round(percent * 100)/100 + '%) in 10 min',
        sound: "Ping",
        wait: true,
        timeout: 60,
        open: 'https://coinmarketcap.com/currencies/' + crypto.slug,
        closeLabel: 'Close',
        actions: '',
    });

    console.log(now() + crypto.name + " " + c.quote.EUR.price + "€" + ' (+ ' + Math.round(percent * 100)/100 + '% in 10 min)');
}

function notifyError(e) {
    console.error(now() + e);
    notifier.notify({
        title: "Cryptose error",
        message: e + " ",
        sound: "Basso",
        timeout: 15,
    });
}

let previousData = null;

function update() {
    // Load the data from the API
    rp(requestOptions).then(data => {
        try {
            if (config.saveFile) {
                fs.writeFile(config.saveLocation, JSON.stringify(data), () => {});
            }


            for (let crypto in data.data) {
                c = data.data[crypto];
                // hourly percent change
                if (c.quote.EUR.percent_change_1h > config.treshold) {
                    notify(data.data[crypto]);
                } else if (c.quote.EUR.percent_change_1h < -config.treshold) {
                    notify(data.data[crypto]);
                }

                // 10 minute percent change
                if (previousData != null) {

                    let lastDate = new Date(previousData.status.timestamp);
                    let today = new Date();
                    if ((today - lastDate) / 1000 / 60 < 15) {
                        
                        let oldPrice = previousData.data[crypto].quote.EUR.price;
                        let newPrice = c.quote.EUR.price;

                        let percent = 100 * (newPrice - oldPrice) / oldPrice;
                        if (percent > config.treshold / 6) {
                            breaking(data.data[crypto], percent);
                        }
                        if (percent < -config.treshold / 6) {
                            breaking(data.data[crypto], percent);
                        }
                    }
                }
            }


            // Price treshold
            try {
                let tresholds = JSON.parse(fs.readFileSync('tresholds.json'));
                for (let treshold of tresholds) {
                    if (treshold.moreOrLess === "-") {
                        if (data.data[treshold.token].quote.EUR.price <= treshold.price) {
                            notifyTreshold(treshold, data.data[treshold.token].quote.EUR.price, 'Buy');
                        }
                    } else {
                        if (data.data[treshold.token].quote.EUR.price >= treshold.price) {
                            console.log(treshold);
                            notifyTreshold(treshold, data.data[treshold.token].quote.EUR.price, 'Sell');
                        }
                    }
                }

            } catch(e) {
                notifyError(e);
            }
            previousData = data;
        } catch(e) {
            notifyError(e)
        }
    }).catch((e) => {
        notifyError(e);
    });
}

const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    qs: {
      symbol: config.coins.join(","),
      convert: config.convert
    },
    headers: {
      'X-CMC_PRO_API_KEY': config.CMC_API_KEY
    },
    json: true,
    gzip: true
};

function now() {
    d = new Date();
    return "["+ ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2) + "] ";
}


let interval = setInterval(() => {
    update();
}, config.interval * 1000);
update();
