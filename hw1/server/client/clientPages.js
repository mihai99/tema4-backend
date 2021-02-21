const index = `
    <div>
        <div class="container forms" >
            <form action="/request" method="post" class="form form-special">
                <div class="form-group">
                    <div class="form-group">
                        <label>Title:</label>
                        <input type="text" class="form-control" name="title" placeholder="Title">
                    </div>
                    <input type="submit" value="Get some movies" class="btn btn-primary">
                </div>
            </form>
        </div>
    </div>
`
const header = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CC</title>
    <link href="https://fonts.googleapis.com/css?family=Be+Vietnam:400,700|Big+Shoulders+Display:400,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script
    src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
    crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/stylesheets/main.css">
    <script src="https://kit.fontawesome.com/d6976534fe.js"></script>
    <style>
        .forms{
            margin-top: 50px;
            display: flex;
        }
        .form-special{
            width: 50%;
            border: 1px solid #cfcdcd;
            border-radius: 10px;
            padding: 30px;
            margin-right: 20px;
        }
        .bigData{
            max-width: 300px;
            overflow: auto;
            height: 80px
        }
    </style>
</head>
<body>`
const footer = `    
</body>
</html>`

module.exports = {index, footer, header}