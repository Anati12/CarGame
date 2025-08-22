// ===== States =====
class MachineComponent { request(){} }
class CompositeMachine extends MachineComponent {
  constructor(){ super(); this.children=[]; }
  add(c){ this.children.push(c); }
  request(){ this.children.forEach(c=>c.request()); }
}

// Traffic Light
class TrafficLight extends MachineComponent {
  constructor(state){ super(); this.state=state; }
  setState(s){ this.state=s; }
  request(){ this.state.handle(this); }
}
class LightState { handle(ctx){} }
class GreenState extends LightState {
  handle(ctx){ turnOn("green"); 
    document.getElementById("lightStatus").innerText="Go";
    document.getElementById("trafficNote").innerText="Go!";
    ctx.setState(new YellowState());
    trafficColor="green";
  }
}
class YellowState extends LightState {
  handle(ctx){ turnOn("yellow"); 
    document.getElementById("lightStatus").innerText="Ready";
    document.getElementById("trafficNote").innerText="Slow!";
    ctx.setState(new RedState());
    trafficColor="yellow";
  }
}
class RedState extends LightState {
  handle(ctx){ turnOn("red"); 
    document.getElementById("lightStatus").innerText="STOP";
    document.getElementById("trafficNote").innerText="Stop!";
    ctx.setState(new GreenState());
    trafficColor="red";
    car.setState(new ParkState()); // auto stop
  }
}
function turnOn(c){
  ["red","yellow","green"].forEach(x=>document.getElementById(x).classList.remove("on"));
  document.getElementById(c).classList.add("on");
}

// Car states
class Car extends MachineComponent {
  constructor(state){ super(); this.state=state; }
  setState(s){ this.state=s; this.request(); }
  request(){ this.state.handle(this); }
}
class CarState { handle(ctx){} }
class ParkState extends CarState { handle(ctx){ carSpeed=0; updateCar("Parked",0); } }
class ReverseState extends CarState { handle(ctx){ carSpeed=-20; updateCar("Reverse",20); } }
class NeutralState extends CarState { handle(ctx){ carSpeed=0; updateCar("Neutral",0); } }
class DriveState extends CarState {
  constructor(gear){ super(); this.gear=gear; }
  handle(ctx){
    if(this.gear===1){ carSpeed=20; updateCar("Drive G1",20); }
    else if(this.gear===2){ carSpeed=40; updateCar("Drive G2",40); }
    else if(this.gear===3){ carSpeed=60; updateCar("Drive G3",60); }
    else if(this.gear===4){ carSpeed=80; updateCar("Drive G4",80); }
    else if(this.gear===5){ carSpeed=100; updateCar("Drive G5",120); }
  }
}



// Setup
const composite=new CompositeMachine();
const light=new TrafficLight(new GreenState());
const car=new Car(new ParkState());
composite.add(light); composite.add(car);

let trafficColor="green", carSpeed=0;
let carX=50, carY=400;
const carEl=document.getElementById("car");

// Light cycle
setInterval(()=>light.request(),10000);

// Move car
function gameLoop(){
  if(trafficColor==="red" && carSpeed>0) return; 
  carY -= carSpeed/50; // forward
  if(carSpeed<0) carY -= carSpeed/50; // backward (negative)
  
  // Apply boundaries
  if(carY<50) carY=50;
  if(carY>500) carY=500;
  
  carEl.style.left=carX+"%";
  carEl.style.top=carY+"px";
}
setInterval(gameLoop,50);

// Update UI
function updateCar(status,speed){
  document.getElementById("carStatus").innerText=status;
  document.getElementById("speedValue").innerText=speed;
}

// Steering with arrow keys
/*document.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowLeft") carX-=3;
  if(e.key==="ArrowRight") carX+=3;
  if(carX<5) carX=5;
  if(carX>85) carX=85;
  carEl.style.left=carX+"%";
  carEl.style.transform = "translateX(-50%) rotate(90deg)"; // keep facing up
});*/

  // Steering
  function moveLeft(){
    carX -= 3; if(carX<5) carX=5;
    carEl.style.left=carX+"%";
    carEl.style.transform="translateX(-50%) rotate(-90deg)";
  }
  function moveRight(){
    carX += 3; if(carX>85) carX=85;
    carEl.style.left=carX+"%";
    carEl.style.transform="translateX(-50%) rotate(-90deg)";
  }

  document.addEventListener("keydown",(e)=>{
    if(e.key==="ArrowLeft") moveLeft();
    if(e.key==="ArrowRight") moveRight();
  });
  document.getElementById("leftBtn").addEventListener("click", moveLeft);
  document.getElementById("rightBtn").addEventListener("click", moveRight);


// Init
light.request();
car.request();