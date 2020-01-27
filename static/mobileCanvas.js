let canvas, context, isDrawing
let data = []

function shiftXY(e){
    return [e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]
}

function startCurve(x, y){
    data.push({
        lineWidth: context.lineWidth,
        color: context.strokeStyle,
        points: [[x, y]]
    })
}

function addPoint(x, y){
    data[data.length - 1].points.push([x, y])
}

function start(e){
    e.preventDefault()
    let [x, y] = shiftXY(e.touches[0])
    context.beginPath()
    context.moveTo(x, y)
    startCurve(x, y)
    postTime('curveStart')
}

function draw(e){
    e.preventDefault()
    let [x, y] = shiftXY(e.touches[0])
    context.lineTo(x, y)
    context.stroke()
    addPoint(x, y)
}

function finish(e){
    e.preventDefault()
    //postTime('curveEnd')
    postCurve()
}

function drawMode(){
    let drawBtn = document.getElementById('drawBtn')
    if(isDrawing){
        canvas.removeEventListener('touchstart', start, false)
        canvas.removeEventListener('touchmove', draw, false)
        canvas.removeEventListener('touchend', finish, false)
        drawBtn.textContent = 'Start Drawing'
    }else{
        canvas.addEventListener('touchstart', start, false)
        canvas.addEventListener('touchmove', draw, false)
        canvas.addEventListener('touchend', finish, false)
        drawBtn.textContent = 'Stop Drawing'
    }
    isDrawing = !isDrawing
    drawBtn.classList.toggle('btn-success')
    drawBtn.classList.toggle('btn-primary')
}

function redraw(){
    for(let path of data){
        context.lineWidth = path.lineWidth
        context.strokeStyle = path.color
        context.beginPath()
        context.moveTo(...path.points[0])
        for(let point of path.points.slice(1)){
            context.lineTo(...point)
        }
        context.stroke()
    }
}

function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function undo(){
    data.pop()
    clearCanvas()
    redraw()
}

function reset(){
    data = []
    clearCanvas()
}

function postTime(what){
    let body = {}
    body[what] = Date.now()
    fetch('/data', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
}

function postCurve(){
    if(data.length == 0) return
    fetch('/data', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data[data.length - 1])
    })
}

window.addEventListener('load', function(){
    canvas = document.getElementById('canvas')
    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight
    context = canvas.getContext('2d')
    document.getElementById('drawBtn').addEventListener('click', drawMode)
    document.getElementById('clearBtn').addEventListener('click', reset)
    document.getElementById('undoBtn').addEventListener('click', undo)
    document.getElementById('picker')
            .addEventListener('change', function(){
                context.strokeStyle = this.value
            })
    let wd = document.getElementById('widthDisplay')
    document.getElementById('widthSelector')
            .addEventListener('change', function(){
                context.lineWidth = this.value ** 2
                wd.textContent = this.value
            })
})
