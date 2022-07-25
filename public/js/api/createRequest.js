/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest(),
          formData = new FormData();
    let queryUrl = '';

    if (options.data) {
        if (options.method === 'GET') {
            queryUrl = '?' + Object.entries(options.data)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            } else {
                Object.entries(options.data).forEach(item => formData.append(...item));
            } 
        } 

    try {
        xhr.open(options.method, options.url + queryUrl, true); 
        xhr.responseType = 'json'; 
        xhr.send(formData);  
    }
    
    catch(err) {
        options.callback(err);
    }

    xhr.onload = () => {
        let err = null,
            resp = null; 
            if (xhr.status === 200)  resp = xhr.response;
                else err = xhr.status;
                
            options.callback(err, resp); 
        };
    return xhr; 
}


/* const createRequest = async (options = {}) => {
    let queryUrl = '',
        err = null, 
        resp = null;
const formData = new FormData();

    if (options.data) {
        if (options.method === 'GET') {
            queryUrl = '?' + Object.entries(options.data)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            } else {
                Object.entries(options.data).forEach(item => formData.append(...item));
                    const response = await fetch(options.url, {
                        method: options.method,
                        body: formData
                    });
                }  
        }
    const response = await fetch(options.url+queryUrl);
        if (!response.ok) err = response.status;
            resp = await response.json();    
            options.callback(err, resp);  */     