const express = require('express')
var bodyParser = require('body-parser')
const _ = require('lodash');
//lodah 사용해서 url param 띄어쓰기나 all lowercase 로 만들어주기.

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('view engine', 'ejs');

// 일단은 몽고DB 사용하려면 백엔드단이 있어야한다고 판단했음. 리액트로 나중에 마이그레이션


// adding workout name - array
let list_contents = []

app.get('/', (req, res) => {
    const date = new Date();
    var options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    };

    const formattedDate = date.toLocaleDateString("en", options)


    res.render('list', {
        listTitle: formattedDate,
        list_contents: list_contents
    });
});


app.post('/', (req, res) => {
    console.log(req.body)
    let list_content = req.body.list_content
    list_contents.push(list_content)
    res.redirect('/')
}


);

app.get('/workout', (req, res) => {
    res.render('workout', {
        workoutTitle: "Work Out"
    })
})

app.get('/workout/:anyname', (req, res) => {
    const loweredParams = _.lowerCase(req.params.anyname)
    list_contents.forEach((content) => {
        const loweredListContent = _.lowerCase(content)
        if (loweredParams === loweredListContent) {
            res.render('workout', {
                workoutTitle: content
            })
        } else {
            res.send("오류페이지다잉")
        }
    })
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})