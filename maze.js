function isOdd(num) { return num % 2; }
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

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
        this.size = size;
        this.map = [];
        this.canvas = canvas;
        console.log(size);
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
        return new point(getRandomInt(this.size.x), getRandomInt(this.size.y));
    }
    isPointInside(p) {
        if (p.x >= 0 && p.y >= 0 && p.x < this.map.length && p.y < this.map[0].length) {
            return true;
        }
        return false;
    }
    isPathable(p, previousPoint) {
        let closePoints = [];
        /* closePoints.push(new point(p.x + 1, p.y + 1));
         closePoints.push(new point(p.x - 1, p.y + 1));
         closePoints.push(new point(p.x + 1, p.y - 1));
         closePoints.push(new point(p.x - 1, p.y - 1));*/

        closePoints.push(new point(p.x, p.y + 1));
        closePoints.push(new point(p.x - 1, p.y));
        closePoints.push(new point(p.x, p.y - 1));
        closePoints.push(new point(p.x + 1, p.y));
        let closePointsAroundValid = [];
        for (let i = 0; i < closePoints.length; i++) {
            if (this.isPointInside(closePoints[i])) {
                closePointsAroundValid.push(closePoints[i]);
            }
        }
        if (this.map[p.x][p.y] == 0) {
            return false;
        }
        /*let availablePointscounter = 0;
        for(let i = 0; i < closePointsAroundValid.length; i++)
        {
            if(closePointsAroundValid[i] == 1)
            {
                return false;
            }
        }*/
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
        console.log(pointList, 'gogo');
        let output = [];
        for (let i = 0; i < pointList.length; i++) {
            if (this.isPointInside(pointList[i])) {
                if (this.isPathable(pointList[i], pos)) {
                    output.push(pointList[i]);
                }
            }
        }
        //console.log(output, 'gogo');
        return output;
    }
    generate() {
        this.pathed = [];
        let startPoint = this.randomPoint();
        this.explore(null, startPoint, startPoint);

    }
    explore(previousPoint, point, startPoint) {
        this.draw();
        let me = this;
        console.log('exploring');
        this.map[point.x][point.y] = 0;
        let possibilities = this.getPathablePointsAround(point);
        if (possibilities.length == 1) {
            //me.explore(possibilities[0]);
            window.requestAnimationFrame(function () { me.explore(point, possibilities[0], startPoint); });
        }
        else if (possibilities.length > 0) {
            let choice = getRandomInt(possibilities.length - 1);
            //me.explore(possibilities[choice]);
            window.requestAnimationFrame(function () { me.explore(point, possibilities[choice], startPoint); });
        }
        else {
            console.log('no possibilities');
            //this.explore(previousPoint);
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
        console.log(tileSize);
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

function draw(canvas) {

    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        let x = canvas.width;
        let y = canvas.height;
        let mazeSize = new size(50, 50);

        for (let i = 0; i < x; i++) {
            //ctx.fillStyle = "rgba(" + 255 + "," + 255 + "," + 255 + "," + (255 / 255) + ")";
            // ctx.fillRect(i, 1, 1, 1);
        }
        new maze(new size(50, 50), canvas);
    }
}