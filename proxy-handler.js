const fs = require('fs');
const util = require('util');
const config = require('./config.js');

const getStuff = util.promisify(fs.readFile);

function readFile() {
    return getStuff(`proxy-lists/${config.proxy_list}`, 'utf8');
  }

class ProxyHandler{
    constructor(){
        this.proxies = [];
        this.currentProxy = 0;
        //load proxies
        readFile().then(data => {
            let proxies = data.split('\n');
            for(const proxy of proxies){
                let splitProxy = proxy.split(':');
                if(splitProxy[0] == '') continue;
                splitProxy[1] = splitProxy[1].replace('\r', '');
                this.proxies.push({
                    host: splitProxy[0],
                    port: splitProxy[1]
                });
            }
        });
    }
    getProxy(){
        let num = this.currentProxy;
        this.currentProxy++;

        return this.proxies[num];
    }
    randomProxy(){
        return this.proxies[Math.floor(Math.random() * this.proxies.length)];
    }
}

(async ()=>{
    const Proxy = await new ProxyHandler();
    setTimeout(()=>{
        console.log(Proxy.randomProxy());
    }, 50);
})();
