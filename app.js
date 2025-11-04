

document.addEventListener('DOMContentLoaded' , () => {// saying wait till all of the HTML page is loaded befor starting the code
    const grid = document.getElementById('grid')
    const scoreDisplay = document.getElementById('score')
    const levelDisplay = document.getElementById('level')
    const enemyDisplay = document.getElementById('enemy')

    const width = 10
    const tileSize = 48


    const squares = []
    let score = 0
    let level = 0
    let playerPosition = 40
    let eneimes = []
    let playerDirection = 'right'
    let gameRunning = true

    // y,w,x,z = corner walls | a,b = side wallls | c,d = top/bottom walls
    // ) = lanterns | ( = fire pots | % = left door | ^ = top door | $ = stairs
    // * = slicer enemy | } = skeletor enemy | (space) = empty walkable area 
    const maps = [
        // level 1 layout
        [
            'ycc)cc^ccw',
            'a        b',
            'a      * b',
            'a    (   b',
            '%        b',
            'a    (   b',
            'a  *     b',
            'a        b',
            'xdd)dd)ddz'
        ],
        // level 2 layout
        [
           'yccccccccw',
            'a        b',
            ')        )',
            'a        b',
            'a        b',
            'a    $   b',
            ')   }    )',
            'a        b',
            'xddddddddz',
        ]
        
    ]

    function createBoard(){
        const currentMap = maps[level]

        for(let i = 0; i < 9; i++){
            for(let j = 0 ; j < 10 ; j++){
                const square = document.createElement('div')
                square.setAttribute('id' , i * width + j)

                const char = currentMap[i][j]
                addMapElemnt(square , char , j, i)

                grid.appendChild(square)
                squares.push(square)
            }
        }
        createPlayer()
    }
    createBoard()

    console.log(squares)

    function addMapElemnt(square , char, x , y){
        switch(char){
            case 'a':
                square.classList.add('left-wall')
                break
            case 'b':
                square.classList.add('right-wall')
                break
            case 'c':
                square.classList.add('top-wall')
                break
            case 'd':
                square.classList.add('bottom-wall')
                break
            case 'w':
                square.classList.add('top-right-wall')
                break
            case 'x':
                square.classList.add('bottom-left-wall')
                break
            case 'y':
                square.classList.add('top-left-wall')
                break
            case 'z':
                square.classList.add('bottom-right-wall')
                break
            case '%':
                square.classList.add('left-door')
                break
            case '^':
                square.classList.add('top-door')
                break
            case '$':
                square.classList.add('stairs')
                break
            case ')':
                square.classList.add('lanterns')
                break
            case '(':
                square.classList.add('fire-pot')
                break
            case '*':
                createSlicer(x,y)
                break
            case '}':
                createSkeletor(x,y)
                break
        }
    }

    function createPlayer(){
        const playerElement = document.createElement('div')
        playerElement.classList.add('link-going-right')
        playerElement.id = 'player'

        playerElement.style.left = `${(playerPosition % width) * tileSize}px`
        playerElement.style.top = `${Math.floor(playerPosition / width) * tileSize}px`

        grid.appendChild(playerElement)

    }


    function createSlicer(x,y){
        const slicerElement = document.createElement('div')
        slicerElement.classList.add('slicer')
        slicerElement.style.left = `${x * tileSize}px`
        slicerElement.style.top = `${y * tileSize}px`

        const slicer = {
            x,
            y,
            direction: -1,
            type: 'slicer',
            element: slicerElement

        }

        eneimes.push(slicer)
        grid.appendChild(slicerElement)
     }



     function createSkeletor(x,y){
        const skeletorElement = document.createElement('div')
        skeletorElement.classList.add('skeletor')
        skeletorElement.style.left = `${x * tileSize}px`
        skeletorElement.style.top = `${y * tileSize}px`

        skeletor = {
            x,y,
            direction: -1,
            timer: Math.random() * 5,
            type: 'skeletor',
            element: skeletorElement

        }

        eneimes.push(skeletor)
        grid.appendChild(skeletorElement)
     }



     function movePlayer(direction){
        const playerElement = document.getElementById('player')
        let newPosition = playerPosition

        switch(direction){
            case 'left':
                if(playerPosition % width !==0) newPosition = playerPosition -1
                playerElement.className = 'link-going-left'
                playerDirection = 'left'
                break

            case 'right':
                if(playerPosition % width !== width -1) newPosition = playerPosition +1
                playerElement.className = 'link-going-right'
                playerDirection = 'right'
                break

            case 'up':
                if(playerPosition - width >= 0) newPosition = playerPosition - width
                playerElement.className = 'link-going-up'
                playerDirection = 'up'
                break

            case 'down':
                if(playerPosition + width < width * 9) newPosition = playerPosition + width
                playerElement.className = 'link-going-down'
                playerDirection = 'down'
                break
        }

        if(canMoveTo(newPosition)){
            const square = squares[newPosition]

            if(square.classList.contains('left-door')){
                square.classList.remove('left-door')
            }

             if(square.classList.contains('top-door') || square.classList.contains('stairs') ){
                if(eneimes.length === 0){
                    nextLevel()
                } else{
                     showEnemiesRemainingMessage()
                }
                return
            }
            playerPosition = newPosition
            playerElement.style.left = `${(playerPosition % width) * tileSize}px`// if we can move then move player
            playerElement.style.top = `${Math.floor(playerPosition / width) * tileSize}px`


        }

       

     }

     function canMoveTo(position){
        if(position < 0 || position >= squares.length) return false

        const square = squares[position]

        return !square.classList.contains('left-wall') &&
                !square.classList.contains('right-wall') &&
                !square.classList.contains('top-wall') &&
                !square.classList.contains('bottom-wall') &&
                !square.classList.contains('top-left-wall') &&
                !square.classList.contains('top-right-wall') &&
                !square.classList.contains('bottom-left-wall') &&
                !square.classList.contains('bottom-right-wall') &&
                !square.classList.contains('lanterns') &&
                !square.classList.contains('fire-pot') 

     }


     function spawnkaboom(){
        let kaboomX = playerPosition % width
        let kaboomY = Math.floor(playerPosition / width)

        switch(playerDirection){
            case 'left':
                kaboomX -= 1
                break
            case 'right':
                kaboomX += 1
                break
            case 'up':
                kaboomY -= 1
                break
            case 'down':
                kaboomY += 1
                break
        }


        if(kaboomX >= 0 && kaboomX < width && kaboomY >= 0 && kaboomY < 9){
            const kaboomElemnt = document.createElement('div')
            kaboomElemnt.className = 'kaboom'
            kaboomElemnt.style.left = `${kaboomX * tileSize}px`
            kaboomElemnt.style.top = `${kaboomY * tileSize}px`

            grid.appendChild(kaboomElemnt)

            checkKaboomEnemyCollision(kaboomX, kaboomY)


            setTimeout(() =>{
                if(kaboomElemnt.parentNode){
                    kaboomElemnt.parentNode.removeChild(kaboomElemnt)
                }
            }, 1000)
        }
     }

     function checkKaboomEnemyCollision(){
        for(let i = eneimes.length - 1; i >= 0 ; i--){
            const enemy = eneimes[i]
            const enemyX = Math.round(enemy.x)
            const enemyY = Math.round(enemy.y)

            if(enemyX === kaboomX && enemyY === kaboomY){
                if(enemy.element.parentNode){
                    enemy.element.parentNode.removeChild(enemy.element)
                }
            }
            eneimes.splice(i, 1)
            score++
            updateDisplay()
            break
        }

     }


















     function nextLevel(){
        level = (level + 1) % maps.length //repeat maps
        createBoard()
     }


     function showEnemiesRemainingMessage(){
        grid.style.filter = 'hue-rotate(0deg) saturate(2) brightness(1.5)'
        grid.style.boxShadow = ' 0 0 20px red'

        setTimeout(() => {
            grid.style.filter = 'hue-rotate(0deg) saturate(2) brightness(1.5)'
            grid.style.boxShadow = ' 0 0 20px red'
            
        }, 300)

        showTemporaryMessage('Defeat all enemies first!', 'red', 2000)
     }


     function showTemporaryMessage(message , color , duration){
        const existingMessage = document.getElementById('temp-message')
        if(existingMessage) existingMessage.remove()

        const messageElement = document.createElement('div')
        messageElement.id = 'temp-message'
        messageElement.textContent = message
        messageElement.style.color = color
        grid.appendChild(messageElement)

        setTimeout(() => {
            if(messageElement.parentNode){
                messageElement.remove()
            }
        }, duration)


     }











     document.addEventListener('keydown' , (e) => {
        if(!gameRunning) return 

        switch(e.code){
            case 'ArrowLeft':
                e.preventDefault()
                movePlayer('left')
                break

            case 'ArrowRight':
                e.preventDefault()
                movePlayer('right')
                break

            case 'ArrowUp':
                e.preventDefault()
                movePlayer('up')
                break

            case 'ArrowDown':
                e.preventDefault()
                movePlayer('down')
                break

            case 'Space':
                e.preventDefault()
                // spawnkaboom()
                break
        }
     })












})