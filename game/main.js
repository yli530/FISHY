title = "FISHY";

description = `
 click and hold
to start fishing
release to catch
`;

characters = [
  `
  bbbb
  bbbb
  bbbb
  bbbb
  bb
  bbb
  `,
  `
   bb
b  bbb
 bbbbb
 bbbbb
b
  `
];

const data = {
  WIDTH: 100,
  HEIGHT: 150
}

options = {
  viewSize: {x: data.WIDTH, y: data.HEIGHT},
  isPlayingBgm: true,
  seed: 5,
  isDrawingParticleFront: true,
  isDrawingScoreFront: true
};

let player;
let snow;
let fish;
let difficultyMul;
let hook;
let hookLength = 0;
let hookCount = 0;

player = {
  pos: vec(data.WIDTH * 0.45, data.HEIGHT * 0.4)
}

function update() {
  if (!ticks) {
    snow = times(40, () => {
      const snowX = rnd(0, data.WIDTH);
      const snowY = rnd(0, data.HEIGHT*0.35);
      return {
        pos: vec(snowX, snowY),
        speed: rnd(0.5, 1)
      };
    });
    fish = times(20, () => {
      const fishX = rnd(0, data.WIDTH);
      const fishY = rnd(data.HEIGHT*0.5, data.HEIGHT);
      return {
        pos: vec(fishX, fishY),
        speed: rnd(0.5, 1),
        bad: (rnd(0, 1)*10 > difficultyMul) ? true : false
      };
    });
    hook = vec(data.WIDTH*0.5 - 2, data.HEIGHT*0.4 + 2);
  }
  difficultyMul = Math.floor(Math.sqrt(hookCount)) < 3 ? 9 : 10 - (Math.floor(Math.sqrt(hookCount)))/2;
  snow.forEach((s) => {
    s.pos.y += s.speed;
    s.pos.x += s.speed/2;
    s.pos.wrap(0, data.WIDTH, 0, data.HEIGHT*0.4);

    color("light_black");
    box(s.pos, 1);
  });
  color("blue");
  char("a", player.pos);
  color("cyan");
  rect(0, data.HEIGHT*0.4 + 3, data.WIDTH*0.5 - 4, 2);
  rect(data.WIDTH*0.5 + 1, data.HEIGHT*0.4 + 3, data.WIDTH*0.5, 2);
  color("light_blue");
  rect(0, data.HEIGHT*0.4 + 5, data.WIDTH, data.HEIGHT*0.6);

  while(fish.length < 20) {
    fish.push({
      pos: vec(0, rnd(data.HEIGHT*0.5, data.HEIGHT)),
      speed: rnd(0.5, 1),
      bad: (rnd(0, 1)*10 > difficultyMul) ? true : false
    })
  }

  if(input.isPressed) {
    hookLength++;
    color("light_black");
    rect(hook, 2, hookLength);
    if(hookLength > data.HEIGHT*0.6) {
      color("light_yellow");
      rect(hook, 2, hookLength);
      hookLength = 0;
      hookCount++;
    }
  } else {
    color("light_yellow");
    rect(hook, 2, hookLength);
    if(hookLength > 0) {
      hookCount++;
    }
    hookLength = 0;
  }

  remove(fish, (f) => {
    f.pos.x += f.speed;

    if(f.bad) {
      color("black");
    } else {
      color("light_yellow");
    }
    const isColldingWithRod = char("b", f.pos).isColliding.rect.light_yellow;
    if (isColldingWithRod) {
      if(f.bad) {
        color("red");
        particle(f.pos);
        play("explosion");
        end();
      } else {
        color("yellow");
        particle(f.pos);
        play("coin");
        addScore(10 * (1 + (f.pos.y - (data.HEIGHT/2))/ 25), f.pos);
      }
    }
    return (isColldingWithRod || f.pos.x > data.WIDTH);
  });
}
