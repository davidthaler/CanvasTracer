let canvas, context, isDrawing

function shiftXY(e){
    return [e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]
}

function start(e){
    e.preventDefault()
    let [x, y] = shiftXY(e.touches[0])
    context.beginPath()
    context.moveTo(x, y)
}

function draw(e){
    e.preventDefault()
    let [x, y] = shiftXY(e.touches[0])
    context.lineTo(x, y)
    context.stroke()
}

function drawMode(){
    if(isDrawing){
        canvas.removeEventListener('touchstart', start, false)
        canvas.removeEventListener('touchmove', draw, false)
    }else{
        canvas.addEventListener('touchstart', start, false)
        canvas.addEventListener('touchmove', draw, false)
    }
    isDrawing = !isDrawing
    document.getElementById('drawBtn').classList.toggle('active')
}

window.addEventListener('load', function(){
    canvas = document.getElementById('canvas')
    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight
    context = canvas.getContext('2d')
    document.getElementById('drawBtn').addEventListener('click', drawMode)
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
