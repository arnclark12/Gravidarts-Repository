
let s0, s1, j;
let board_center_x = 400;
let board_center_y = 400;
let board_radius = 240;

function setup() {
    new Canvas(800, 800, InteractiveDartboardCanvas);
    world.gravity.y = 200;

    fulcrum = new Sprite(board_center_x,board_center_y,20,20,'k');

    board = new Sprite(board_center_x,board_center_y);

    board.img = 'images/gravifelt.png';
    board.diameter = board_radius * 2;

    j = new HingeJoint(fulcrum, board);
    j.maxPower = 140;

    // POINTER
    pointer = new Sprite(board_center_x-4,board_center_y + board_radius + 25,25,51,'n');

    pointer.img = 'images/pointer.png';

}
function draw() {
    imageMode(CENTER);

    image(
        pointerImg,
        board_center_x,
        board_center_y + board_radius + 1800,30,51);}

let dartCount = 0; // Keep track of how many darts have been thrown

function draw() {
    clear();
    if (mouse.presses()) {
        // Determine the image based on groups of 3 (3 red, 3 blue, etc.)
        let dartImage;
        if (Math.floor(dartCount / 3) % 2 === 0) {
            dartImage = 'images/dartred.png';
        } else {
            dartImage = 'images/dartblue.png';
        }

        if (Math.sqrt(Math.pow(mouse.x - board_center_x, 2) + Math.pow(mouse.y - board_center_y, 2)) < board_radius) {
            let dart = new Sprite(mouse.x, mouse.y, 20, 20);
            dart.img = dartImage;
            dart.rotation = Math.random() * 360;
            new GlueJoint(dart, board);
        } else {
            let dart = new Sprite(mouse.x, mouse.y, 20, 20);
            dart.img = dartImage;
            dart.rotation = Math.random() * 360;
        }

        dartCount++; // Increment the counter after each click
    }
}