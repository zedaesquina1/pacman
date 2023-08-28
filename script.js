const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')
console.log(scoreEl)

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position, image}){
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() {
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }

    update() {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
}

class Ghost {
  static speed = 2
  constructor({position, velocity, color = 'red'}) {
      this.position = position
      this.velocity = velocity
      this.radius = 15
      this.color = color
      this.prevCollisions = []
      this.speed = 2
    }

  draw() {
      c.beginPath()
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
      c.fillStyle = this.color
      c.fill()
      c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Pellet {
    constructor({position}) {
        this.position = position
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}



const pellets = []
const boundaries = []
const ghosts = [
  new Ghost ({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    }
  }),
  new Ghost ({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    color: 'pink'
  }),
]
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d : {
        pressed: false
    }
}

let lastKey = ''
let score = 0

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]

  function createImage(src) {
    const image = new Image()
    image.src = src
    return image
  }

map.forEach((row, i)  => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeHorizontal.png')
              })
              )
            break
            case '|':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeVertical.png')
              })
              )
            break
            case '1':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeCorner1.png')
              })
              )
            break
            case '2':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeCorner2.png')
              })
              )
            break
            case '3':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeCorner3.png')
              })
              )
            break
            case '4':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeCorner4.png')
              })
              )
            break
            case 'b':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/block.png')
              })
              )
            break
            case '[':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/capLeft.png')
              })
              )
            break
            case ']':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/capRight.png')
              })
              )
            break
            case '_':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/capBottom.png')
              })
              )
            break
            case '^':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/capTop.png')
              })
              )
            break
            case '+':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeCross.png')
              })
              )
            break
            case '5':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeConnectorTop.png')
              })
              )
            break
            case '6':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeConnectorRight.png')
              })
              )
            break
            case '7':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeConnectorBottom.png')
              })
              )
            break
            case '8':
              boundaries.push(new Boundary({
                position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeConnectorLeft.png')
              })
              )
            break
            case '.':
              pellets.push(new Pellet({
                position: {
                    x: j * Boundary.width + Boundary.width / 2,
                    y: i * Boundary.height + Boundary.height / 2 
                },
                image: createImage('./img/pipeConnectorLeft.png')
              })
              )
            break
        }
    })

})

function circleCollidesWithRectangle({
    circle,
    rectangle

}) {
const padding = Boundary.width /2 - circle.radius - 1
return (circle.position.y - circle.radius + circle.velocity.y <=
    rectangle.position.y + rectangle.height + padding &&
   circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
   circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
   circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)

}

let animateId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if (
            circleCollidesWithRectangle({
            circle: {...player, velocity: {
                x: 0,
                y: -5
            }},
            rectangle: boundary
        })) {
            player.velocity.y = 0
            break
        } else {
            player.velocity.y = -5
        }
    }
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if (
            circleCollidesWithRectangle({
            circle: {...player, velocity: {
                x: -5,
                y: 0
            }},
            rectangle: boundary
        })) {
            player.velocity.x = 0
            break
        } else {
            player.velocity.x = -5
        }
    }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if (
            circleCollidesWithRectangle({
            circle: {...player, velocity: {
                x: 0,
                y: 5
            }},
            rectangle: boundary
        })) {
            player.velocity.y = 0
            break
        } else {
            player.velocity.y = 5
        }
    }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if (
            circleCollidesWithRectangle({
            circle: {...player, velocity: {
                x: 5,
                y: 0
            }},
            rectangle: boundary
        })) {
            player.velocity.x = 0
            break
        } else {
            player.velocity.x = 5
        }
    }
    } 

    //touch pellets here
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const Pellet = pellets[i]
        Pellet.draw()

        if (Math.hypot(Pellet.position.x - player.position.x, Pellet.position.y - player.position.y) < Pellet.radius + player.radius) {
            pellets.splice(i, 1)
            score += 10
            scoreEl.innerHTML = score
        }
    }


    boundaries.forEach(boundary => {
        boundary.draw()

        if (
            circleCollidesWithRectangle({
                circle: player,
                rectangle: boundary
            })
            ) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })     
    player.update()
   
    ghosts.forEach(ghost => {
      ghost.update() 

      if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius) {
      cancelAnimationFrame(animationId)
      console.log('you lose')
      }
      const Collisions = []
      boundaries.forEach(boundary => {
        if (
          !Collisions.includes('right') &&
          circleCollidesWithRectangle({
          circle: {...ghost, velocity: {
              x: ghost.speed,
              y: 0
          }},
          rectangle: boundary
      })
      ) {
        Collisions.push('right')
      } 
      
      if (
        !Collisions.includes('left') &&
        circleCollidesWithRectangle({
        circle: {...ghost, velocity: {
            x: -ghost.speed,
            y: 0
        }},
        rectangle: boundary
    })
    ) {
      Collisions.push('left')
    }
    
    if (
      !Collisions.includes('up') &&
      circleCollidesWithRectangle({
      circle: {...ghost, velocity: {
          x: 0,
          y: -ghost.speed
      }},
      rectangle: boundary
  })
  ) {
    Collisions.push('up')
  }

  if (
    !Collisions.includes('down') &&
      circleCollidesWithRectangle({
      circle: {...ghost, velocity: {
          x: 0,
          y: ghost.speed
      }},
      rectangle: boundary
  })
  ) {
    Collisions.push('down')
  }
      })

      if (Collisions.length > ghost.prevCollisions.length)
      ghost.prevCollisions = Collisions

      if (JSON.stringify(Collisions) !== JSON.stringify(ghost.prevCollisions)) {
        // console.log('gogo')

        if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
        else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
        else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
        else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

        console.log(Collisions)
        console.log(ghost.prevCollisions)

        const pathways = ghost.prevCollisions.filter(Collision => {
          return !Collisions.includes(Collision)
        })
        console.log({ pathways })

        const direction = pathways[Math.floor(Math.random() * pathways.length)]

        console.log({ direction })

        switch (direction) {
          case 'down':
            ghost.velocity.y = ghost.speed
            ghost.velocity.x = 0
            break
          case 'up':
            ghost.velocity.y = -ghost.speed
            ghost.velocity.x = 0
            break
          case 'right':
            ghost.velocity.y = 0
            ghost.velocity.x = ghost.speed
            break
          case 'left':
            ghost.velocity.y = 0
            ghost.velocity.x = -ghost.speed
            break
        }

        ghost.prevCollisions = []
      }
      // console.log(collisions)
    })
}

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
      case 'w':
        keys.w.pressed = true
        lastKey = 'w'
        break
      case 'a':
        keys.a.pressed = true
        lastKey = 'a'
        break
      case 's':
        keys.s.pressed = true
        lastKey = 's'
        break
      case 'd':
        keys.d.pressed = true
        lastKey = 'd'
        break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
      case 'w':
        keys.w.pressed = false

        break
      case 'a':
        keys.a.pressed = false

        break
      case 's':
        keys.s.pressed = false

        break
      case 'd':
        keys.d.pressed = false

        break
    }
})