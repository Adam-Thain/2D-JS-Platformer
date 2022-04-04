const canvas = document.querySelector('canvas')
const c = canvas.getContext("2d")

// set canvas dimensions
canvas.width = 1024
canvas.height = 576

const gravity = 0.5

class Player{
	constructor(){

		// declare and initialize Starting Positon
		this.position = {
			x:100,
			y:100
		}

		// declare and initialize velocity
		this.velocity = {
			x:0,
			y:1
		}

		// declare and initialize Dimensions
		this.width = 30
		this.height = 30
	}
	draw(){

		// Set Colour
		c.fillStyle = 'red'

		// Set position and dimensions
		c.fillRect(this.position.x,this.position.y,this.width,this.height)

	}
	update(){
		this.draw()	

		// Update X and Y Positions
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		// Allow Gravity within Screen Dimensions
		if(this.position.y + this.height + this.velocity.y <= canvas.height)
		{
			this.velocity.y += gravity
		}
		else
		{
			this.velocity.y = 0
		}
	}
}

class Platform{
	constructor({x,y}){
		// declare and initialize Starting Positon
		this.position = {
			x,
			y
		}

		// declare and initialize Dimensions
		this.image = image
		this.width = image.width
		this.height = image.height
	}

	draw(){		

		// Draw platform
		c.drawImage(this.image,this.position.x,this.position.y)
	}
}

const image = new Image()
image.src = './img/platform.png'

console.log(image)

// Create New Player
const player = new Player()

// Create New Platforms
const platforms = [
	new Platform({x:-1,y:470,image: image}),
	new Platform({x:500,y:200,image: image})
]

// Create key Array with Properties
const keys = {
	right:{
		pressed: false
	},
	left:{
		pressed: false
	}
}

let scrollOffset = 0

// recursive loop method to change player and platform properties over time
function animate(){
	requestAnimationFrame(animate)
	c.fillStyle = 'white'
	c.fillRect(0,0,canvas.width,canvas.height)

	// Update platform positions
	platforms.forEach(platform =>{
		platform.draw()
	})

	// Update player position
	player.update()

	// Move player if player is within bounds
	if(keys.right.pressed && player.position.x < 400){
		player.velocity.x = 5
	}
	else if(keys.left.pressed && player.position.x > 100){
		player.velocity.x = -5
	}
	else
	{
		player.velocity.x = 0

		// Move All platforms
		if(keys.right.pressed)
		{
			scrollOffset += 5
			platforms.forEach(platform =>{
				platform.position.x -= 5
			})
		}
		else if(keys.left.pressed)
		{
			scrollOffset -= 5
			platforms.forEach(platform =>{
				platform.position.x += 5
			})
		}
	}

	// Collision detection for all platformss
	platforms.forEach(platform =>{
		if(player.position.y + player.height <= platform.position.y 
			&& player.position.y + player.height + player.velocity.y >= platform.position.y 
			&& player.position.x + player.width >= platform.position.x
			&& player.position.x <= platform.position.x + platform.width){
			player.velocity.y = 0
		}
	})

	if(scrollOffset > 2000)
	{
		console.log('You Win!!!')
	}
}

animate()

// Add Event Listener for Key press
addEventListener('keydown',(event) => {
	switch(event.key){
		// Up
		case 'w':
			console.log('Up Pressed')
			player.velocity.y -= 20
		break
		// Left 
		case 'a':
			console.log('Left Pressed')
			keys.left.pressed = true

		break
		// Down
		case 's':
			console.log('Down Pressed')
		break
		// Right
		case 'd':
			console.log('Right Pressed')
			keys.right.pressed = true
		break
	}
})

// Add Event Listener for Key release
addEventListener('keyup',(event) => {
	switch(event.key){
		// Up
		case 'w':
			console.log('Up Released')
		break
		// Left 
		case 'a':
			console.log('Left Released')
			keys.left.pressed = false
		break
		// Down
		case 's':
			console.log('Down Released')
		break
		// Right
		case 'd':
			console.log('Right Released')
			keys.right.pressed = false
		break
	}
})