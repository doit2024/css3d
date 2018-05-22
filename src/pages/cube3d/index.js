import $ from 'jquery'
const { tan, PI, atan, max, min, pow, sqrt } = Math

//禁用微信的下拉
$('body').on('touchmove', e => e.preventDefault())

const BG_WIDTH = 3000
const BG_HEIGHT = 3000
const BG_NUMBER = 4
const PER_ANGLE = 360 / BG_NUMBER

const translateZ = (({width, number}) => (width/tan(PI/number)) >> 1)({
  width: BG_WIDTH,
  number: BG_NUMBER
})

const view = $("#stage")
const viewW = view.width()
const viewH = view.height()

const walls = require.context('./image', true, /[0-3]\.jpg$/)
const wall = walls.keys().map((item, i) => `<div style="
  background: url(${walls(item)}) 0 0/cover no-repeat;
  position: absolute;
  width: ${BG_WIDTH}px;
  height: ${BG_HEIGHT}px;
  left: ${(viewW - BG_WIDTH) / 2}px;
  top: ${(viewH - BG_HEIGHT) / 2}px;
  transform: rotateY(${180 - i * PER_ANGLE}deg) translateZ(${-translateZ +10}px)
"></div>`).join('')

const skyAndGround = require.context('./image', true, /[4-5]\.jpg$/)
const sg =skyAndGround.keys().map((item, i) => `<div style="
  background: url(${skyAndGround(item)}) 0 0/cover no-repeat;
  position: absolute;
  width: ${BG_WIDTH}px;
  height: ${BG_HEIGHT}px;
  left: ${(viewW - BG_WIDTH) / 2}px;
  top: ${(viewH - BG_HEIGHT) / 2}px;
  transform: rotateX(${(i ? 1: -1) * 90}deg) rotateZ(90deg) translateZ(${-translateZ+10}px)
"></div>`).join('')

$('.cube').html(wall + sg)

let lastMouseX = 0
let lastMouseY = 0
let curMouseX = 0
let curMouseY = 0
let lastAngleX = 0
let lastAngleY = 0
let frameTimer = null
let timeoutTimer= null
let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
  function(callback) {
    setTimeout(callback, 1000 / 60)
  }

$(document).on("mousedown touchstart", mouseDownHandler)
$(document).on("mouseup touchend", mouseUpHandler)

function mouseDownHandler(evt) {
  // 由于移动设备支持多指触摸，因此与PC的鼠标不同，返回是一数组touches。
  lastMouseX = evt.pageX || evt.touches[0].pageX;
  lastMouseY = evt.pageY || evt.touches[0].pageY;
  lastAngleX = aimAngleX;
  lastAngleY = aimAngleY;
  curMouseX = evt.pageX || evt.touches[0].pageX;
  curMouseY = evt.pageY || evt.touches[0].pageY;

  clearTimeout(timeoutTimer)

  $(document).on("mousemove touchmove", mouseMoveHandler)
  window.cancelAnimationFrame(frameTimer)
  frameTimer = requestAnimationFrame(go)
}

function mouseMoveHandler(evt) {
  curMouseX = evt.pageX || evt.touches[0].pageX;
  curMouseY = evt.pageY || evt.touches[0].pageY;

  dragRotate({
    pageX: curMouseX,
    pageY: curMouseY
  })
}

function mouseUpHandler() {
  $(document).unbind("mousemove touchmove")
  timeoutTimer = setTimeout(() => window.cancelAnimationFrame(frameTimer), 2500)
}

let aimAngleX = 0
let aimAngleY = 0
let curBgAngleX = 0
let curBgAngleY = 0
function dragRotate() {
  // 注意：rotateX(Y) 与 鼠标（触摸）的X（Y）轴是交叉对应的
  // aimAngleX(Y)的值是通过【拖拽位移换算为相应角度得到】
  aimAngleX = ( 180 / PI * (atan((curMouseX - lastMouseX) / translateZ)) + lastAngleX )
  // 限制上下旋转监督在30°以内
  aimAngleY = max(-60, min((180 / PI * atan((curMouseY - lastMouseY) / (sqrt(pow(BG_HEIGHT / 2, 2) + pow(translateZ, 2))*1.5)) + lastAngleY), 60))
}

function go() {
  curBgAngleX += (aimAngleX - curBgAngleX) * 0.5;
  curBgAngleY += (aimAngleY - curBgAngleY) * 0.5;
  $("#stage").css({ transform: `rotateX(${curBgAngleY}deg) rotateY(${-curBgAngleX}deg) rotateZ(0)` })
  frameTimer = requestAnimationFrame(go);
}
