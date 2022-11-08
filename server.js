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
let workoutList = []
// 변수명 변경 시작
let kgsAndReps = []
let workoutTitle = ''

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
        workoutList: workoutList
    });
});


app.post('/', (req, res) => {
    console.log(req.body)
    let workoutList_element = req.body.workoutList_element
    workoutList.push(_.startCase(workoutList_element))
    res.redirect('/')
}


);

app.get('/workout', (req, res) => {
    res.render('workout', {
        workoutTitle: workoutTitle,
        kgsAndReps: kgsAndReps
    })
})


app.get('/workout/:anyname', (req, res) => {
    const loweredParams = _.lowerCase(req.params.anyname)
    workoutList.forEach((content) => {
        const loweredListContent = _.lowerCase(content)
        if (loweredParams === loweredListContent) {
            res.render('workout', {
                workoutTitle: _.startCase(content),
                kgsAndReps: kgsAndReps
            })
        }
    })
})



app.post('/workout', (req, res) => {
    const kgAndRep = [req.body.kg, req.body.rep]
    kgsAndReps.push(kgAndRep)
    workoutTitle = req.body.workoutTitle
    console.log(req.body)
    res.redirect('/workout')
})
// :anyone 라우트로 redirect 하는 게 불가능하지 않나? 
// 그럼 어떻게 하면 좋을까. 어차피 form 안에 모든 내용들 담겨있을 거고 리스트까지 있으니까
// 새로 만들어진 라우트는 실제로 만들어지게 만드는 게 나으려나? 라우트가 엄청 많아지겠지만.

// 그냥 workout route 에다가 렌더링하면 되겠구나 와 진짜 예상치못했다



app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})