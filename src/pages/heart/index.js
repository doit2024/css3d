import 'normalize.css'
import './index.less'

/**
x=16 * (sin(t)) ^ 3
y=13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)
 */

const { PI, sin, cos, pow } = Math

const num = 50

document.querySelector('.heart').innerHTML = Array.apply(null, Array(num))
  .map((v, i) => PI * 2 * i / num)
  .map(t => [16 * (pow(sin(t), 3)), 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)])
  .map(([x, y]) => [10 * x, 10 * y])
  .map(([x, y]) => [300 + x, 300 - y])
  .map(([x, y], i) => `<i style="left:${x}px;top:${y}px;animation: rotate 0.3s ${i/10}s infinite alternate;"></i>`)
  .join('')
