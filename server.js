const express = require('express')
var bodyParser = require('body-parser')

// 다 합쳐서 내가 만들면 되겠네. 

// ejs 써서 다이나믹한 렌더링하려고 함. ex) 운동이름/날짜 
// views 폴더 안에 ejs 파일 만들어주기 
// express로 기본적인 서버 구축하고 input 값 받아오려면 bodyParser 사용해야함.
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

// 일단은 몽고DB 사용하려면 백엔드단이 있어야한다고 판단했음. 리액트로 나중에 마이그레이션
// 라우팅 각자 다르게 하는거


let nameSetRep = []
// 이거 배열로 루프돌리면 운동이름, 세트, 횟수를 따로 렌더링해서 안엮이는구나
// 배열 안에 배열로 넣어서 한 덩어리씩 넣자. -> 나중에 분명히 오브젝트 키밸류 형태로 고쳐야함.
// 일단 지금은 배열로.


// let nameSetRep = ""
// app.post 에서 app.get 으로 redirect할 때 이미 정해진 변수가 아니면 오류남. 미리 여기서 선언.
// nameSetRep을 array(배열)로 만들어주지 않으면 한가지 변수만 계속 replace 되는구나. 
// 배열에 push 하니까 리스트로 종열로 만들어지는게 아니라 바로 옆에 다닥다닥 붙네. <br>도 안먹는구나.
// loop through it 해야겠네.

// 10월 20일 해야할 일 - github 커밋할 것 / css 안되는 이유 찾을 것 (적용은 html 일까 ejs 일까)
// 구현할 목표를 정확하고 단순하게 정해서 다음 나아가야할 논리 짜기
// 아마도 운동 정했으며 그 운동을 키로, 무게/세트/횟수를 밸류로 오브젝트를 만드는 것이 맞는 것 같다
// 오브젝트 만들 때 함수 넣어서 나중에 클래스 만들고 쓸 수 있나? 이건 그때 생각하자.

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
        Date: formattedDate,
        exTrack: nameSetRep
    });
});




app.post('/', (req, res) => {
    let name = req.body.운동이름
    let set = req.body.몇세트
    let rep = req.body.몇회
    let NSR = [name, set, rep]
    nameSetRep.push(NSR)
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})