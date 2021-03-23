import { RequestHandler, response } from 'express';
import fetch from 'node-fetch';

const { API_VERSION, MONITORING_SERVICE_PORT } = process.env;

const monitorMiddleware: RequestHandler = (req, res, next) => {
    fetch(`http://curli.ir:${MONITORING_SERVICE_PORT}/api/v${API_VERSION}/saveSite`, {
        method: 'POST',
        body: JSON.stringify({
            domain: `curli.ir`,
            ip: req.ip,
            useragent: req.useragent
        }),
        headers: {
            'content-type': 'application/json'
        },
        redirect: 'follow'
    })
    .then(response => response.json())
    .then(data => true)
    .catch(e => console.log(e));
    return next();
}

export default monitorMiddleware;