const url=require('url');
const db=require('../../db');
const errorHandler=require('../RequestHandlers/errorHandler');
const {Auditorium}=require('../../models').ORM(db);
const {Auditorium_type}=require('../../models').ORM(db);

function addAuditoriumtype(request, response, body)
{
    Auditorium_type.create({
        auditorium_type:body.auditorium_type,
        auditorium_typename:body.auditorium_typename
    }).then(result =>
        {
            response.end(JSON.stringify(result));
        }).catch(error => errorHandler(response, 500, error.message));
}

function updateAuditoriumtype(request, response, body)
{
    Auditorium_type.update({
        auditorium_typename:body.auditorium_typename
    },
    {where: {auditorium_type: body.auditorium_type}})
    .then(result => {
        if (result==0)
        {
            throw new Error('Auditorium type not exists');
        }
        else
        {
            response.end(JSON.stringify(body))
        }
    }).catch (error => errorHandler(response, 500, error.message));
}

module.exports=function (request, response) {
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

    switch (request.method) {

//---------------------GET----------------------------
        case "GET":
        {
            const path = request.url;    
            
            if (/\/api\/auditoriumtypes\/.*\/auditoriums/.test(path))
            {
                Auditorium_type.findAll
                ({
                    include:[{model: Auditorium, as: 'auditoriums', required:true}],
                    where: {auditorium_type: decodeURI(path.split('/')[3])}
                }).then(result =>
                    {
                        if (result == 0) 
                        {
                            throw new Error('Auditoriums not found')
                        } else 
                        {
                            response.end(JSON.stringify(result))
                        }
                    })
                    .catch(err => errorHandler(response, 500, err.message));
            }
        else if (url.parse(request.url).pathname == '/api/auditoriumtypes')
        {
            Auditorium_type.findAll()
            .then(result => response.end(JSON.stringify(result)))
            .catch(error => errorHandler(response, 500, error.message));
        }
        break;
        }

//---------------------POST---------------------------
        case "POST":
        {
            let body = '';
            if (url.parse(request.url).pathname == '/api/auditoriumtypes') {
                request.on('data', function (data) {
                    body += data.toString();
                });
                request.on('end', function () {
                    body = JSON.parse(body);
                    addAuditoriumtype(request, response, body);
                });

                break;
            }
        }

//---------------------PUT----------------------------
        case "PUT":
        {
            let body = '';
            if (url.parse(request.url).pathname == '/api/auditoriumtypes') {
                request.on('data', function (data) {
                    body += data.toString();
                });
                request.on('end', function () {
                    body = JSON.parse(body);
                    updateAuditoriumtype(request, response, body);
                });

                break;
            }
        }

//---------------------DELETE-------------------------
        case "DELETE":
        {
            Auditorium_type.findByPk(request.url.split('/')[3])
            .then(result => 
            {
                Auditorium_type.destroy({where: {auditorium_type: request.url.split('/')[3]}})
                .then(resultD => {
                    if (resultD==0)
                    {
                        throw new Error('Auditorium type not exists');
                    }
                    else
                    {
                        response.end(JSON.stringify(result))
                    }
                }).catch (error => errorHandler(response, 500, error.message));
            }).catch(error => errorHandler(response, 500, error.message));
            break;
        }

        default:
        {
            errorHandler(response, 405, 'Method Not Allowed');
            break;
        }
    }   
};