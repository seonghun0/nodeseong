var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templeteHTML(title,list, body, control){
    var templete = `
        <!doctype html>
        <html>
        <head>
            <title>WEB - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
        </body>
        </html>
        `
    return templete;
}

function templeteList(fileList){
    var list = '<ul>';
                var i = 0;
                while(i < fileList.length){
                    list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
                    i+=1;
                }
    list = list+'</ul>';
    return list;
}

function templeteForm(title, response){
    fs.readdir('./data', (err, fileList)=>{
        var list = templeteList(fileList);
        var templete = templeteHTML(title, list, `
        <form action="/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p><input type="submit"></p>
        </form>
        `, '');
        response.writeHead(200);
        response.end(templete);
    });
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === "/"){
        if(queryData.id == undefined) {
            var title = "Welcome";
            var description = "Hello, Node.js";
            fs.readdir('./data', (err, fileList)=>{
                var list = templeteList(fileList);
                var templete = templeteHTML(title, list,
                     `<h2>${title}</h2>${description}`,
                     `<a href="/create">create</a>
                     <a href="C:\Users\tmdwn\Downloads\포포몬 2022-07-11 10-57-50\포포몬 2022-07-11 10-57-50\Apps\포포몬.ipa">install</a>`);
                response.writeHead(200);
                response.end(templete);
            });

        } else {
            fs.readFile(`data/${queryData.id}`, `utf-8`, (err, description)=>{

                fs.readdir('./data', (err, fileList)=>{
                    var title = queryData.id;
                    var list = templeteList(fileList);
                    var templete = templeteHTML(title, list,
                         `<h2>${title}</h2>${description}`,
                         ` <a href="/create">create</a> 
                           <a href="/update?id=${title}">update</a>
                           <form action="process_delete" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                           </form>`);
                    response.writeHead(200);
                    response.end(templete);
                });
                
                
            });
        }
    }else if(pathname === "/create"){
        templeteForm("WEB - create", response );
    }else if(pathname === "/process_create"){
        var body = "";
        request.on('data', (data)=>{
            body = body + data;
        });
        request.on('end',()=>{
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, `utf-8`,(err)=>{
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            })
        });
    }else if(pathname === "/update"){
        fs.readFile(`data/${queryData.id}`, `utf-8`, (err, description)=>{
            fs.readdir('./data', (err, fileList)=>{
                var title = queryData.id;
                var list = templeteList(fileList);
                var templete = templeteHTML(title, list,
                     `<form action="/process_update" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value=${title}></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p><input type="submit"></p>
                     </form>`,
                     `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                response.writeHead(200);
                response.end(templete);
            });
            
        });
    }else if(pathname === "/process_delete"){
        var body = "";
        request.on('data', (data)=>{
            body += data;
        });
        request.on('end', ()=>{
           var post = qs.parse(body);
           var id = post.id;
           fs.unlink(`data/${id}`,(err)=>{
            response.writeHead(302, {Location: `/`})
            response.end();
                    
           })
        });
    }else if(pathname === "/process_delete"){

    }else{
        response.writeHead(404);
        response.end('Not found');
        return;
    }
 
});
app.listen(3000); 