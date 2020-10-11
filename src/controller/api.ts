import { RequestHandler } from 'express';

class ApiController {
    
    createLink: RequestHandler = async (req, res) => {
        // Test API
        return res.status(200).send('OK');
    }

    redirectLink: RequestHandler = async (req, res) => {
        console.log(req.params);
        
        return res.status(200).send('Haha!');
    }

}

export default (new ApiController());