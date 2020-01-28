let canvas, context, isDrawing
let data = []

function shiftXY(e){
    return [e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]
}

function startCurve(x, y){
    data.push({
        lineWidth: context.lineWidth,
        color: context.strokeStyle,
        points: [[x, y]],
        times: [Date.now()]
    })
}

function addPoint(x, y){
    let curve = data[data.length - 1]
    curve.points.push([x, y])
    curve.times.push(Date.now())
}

function start(e){
    e.preventDefault()
    let [x, y] = shiftXY(e.touches[0])
    context.beginPath()
    context.moveTo(x, y)
    startCurve(x, y)
}

function draw(e){
    e.preventDefault()
    let [x, y] = shiftXY(e.touches[0])
    context.lineTo(x, y)
    context.stroke()
    addPoint(x, y)
}

function drawMode(){
    let drawBtn = document.getElementById('drawBtn')
    if(isDrawing){
        canvas.removeEventListener('touchstart', start, false)
        canvas.removeEventListener('touchmove', draw, false)
        drawBtn.textContent = 'Start Drawing'
    }else{
        canvas.addEventListener('touchstart', start, false)
        canvas.addEventListener('touchmove', draw, false)
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
    document.getElementById('picker').dispatchEvent(new Event('change'))
    document.getElementById('widthSelector').dispatchEvent(new Event('change'))
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

function postShape(){
    fetch('/data', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
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
    document.getElementById('sendBtn').addEventListener('click', postShape)
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
