const url=require('url');
const db=require('../../db');
const errorHandler=require('../RequestHandlers/errorHandler');
const {Faculty}=require('../../models').ORM(db);
const {Pulpit}=require('../../models').ORM(db);
const {Subject}=require('../../models').ORM(db);

function addFaculty(request, response, body) 
{
    Faculty.create({ 
        faculty:body.faculty,
        faculty_name:body.faculty_name
    }).then(result => 
        {
            response.end(JSON.stringify(result));
        }).catch(error => errorHandler(response, 500, error.message));
}

function updateFaculty(request, response, body) 
{
    Faculty.update({
        faculty_name:body.faculty_name
    }, 
    {where: {faculty: body.faculty}}) 
    .then(result => {
        if (result==0)
        {
            throw new Error('Faculty not exists');
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
            if (/\/api\/faculties\/.*\/subjects/.test(path)) 
            {
                Faculty.findOne ({
                    include: [{
                        model: Pulpit, 
                        as: 'faculty_pulpits', 
                        required: true, 
                        include: [{
                            model: Subject, 
                            as: 'pulpit_subjects', 
                            required: true
                        }]
                    }], 
                where: {faculty: decodeURI(path.split('/')[3])}
                })
                .then(result => 
                    {
                        if (result == 0) 
                        {
                            throw new Error('Subjects not found')
                        } 
                        else 
                        {
                            response.end(JSON.stringify(result))
                        }
                    })
                    .catch(error => errorHandler(response, 500, error.message));
            }
            else 
            {
                Faculty.findAll() 
                    .then(result => 
                        {
                            response.end(JSON.stringify(result));
                        }).catch(error => errorHandler(response, 500, error.message));
            }
            break;
        }

//---------------------POST----------------------------
        case "POST":
        { 
            let body="";   
            if (url.parse(request.url).pathname==="/api/faculties") 
            {
                request.on('data', data => 
                {
                    body+=data.toString();
                });

                request.on('end', () => 
                {
                    addFaculty(request, response, JSON.parse(body));
                });
                break;
            }
        }

//---------------------PUT----------------------------
        case "PUT":
        {
            let body="";   
            if (url.parse(request.url).pathname==="/api/faculties") 
            {
                request.on('data', data => 
                {
                    body+=data.toString();
                });

                request.on('end', () => 
                {
                    updateFaculty(request, response, JSON.parse(body));
                });
                break;
            }
        }

//---------------------DELETE----------------------------
        case "DELETE":
        {
            Faculty.findByPk(request.url.split('/')[3])
            .then(result => 
                {
                    Faculty.destroy({where: {faculty: request.url.split('/')[3]}})
                    .then(resultD => 
                        {
                            if (resultD==0)
                            {
                                throw new Error('This faculty not exists.');
                            }
                            else 
                            {
                                response.end(JSON.stringify(result));
                            }
                        })
                        .catch(error => errorHandler(response, 500, error.message));
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