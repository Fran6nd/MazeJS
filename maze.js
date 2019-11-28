function isOdd(num) { return num % 2; }
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
let USE_REAL_TIME_RENDERING = true;

class size {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class maze {
    constructor(size, canvas) {
        this.aborted = false;
        this.size = size;
        this.map = [];
        this.canvas = canvas;
        this.map.length = size.x;
        for (let x = 0; x < this.map.length; x++) {
            this.map[x] = [];
            this.map[x].length = size.y;
        }
        this.onIteration = function (x, y, map) {
            map[x][y] = 1;
        }
        this.iterate();
        this.generate();
    }
    randomPoint() {
        return new point(getRandomInt(this.size.x - 1) + 1, getRandomInt(this.size.y - 1) + 1);
    }
    isPointInside(p) {
        if (p.x >= 0 && p.y >= 0 && p.x < this.map.length && p.y < this.map[0].length) {
            return true;
        }
        return false;
    }
    isPathable(p, previousPoint) {
        let closePoints = [];
        closePoints.push(new point(p.x + 1, p.y + 1));
        closePoints.push(new point(p.x - 1, p.y + 1));
        closePoints.push(new point(p.x + 1, p.y - 1));
        closePoints.push(new point(p.x - 1, p.y - 1));

        closePoints.push(new point(p.x, p.y + 1));
        closePoints.push(new point(p.x - 1, p.y));
        closePoints.push(new point(p.x, p.y - 1));
        closePoints.push(new point(p.x + 1, p.y));
        let closePointsAroundValid = [];
        for (let i = 0; i < closePoints.length; i++) {
            if (this.isPointInside(closePoints[i])) {
                if (closePoints[i].x != previousPoint.x && closePoints[i].y != previousPoint.y) {
                    closePointsAroundValid.push(closePoints[i]);
                }
            }
        }
        if (this.map[p.x][p.y] == 0) {
            return false;
        }
        let availablePointscounter = 0;
        for (let i = 0; i < closePointsAroundValid.length; i++) {
            let pt = closePointsAroundValid[i];
            if (this.map[pt.x][pt.y] == 0) {
                return false;
            }
        }
        closePoints = [];
        closePoints.push(new point(p.x, p.y + 1));
        closePoints.push(new point(p.x - 1, p.y));
        closePoints.push(new point(p.x, p.y - 1));
        closePoints.push(new point(p.x + 1, p.y));
        for (let i = 0; i < closePoints.length; i++) {
            let pt = closePoints[i];
            if (this.isPointInside(pt)) {
                if (this.map[closePoints[i].x][closePoints[i].y] == 0) {
                    availablePointscounter++;
                }
            }

        }
        if (availablePointscounter > 1) {
            return false;
        }
        return true;
    }
    getPathablePointsAround(pos) {
        let pointList = [];
        if (isOdd(pos.x)) {
            pointList.push(new point(pos.x, pos.y + 1));
            pointList.push(new point(pos.x, pos.y - 1));
        }
        if (!isOdd(pos.y)) {
            pointList.push(new point(pos.x + 1, pos.y));
            pointList.push(new point(pos.x - 1, pos.y));
        }
        let output = [];
        for (let i = 0; i < pointList.length; i++) {
            if (this.isPointInside(pointList[i])) {
                if (this.isPathable(pointList[i], pos)) {
                    output.push(pointList[i]);
                }
            }
        }
        return output;
    }
    generate() {
        this.pathed = [];
        let startPoint = this.randomPoint();
        this.path = [];
        this.path.length = this.size.x * this.size.y;
        this.explore(null, startPoint, startPoint, 0);


    }
    abort() {
        this.aborted = true;
    }
    explore(previousPoint, point, startPoint, index) {
        if (point && !this.aborted) {
            this.path[index] = point;
            let new_index = index + 1;
            this.draw();
            let me = this;
            this.map[point.x][point.y] = 0;
            let possibilities = this.getPathablePointsAround(point);
            if (possibilities.length == 1) {
                if(USE_REAL_TIME_RENDERING)
                {
                window.requestAnimationFrame(function () { me.explore(point, possibilities[0], startPoint, new_index); });
                }
                else
                {
                    me.explore(point, possibilities[0], startPoint, new_index);
                }
            }
            else if (possibilities.length > 0) {
                let choice = getRandomInt(possibilities.length);
                if(USE_REAL_TIME_RENDERING)
                {
                window.requestAnimationFrame(function () { me.explore(point, possibilities[choice], startPoint, new_index); });
                }
                else{
                    me.explore(point, possibilities[choice], startPoint, new_index);
                }
            }
            else {
                if (index - 1 > 0) {
                    if(USE_REAL_TIME_RENDERING)
                    {
                        window.requestAnimationFrame(function () { me.explore(null, me.path[index - 1], startPoint, index - 1); });
                    }
                    else{
                        me.explore(null, me.path[index - 1], startPoint, index - 1);
                    }
                }
                else {
                    alert('Maze generation successfull!');
                }
            }
        }


    }
    iterate() {
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                this.onIteration(x, y, this.map);
            }
        }
    }
    onIteration(x, y, tile) {

    }
    draw() {
        let canvas = this.canvas;
        let canvasSize = new size(canvas.width, canvas.height);
        let ctx = canvas.getContext('2d');
        let tileSize = new size(canvasSize.x / this.size.x, canvasSize.y / this.size.y);
        this.onIteration = function (x, y, map) {
            if (map[x][y] == 0) {
                ctx.fillStyle = 'white';
                ctx.fillRect(x * tileSize.x, y * tileSize.y, tileSize.x, tileSize.y);
            }
            else {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * tileSize.x, y * tileSize.y, tileSize.x, tileSize.y);
            }

        }
        this.iterate();
    }
}
let mz;
function generate(canvas, x, y, rtr) {
    USE_REAL_TIME_RENDERING = rtr;
    if (mz)
        mz.abort();
    if (canvas.getContext) {
        mz = new maze(new size(x, y), canvas);
    }
}
function cancel()
{
if (mz)
    mz.abort();  
}
