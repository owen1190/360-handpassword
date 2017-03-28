var R = 26, //半径
    CW,
    CH, //画布宽高
    OffsetX,
    OffsetY = 30, //九宫格起始点坐标
    pointLocation = [];
var hint, //提示语
    input1,
    input2,
    canvas;

window.onload = function() {
    canvas = document.getElementById('myCanvas');
    CW = document.body.offsetWidth;
    OffsetX = CW * 0.6;
    canvas.width = CW;
    CH = canvas.height;
    //获取圆与圆之间的横向与纵向距离
    var disX = (CW - 2 * OffsetX - R * 2 * 3) / 2;
    var disY = (CH - 2 * OffsetY - R * 2 * 3) / 2;
    hint = document.getElementById('hint');
    //求圆心的坐标
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var point = {
                X: (OffsetX + j * disX + (2 * j + 1) * R),
                Y: (OffsetY + i * disY + (2 * i + 1) * R)
            };
            pointLocation.push(point);
        }
    }
    //获取绘图上下文
    var context = canvas.getContext("2d");
    //画出九宫格
    draw(context, pointLocation, [], null);
    input1 = document.getElementById('set');
    input2 = document.getElementById('confirm');
    localStorage.removeItem("password"); //避免刷新之后，仍保留上次的localStorage
    input1.addEventListener("click", function() {
        hint.innerText = "请输入手势密码";
        listenerEvent(canvas, context);
    }, false);
    input2.addEventListener("click", function() {
        if (localStorage.getItem("password") == undefined) { //未设置密码，就验证密码
            hint.innerText = "请先设置密码";
        } else {
            listenerEvent(canvas, context);
        }
    }, false);
}

function isSelected(touches, linePoint) {
    for (var i = 0; i < pointLocation.length; i++) {
        var currentPoint = pointLocation[i];
        var xdiff = Math.abs(currentPoint.X - touches.pageX);
        var ydiff = Math.abs(currentPoint.Y - touches.pageY);
        //触摸点距离圆心的距离
        var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
        if (dir < R) {
            if (linePoint.indexOf(i) < 0) {
                linePoint.push(i);
            }
            break;
        }
    }
}

function listenerEvent(canvas, context) {
    var linePoint = []; //存储触摸过的九宫格的序号
    canvas.addEventListener("touchstart", function(evnet) {
        isSelected(event.touches[0], linePoint);
        hint.innerText = "请输入手势密码"; //当输入错误后再次输入，更改提示
    }, false);
    canvas.addEventListener("touchmove", function(event) {
        event.preventDefault();
        isSelected(event.touches[0], linePoint);
        context.clearRect(0, 0, CW, CH);
        draw(context, pointLocation, linePoint, {
            X: event.touches[0].pageX,
            Y: event.touches[0].pageY
        });
    }, false);
    canvas.addEventListener("touchend", function() {
        context.clearRect(0, 0, CW, CH);
        draw(context, pointLocation, linePoint, null);
        if (input1.checked) { //如果是设置密码情况
            setPassword(linePoint);
        }
        if (input2.checked) { //如果是验证密码情况
            checkPassword(linePoint);
        }
        linePoint = []; //完事后清空数组
    }, false);
}
function setPassword(linePoint) {
    if (linePoint.length < 5) {
        hint.innerText = "密码太短，至少需要5个点";
    } else {
        if (localStorage.getItem("password")) {
            var item = localStorage.getItem("password");
            //判断两次输入是否一致
            if (item == linePoint.toString()) {
                hint.innerText = "密码设置成功";
            } else {
                hint.innerText = "两次输入不一致";
                localStorage.removeItem("password");
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, CW, CH);
                for (var i = 0; i < pointLocation.length; i++) {
                    var Point = pointLocation[i];
                    context.fillStyle = "#DADADA";
                    context.beginPath();
                    context.arc(Point.X, Point.Y, R, 0, Math.PI * 2, true);
                    context.closePath();
                    context.fill();
                    context.fillStyle = "#ffffff";
                    context.beginPath();
                    context.arc(Point.X, Point.Y, R - 3, 0, Math.PI * 2, true);
                    context.closePath();
                    context.fill();
                }
            }
        } else {
            hint.innerText = "请再次输入手势密码";
            localStorage.setItem("password", linePoint
          );
        }
    }
}
function checkPassword(linePoint) {
    var item = localStorage.getItem("password");
    if (item == linePoint.toString()) {
        hint.innerText = "密码正确";
    } else {
        hint.innerText = "密码不正确";
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, CW, CH);
        for (var i = 0; i < pointLocation.length; i++) {
            var Point = pointLocation[i];
            context.fillStyle = "#DADADA";
            context.beginPath();
            context.arc(Point.X, Point.Y, R, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            context.fillStyle = "#ffffff";
            context.beginPath();
            context.arc(Point.X, Point.Y, R - 3, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }
    }
}
function draw(context, pointLocation, linePoint, touchPoint) {
    if (linePoint.length > 0) {
        context.beginPath();
        for (var i = 0; i < linePoint.length; i++) { //画线
            var pointIndex = linePoint[i];
            context.lineTo(pointLocation[pointIndex].X, pointLocation[pointIndex].Y);
        }
        context.lineWidth = 5;
        context.strokeStyle = "red";
        context.stroke();
        context.closePath();
        if (touchPoint != null) {//如果划过圆点，处于圆点之间空白间隙
            var lastPointIndex = linePoint[linePoint.length - 1];
            var lastPoint = pointLocation[lastPointIndex];
            context.beginPath();
            context.moveTo(lastPoint.X, lastPoint.Y);
            context.lineTo(touchPoint.X, touchPoint.Y);
            context.stroke();
            context.closePath();
        }
    }
    //绘制九宫格
    for (var i = 0; i < pointLocation.length; i++) {
        var Point = pointLocation[i];
        context.fillStyle = "#DADADA";
        context.beginPath();
        context.arc(Point.X, Point.Y, R, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(Point.X, Point.Y, R - 3, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        //触摸后的情况
        if (linePoint.indexOf(i) >= 0) {
            context.fillStyle = "#FFA726";
            context.beginPath();
            context.arc(Point.X, Point.Y, R, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }

    }
}
