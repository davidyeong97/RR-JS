const prompt = require('prompt-sync')({sigint: true});

// install module by entering "npm install clear-screen"
const clear = require('clear-screen');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field = [[]]) {
        this.field = field;
        this.start = {
            x: 0,
            y:0
        };
        this.hatPos = {
            x: 0,
            y: 0
          };
        this.locationX = 0;
        this.locationY = 0;
    }

    static generateField(height, width, percentage = 0.1) {
        const field = new Array(height).fill(0).map(element => new Array(width));
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                const prob = Math.random();
                field[y][x] = prob > percentage ? fieldCharacter : hole
            }
        }
        return field;
    }

    randomPos() {
        const pos = {
            x: 0,
            y: 0
        }
        pos.x = Math.floor(Math.random() * this.field[0].length);
        pos.y = Math.floor(Math.random() * this.field.length);
    
        return pos;
    }

    startPos() {
        this.start = this.randomPos();
        this.locationX = this.start.x;
        this.locationY = this.start.y;
        this.field[this.start.y][this.start.x] = pathCharacter;
    }

    setHatPos() {
        this.hatPos = this.randomPos(this.start)
        this.field[this.hatPos.y][this.hatPos.x] = hat;
    }

    runGame(){
        this.startPos();

        this.setHatPos();

        let playing = true;
        while(playing) {
            this.print();
            this.getInput();

            if (!this.isInBounds()) {
                console.log('Out of bounds instruction.');
                playing = false;
                break;
            } else if (this.isHole()) {
                console.log('Sorry, you fell down a hole.');
                playing = false;
                break;
            } else if (this.isHat()) {
                console.log('Congrats, you found your hat!');
                playing = false;
                break;
            }
            this.field[this.locationY][this.locationX] = pathCharacter;
        }
    }

    getInput() {
        const input = prompt('Which way? ').toUpperCase();
        switch (input) {
          case 'W':
            this.locationY -= 1;
            break;
          case 'S':
            this.locationY += 1;
            break;
          case 'A':
            this.locationX -= 1;
            break;
          case 'D':
            this.locationX += 1;
            break;
          default:
            console.log('Enter W, A, S or D.');
            this.getInput();
            break;
        }
    }

    isInBounds() {
        return (
          this.locationY >= 0 &&
          this.locationX >= 0 &&
          this.locationY < this.field.length &&
          this.locationX < this.field[0].length
        );
    }

    isHat() {
        return this.field[this.locationY][this.locationX] === hat;
    }

    isHole() {
        return this.field[this.locationY][this.locationX] === hole;
    }

    print() {
        clear();
        this.field.forEach(element => console.log(element.join('')));
    }
}

const newField = new Field(Field.generateField(10,10,0.2));
newField.runGame(true);