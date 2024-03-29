const pulpitHandler = require("./RequestHandlers/pulpitHandler");
const auditoriumtypeHandler = require("./RequestHandlers/auditoriumtypeHandler");
const subjectHandler = require("./RequestHandlers/subjectHandler");
const auditoriumHandler = require("./RequestHandlers/auditoriumHandler");
const teacherHandler = require("./RequestHandlers/teacherHandler");
const facultyHandler = require("./RequestHandlers/facultyHandler");
const getHandler = require('./RequestHandlers/getHandler');
const errorHandler = require('./RequestHandlers/errorHandler');

module.exports=(request, response) => 
{
    const path=request.url;

    switch  (true) 
    {
        case (path === '/'):
        {
            getHandler(request,response); break;
        }
        case (/\/api\/faculties/).test(path):
        {
            facultyHandler(request,response); break;
        }
        case (/\/api\/pulpits/).test(path):
        {
            pulpitHandler(request, response); break;
        }
        case (/\/api\/subjects/).test(path):
        {
            subjectHandler(request, response); break;
        }
        case (/\/api\/auditoriums/).test(path):
        {
            auditoriumHandler(request, response); break;
        }   
        case (/\/api\/auditoriumtypes/).test(path):
        {
            auditoriumtypeHandler(request, response); break;          
        }
        case (/\/api\/teachers/).test(path):
        {
            teacherHandler(request, response); break;
        }
        default:       
        {
            errorHandler(response, 404, 'Not found');
        }
    }
}