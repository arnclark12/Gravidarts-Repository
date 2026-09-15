let s0, s1, j;

let board_center_x = 275;
let board_center_y = 275;
let board_radius = 240;

let dartCount = 0; // Keep track of how many darts have been thrown

function setup() {
    // Keep the physics coordinate system at 800 x 800
    new Canvas(550, 550, InteractiveDartboardCanvas);
    

    world.gravity.y = 200;

    // Make canvas responsive on mobile
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";

    // FULCRUM
    fulcrum = new Sprite(
        board_center_x,
        board_center_y,
        20,
        20,
        'k'
    );

    // DARTBOARD
    board = new Sprite(
        board_center_x,
        board_center_y
    );

    board.img = 'images/gravifelt.png';
    board.diameter = board_radius * 2;

    // HINGE
    j = new HingeJoint(fulcrum, board);
    j.maxPower = 140;

    // POINTER
    pointer = new Sprite(
        board_center_x - 4,
        board_center_y + board_radius + 10,
        25,
        51,
        'n'
    );

    pointer.img = 'images/pointer.png';
}


function draw() {
    clear();

    // Throw a dart when the screen/mouse is pressed
    if (mouse.presses()) {

        // Alternate colors every 3 darts
        // Darts 1-3 = red
        // Darts 4-6 = blue
        // Darts 7-9 = red
        // etc.
        let dartImage;

        if (Math.floor(dartCount / 3) % 2 === 0) {
            dartImage = 'images/dartred.png';
        } else {
            dartImage = 'images/dartblue.png';
        }

        // Calculate distance from board center
        let distanceFromCenter = Math.sqrt(
            Math.pow(mouse.x - board_center_x, 2) +
            Math.pow(mouse.y - board_center_y, 2)
        );

        // Create the dart
        let dart = new Sprite(
            mouse.x,
            mouse.y,
            20,
            20
        );

        dart.img = dartImage;
        dart.rotation = Math.random() * 360;

        // If dart lands on the board, glue it to the board
        if (distanceFromCenter < board_radius) {
            new GlueJoint(dart, board);
        }

        // Increment dart counter
        dartCount++;
    }
}
