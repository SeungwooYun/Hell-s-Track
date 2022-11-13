const express = require('express')
var bodyParser = require('body-parser')
const _ = require('lodash');
//lodah 사용해서 url param 띄어쓰기나 all lowercase 로 만들어주기.
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hellstrackDB');


const workoutNameSchema = new mongoose.Schema({
    name: String,
});

const WorkoutName = mongoose.model("Workout", workoutNameSchema);



const workoutName_1 = new WorkoutName({
    name: "Hi This is Hell's Track"
})

const workoutName_2 = new WorkoutName({
    name: "Add your workouts for the day"
})

const workoutName_3 = new WorkoutName({
    name: "and record all your routine"
})
const defaultWorkoutName = [workoutName_1, workoutName_2, workoutName_3]


const eachWorkoutSchema = {
    name: String,
    kg: Number,
    rep: Number
};

const eachWorkoutList = mongoose.model("Eachworkoutlist", eachWorkoutSchema);








// 일단은 몽고DB 사용하려면 백엔드단이 있어야한다고 판단했음. 리액트로 나중에 마이그레이션


// adding workout name - array
// let workoutList = []
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

    WorkoutName.find((err, workoutNames) => {

        if (workoutNames.length === 0) {
            WorkoutName.insertMany(defaultWorkoutName, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("successfully saved default workoutNames")
                    res.redirect('/')
                }
            })
        } else {
            res.render('list', {
                listTitle: formattedDate,
                workoutList: workoutNames
            });
        }


    })


});


app.post('/', (req, res) => {
    const workoutList_element = req.body.workoutList_element;
    const newWorkOutName = new WorkoutName({
        name: workoutList_element
    });
    newWorkOutName.save();
    res.redirect('/')
}
);

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    WorkoutName.findByIdAndDelete(checkedItemId, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("successfully deleted the item with id")
            res.redirect('/');
        }
    })
})

app.get('/workout', (req, res) => {
    res.render('workout', {
        workoutTitle: workoutTitle,
        kgsAndReps: kgsAndReps
    })
})


app.get('/workout/:anyname', (req, res) => {

    const anyName = req.params.anyname;

    eachWorkoutList.find({ name: anyName }, function (err, found) {
        res.render("workout", {
            workoutTitle: anyName,
            kgsAndReps: found
        })
    })
})

app.post('/workout', (req, res) => {

    const workoutName = req.body.workoutTitle
    const eachWorkout = new eachWorkoutList({
        name: req.body.workoutTitle,
        kg: req.body.kg,
        rep: req.body.rep
    })
    eachWorkout.save()
    res.redirect('/workout/' + workoutName)
})

// const eachworkout = new eachWorkoutList({
//     name: anyName,
//     kg: 1,
//     rep: 1
// })

// eachworkout.save();

// const loweredParams = _.lowerCase(req.params.anyname)
// workoutList.forEach((content) => {
//     const loweredListContent = _.lowerCase(content)
//     if (loweredParams === loweredListContent) {
//         res.render('workout', {
//             workoutTitle: _.startCase(content),
//             kgsAndReps: kgsAndReps
//         })
//     }
// })





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