const canvas = document.getElementById('gameCanvas')
const c = canvas.getContext("2d")

// set canvas dimensions
canvas.width = 1024
canvas.height = 576

const gravity = .5

class Player{
	constructor(){

		// declare and initialize player movement speed
		this.speed = 5

		// declare and initialize Starting Positon
		this.position = {
			x:100,
			y:100
		}

		// declare and initialize velocity
		this.velocity = {
			x:0,
			y:0
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
	}
}

class Platform{
	constructor({x,y, image}){

		// declare and initialize Starting Positon
		this.position = {
			x,
			y
		}

		// declare and initialize Dimensions and image
		this.image = image
		this.width = image.width
		this.height = image.height
	}

	draw(){		

		// Draw platform
		c.drawImage(this.image,this.position.x,this.position.y)
	}
}

class GenericObject{
	constructor({x,y, image}){

		// declare and initialize Starting Positon
		this.position = {
			x,
			y
		}

		// declare and initialize Dimensions and image
		this.image = image
		this.width = image.width
		this.height = image.height
	}

	draw(){		

		// Draw platform
		c.drawImage(this.image,this.position.x,this.position.y)
	}
}

function CreateImage(imageSrc)
{
	const image = new Image()
	image.src = imageSrc
	return image
}

// Set platform image
let platformImage = CreateImage('./img/platform.png')

// Set platformSmallTall image
let platformSmallTallImage = CreateImage('./img/platformSmallTall.png')

// Create New Player
let player = new Player()

// Create New Platforms
let platforms = []

// Create New GenericObjects
let genericObjects = []

// Create key Array with Properties
let keys = {
	right:{
		pressed: false
	},
	left:{
		pressed: false
	}
}

let scrollOffset = 0

function init()
{
	// Create New Player
	player = new Player()

	// Create New Platforms
	platforms = [
	new Platform({x: platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width , y: 270, image: platformSmallTallImage}),
	new Platform({x: -1, y: 470, image: platformImage}),
	new Platform({x: platformImage.width -3 , y: 470, image: platformImage}),
	new Platform({x: platformImage.width * 2 + 100 , y: 470, image: platformImage}),
	new Platform({x: platformImage.width * 3 + 300 , y: 470, image: platformImage}),
	new Platform({x: platformImage.width * 4 + 300 - 2 , y: 470, image: platformImage}),
	new Platform({x: platformImage.width * 5 + 600 - 2 , y: 470, image: platformImage})
	]

	genericObjects = [
	new GenericObject({ x: -1, y: -1, image: CreateImage('./img/background.png')}),
	new GenericObject({ x: -1, y: -1, image: CreateImage('./img/hills.png')})
	]

	// Create key Array with Properties
	keys = {
		right:{
			pressed: false
		},
		left:{
			pressed: false
		}
	}

	scrollOffset = 0
}

// recursive loop method to change player and platform properties over time
function animate(){
	requestAnimationFrame(animate)
	c.fillStyle = 'white'
	c.fillRect(0,0,canvas.width,canvas.height)

	genericObjects.forEach(genericObject => {
		genericObject.draw()
	})

	// Update platform positions
	platforms.forEach(platform =>{
		platform.draw()
	})

	// Update player position
	player.update()

	// Move player if player is within bounds
	if(keys.right.pressed && player.position.x < canvas.width / 2){
		player.velocity.x = player.speed
	}
	else if((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)){
		player.velocity.x = -player.speed
	}
	else
	{
		player.velocity.x = 0

		// Move All platforms and genericObjects to imply a parallax scrolling effect
		if(keys.right.pressed)
		{
			scrollOffset += player.speed
			platforms.forEach(platform =>{
				platform.position.x -= player.speed
			})
			genericObjects.forEach(genericObjects => {
				genericObjects.position.x -= player.speed * .66
			})
		}
		else if(keys.left.pressed && scrollOffset > 0)
		{
			scrollOffset -= player.speed
			platforms.forEach(platform =>{
				platform.position.x += player.speed
			})
			genericObjects.forEach(genericObjects => {
				genericObjects.position.x += player.speed * .66
			})
		}
	}

	// Collision detection for all platformss
	platforms.forEach(platform =>{
		if(player.position.y + player.height <= platform.position.y 
			&& player.position.y + player.height + player.velocity.y >= platform.position.y 
			&& player.position.x + player.width >= platform.position.x
			&& player.position.x <= platform.position.x + platform.width
		)
		{
			player.velocity.y = 0
		}
	})

	// Win Condition
	if(scrollOffset > platformImage.width * 5 + 600 - 2)
	{
		console.log('You Win!!!')
	}

	// Lose Condition
	if (player.position.y > canvas.height)
	{
		init()
	}
}

init()
animate()

// Add Event Listener for Key press
addEventListener('keydown',(event) => {
	switch(event.key){
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
		// Up
		case 'w':
			console.log('Up Pressed')
			player.velocity.y -= 17.5
		break
	}
})

// Add Event Listener for Key release
addEventListener('keyup',(event) => {
	switch(event.key){
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
		// Up
		case 'w':
			console.log('Up Released')
		break
	}
})