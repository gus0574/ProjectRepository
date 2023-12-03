// FRUITS_BASE: 과일의 크기 설정파일
import {Bodies, Body, Engine, Events, Render, Runner, World} from 'matter-js'
import { FRUITS_BASE } from './fruits';

// 게임 엔진 변수 생성
const engine = Engine.create();

// 객체를 그려낼 렌더 객체 생성, 안쪽에는 게임 엔진과 어떤 element 에 구현할 것인가
const render = Render.create({
  engine, 
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8", 
    width: 620,
    height: 850,
  }
});

//world 객체를 engine에 넣어줌
const world = engine.world;

//왼쪽 벽 , Bodies로 형태를 만들어줌
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

//오른쪽 벽
const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

// 바닥
const groundWall = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

// 윗 벽
const topLine = Bodies.rectangle(310, 150, 620, 2, {
  //패배조건 설정할 때 이 객체를 쓸 수 있도록 이름 지정
  name: "topLine",
  isStatic: true,
  // 과일이 부딫히지않고 감지만 하도록
  isSensor: true,
  render: {fillStyle: "#E6B143"}
})

//월드에 추가를 해야 보임
World.add(world, [leftWall, rightWall, groundWall, topLine]);

// 렌더 실행, 러너로 엔진 실행
Render.run(render);
Runner.run(engine);

//객체 변수 재사용을 위해 전역변수 설정
let currentBody = null;
let currentFruit = null;
// 과일 떨어지는 중 조작 못하도록
let disableAction = false;
// 좌우로 부드럽게 조작하기 위한 변수 설정
let interval = null;
// 승리조건
let num_suika = 0;

// 과일을 생성하는 함수 생성
function addFruit() {
  //index 번호로 과일 분류.. 과일 랜덤생성을 위해 index 난수 설정
  const index = Math.floor(Math.random() * 5);
  
  //과일 객체 생성
  const fruit = FRUITS_BASE[index];

  //동그라미 생성, 생성할 위치 설정
  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    //준비 중 상태로 생성
    isSleeping: true,
    render: {
      //가져올 텍스쳐 파일 설정
      sprite: {texture: `${fruit.name}.png`}
    },
    // 과일 객체의 탄성 값 설정
    restitution: 0.3,
  });

  currentBody=body;
  currentFruit=fruit;

  World.add(world, body);
}

//키보드 입력으로 좌우 이동 함수 설정
window.onkeydown = (event) => {
  //액션중이 아닐때만 실행되도록
  if(disableAction) {
    return;
  }
  switch (event.code) {
    case "KeyA":
      //계속실행되지않도록 실행중 판단조건 추가
      if(interval)
        return;
      // 5ms 마다 주기적으로 실행되도록 만듦.  예약해서 실행
      interval = setInterval(() => {
        //만약 현재 위치가 벽을 넘으면 안되도록
        if(currentBody.position.x - currentFruit.radius > 30)
        Body.setPosition(currentBody, {
          x: currentBody.position.x - 2,
          y: currentBody.position.y,
      });
      }, 5);

      break;
    
    case "KeyD":
      if(interval)
        return;
      interval = setInterval(() => {
        if(currentBody.position.x + currentFruit.radius < 590)
        Body.setPosition(currentBody, {
          x: currentBody.position.x + 2,
          y: currentBody.position.y,
      });
      }, 5);
      
      break;

    case "KeyS":
      // 비활성화 풀기
      currentBody.isSleeping = false;
      disableAction = true;

      // 무한생성 안되도록 딜레이 설정
      setTimeout(() => {
        //떨어트린 후 과일 재생성
        addFruit();
        disableAction = false;
      }, 700);
      break;
  }
}

//좌우 조작 중 한번만 눌려도 반복되지 않도록 손가락을 떼게 되면 interval 을 null로 초기화
window.onkeyup = (event) => {
  switch(event.code) {
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = null;
  }
}

// 충돌할 경우 합쳐지도록 Event 생성
Events.on(engine, "collisionStart", (event) => {
  //충돌 이벤트가 발생한 쌍 bodyA, bodyB가 같다면
  event.pairs.forEach((collision) => {
    if(collision.bodyA.index === collision.bodyB.index) {
      //상위 과일을 생성하기 위한 index 저장, 수박이면 못합치게 if문
      const index = collision.bodyA.index;
      if(index === FRUITS_BASE.length - 1) {
        return;
      }
      World.remove(world, [collision.bodyA, collision.bodyB]);

      //상위 과일 생성
      const newFruit = FRUITS_BASE[index + 1];
      const newBody = Bodies.circle(
        // 생성될 좌표 설정
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: {texture: `${newFruit.name}.png`}
          },
          index: index + 1,
        }
      );

      //world에 생성한 과일 추가
      World.add(world, newBody);

      if(newFruit.index === FRUITS_BASE.length) {
        num_suika++;
        if(num_suika === 2)
        alert("Game Complete")
      }
        
        
    }

    //패배 조건 설정, 과일이 윗벽과 충돌할 때. 그리고 내려가는게 아니고 위로 올라온 것일 때
    if(!disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")      )
      alert("Game Over")
  })
});

addFruit();