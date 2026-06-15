const print = require('@medv/prettyjson')

const green = '\x1b[34m';
const blue = '\x1b[34m';
const reset = '\x1b[0m';

const normalizeUrl = (url) => {
    if (url.startsWith('/') || url.startsWith(':')){
        url = 'localhost' + url
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url
    }
    return url    
}

const printHeader = (res) => {
    console.log(`${blue}HTTP/` + res.request.res.httpVersion, 
        res.status, `${green}`, 
        res.statusText, `${reset}`)
    const headerKeys = Object.keys(res.headers)
    headerKeys.sort()
    for(const key of headerKeys) {
        const goodKey = capitalizeFirstLetter(key)
        console.log(`${green}${goodKey}${reset}` + `: ${res.headers[key]}`)
    }    
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const printBody = (res) => {
    console.log()
    console.log(print(res.data))
}

const printErrorHeader = (err) => {
    const firstLine = err.response.request._header.split('\r\n')[0];
    const httpVersion = firstLine.split(' ')[2];
    console.log(        
        green + httpVersion,
        err.response.status, 
        green + err.response.statusText,
        reset
    )
    console.log(`${green}Access-Control-Allow-Origin:${reset}`, err.response.headers['access-control-allow-origin'])
    console.log(`${green}Connection:${reset}`, err.response.headers['connection'])
    console.log(`${green}Content-Length:${reset}`, err.response.headers['content-length'])
    console.log(`${green}Content-Type:${reset}`, err.response.headers['content-type'])
    console.log(`${green}Date:${reset}`, err.response.headers['date'])
    console.log(`${green}ETag:${reset}`, err.response.headers['etag'])
    console.log(`${green}Keep-Alive:${reset}`, err.response.headers['keep-alive'])
    console.log(`${green}X-Powered-By:${reset}`, err.response.headers['x-powered-by'])
    console.log()
    console.log()
    console.log(print(err.response.data))
}

const convertToObject = async (params) => {
    return new Promise((resolve, reject) => {
        const result = params.reduce((acc, param) => {
            const [key, value] = param.split('=')
            acc[key] = value
            return acc
        }, {})
        resolve(result)
    })
}

const getStdinData = () => {
    return new Promise((resolve, reject) => {
        if (!process.stdin.isTTY) {
            let chunks = '';
            process.stdin.on('data', (chunk) => {
                chunks += chunk.toString();
            });
            process.stdin.on('end', () => {
                try {
                    const data = JSON.parse(chunks.trim());
                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            });
            process.stdin.resume();
        } else {
            resolve({});
        }
    });
};

const getBearerHeader = (options, method='get', url='') => {
    return {
        headers: {
            'Authorization': `Bearer ${options.auth}`
        }
    }
}

const getBasicHeader = (url, method, data, options) => {
    const base64Content = btoa(options.auth)
    return {
        headers: {
            'Authorization': `Basic ${base64Content}`
        }
    }
}

const getDigestData = (url, method, data, options) => {
    return {
        authData: {
            username: options.auth.split(':')[0],
            password: options.auth.split(':')[1]            
        },
        requestData: {
            headers: { Accept: "application/json" },
            method: method,
            url: url,
            data: data
        }
    }
}

const getSimpleHeader = (url, method, data, options) => {    
    return {
        headers: {
            'Accept': `application/json`
        }
    }
}

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0
}

module.exports = { 
    normalizeUrl, 
    printHeader,
    printBody,
    printErrorHeader,
    convertToObject,
    getBearerHeader,
    isEmpty,
    getDigestData,
    getStdinData,
    getBasicHeader,
    getSimpleHeader
}
