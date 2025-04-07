let pets = []
const petsContainer = document.getElementById('petsContainer')
const createPetForm = document.getElementById('createPetForm')
const activityLogDiv = document.getElementById('activityLog')

//chatbubbla med meddelande
function showChatBubble(pet, message) {
  const petDiv = document.getElementById(pet.domId)
  let bubble = petDiv.querySelector('.chat-bubble')
  if (!bubble) {
    bubble = document.createElement('div')
    bubble.className = 'chat-bubble'
    petDiv.append(bubble)
  }
  bubble.textContent = message
  bubble.classList.add('show')
  setTimeout(() => {
    bubble.classList.remove('show')
  }, 3000)
}


class Pet {
  constructor(name, animalType) {
    this.name = name
    this.animalType = animalType
    this.energy = 50
    this.fullness = 50
    this.happiness = 50
    this.timer = null
    this.domId = ''
    this.startTimer()
  }

  //timer som sänker stats var 10e sek
  startTimer() {
    this.timer = setInterval(() => {
      this.energy = Math.max(this.energy - 15, 0)
      this.fullness = Math.max(this.fullness - 15, 0)
      this.happiness = Math.max(this.happiness - 15, 0)
      //uppdaterar värden
      updatePetDOM(this)
      //om värden är 0
      checkPetStatus(this)
    }, 10000)
  }

  //uppdaterar värden - mellan 0-100
  updateStats(energyChange, fullnessChange, happinessChange) {
    this.energy = Math.min(Math.max(this.energy + energyChange, 0), 100)
    this.fullness = Math.min(Math.max(this.fullness + fullnessChange, 0), 100)
    this.happiness = Math.min(Math.max(this.happiness + happinessChange, 0), 100)
  }


  //Uppdatera värden skriv ut i bubble, beroende på aktivitet

  nap() {
    this.updateStats(40, -10, -10)
    addLog('You took a nap with ' + this.name + '!')
    showChatBubble(this, 'Zzz..I really needed a rest')
  }

  play() {
    this.updateStats(-10, -10, 30)
    addLog('You played with ' + this.name + '!')
    showChatBubble(this, 'Yey, let\'s play!')
  }

  eat() {
    this.updateStats(-15, 30, 5)
    addLog('You fed ' + this.name + '!')
    showChatBubble(this, 'Mmm, yummy!')
  }

  stopTimer() {
    clearInterval(this.timer)
  }
}

//dölj journal
activityLogDiv.style.display = 'none'

//när vi skapar en bushbaby
createPetForm.addEventListener('submit', function (e) {
  e.preventDefault()
  if (pets.length >= 4) {
    alert('4 pet-pals is more than enough!')
    return
  }
  //hämtar namn och typ vi väljer i formuläret
  let petName = document.querySelector('#petName').value.trim()
  let petType = document.querySelector('#petType').value
  //namn måste väljas
  if (petName === '') return
  //skapa pet, visa i dom och rensa formulär
  const newPet = new Pet(petName, petType)
  pets.push(newPet)
  addPet(newPet)
  // Om vi skapar ett djur, visa journal
  if (pets.length === 1) {
    activityLogDiv.style.display = 'block'
  }
  createPetForm.reset()
})

function addPet(pet) {

  const petDiv = document.createElement('div')
  petDiv.className = 'pet-container'
  petDiv.id = pet.name + '-' + Date.now()

  const petContent = document.createElement('div')
  petContent.className = 'pet-content'
  petDiv.append(petContent)

  //visa bild beroende på vilket djur som valts
  const petImage = document.createElement('img')
  petImage.src = 'images/' + pet.animalType + '.png'
  petImage.alt = pet.animalType
  petContent.append(petImage)

  const petInfo = document.createElement('div')
  petInfo.className = 'pet-info'
  //visa namn och stats
  petInfo.innerHTML = `
    <strong>${pet.name}</strong><br>
    ⚡ Energy: <span class="energy-value">${pet.energy}</span> <progress class="energy" value="${pet.energy}" max="100"></progress>
    🍗 Fullness: <span class="fullness-value">${pet.fullness}</span> <progress class="fullness" value="${pet.fullness}" max="100"></progress>
    😊 Happiness: <span class="happiness-value">${pet.happiness}</span> <progress class="happiness" value="${pet.happiness}" max="100"></progress>
  `
  petContent.append(petInfo)

  //skapa knappar för play, eat, nap
  const actionButtons = document.createElement('div')
  actionButtons.className = 'action-buttons'

  const btnNap = document.createElement('button')
  btnNap.textContent = 'Nap'
  btnNap.addEventListener('click', function () {
    pet.nap()
    updatePetDOM(pet)
    checkPetStatus(pet)
  })
  actionButtons.append(btnNap)

  const btnPlay = document.createElement('button')
  btnPlay.textContent = 'Play'
  btnPlay.addEventListener('click', function () {
    pet.play()
    updatePetDOM(pet)
    checkPetStatus(pet)
  })
  actionButtons.append(btnPlay)

  const btnEat = document.createElement('button')
  btnEat.textContent = 'Eat'
  btnEat.addEventListener('click', function () {
    pet.eat()
    updatePetDOM(pet)
    checkPetStatus(pet)
  })
  actionButtons.append(btnEat)

  petContent.append(actionButtons)
  pet.domId = petDiv.id
  petsContainer.append(petDiv)
}

//uppdatera progressbar och värden
function updatePetDOM(pet) {
  const petDiv = document.getElementById(pet.domId)
  if (petDiv) {
    petDiv.querySelector('progress.energy').value = pet.energy
    petDiv.querySelector('span.energy-value').textContent = pet.energy
    petDiv.querySelector('progress.fullness').value = pet.fullness
    petDiv.querySelector('span.fullness-value').textContent = pet.fullness
    petDiv.querySelector('progress.happiness').value = pet.happiness
    petDiv.querySelector('span.happiness-value').textContent = pet.happiness
  }
}

//logga händelse med tid
function addLog(message) {
  const timestamp = new Date().toLocaleTimeString()
  activityLogDiv.innerHTML += `<p>[${timestamp}] ${message}</p>`
  activityLogDiv.scrollTop = activityLogDiv.scrollHeight
}

//om ett pets stats når 0, ta bort från dom och skriv ut i pjournal
function checkPetStatus(pet) {
  if (pet.energy === 0 || pet.fullness === 0 || pet.happiness === 0) {
    addLog(`You couldn't give ${pet.name} enough love, so he ran away..`)
    const petDiv = document.getElementById(pet.domId)
    if (petDiv) petDiv.remove()
    pet.stopTimer()
    pets = pets.filter(p => p !== pet)
  }
}

//musik
const audio = document.querySelector('#audioPlayer')
const playPauseButton = document.querySelector('#playPauseButton')

playPauseButton.addEventListener('click', () => {
  if (audio.paused) {
    audio.play()
    playPauseButton.textContent = 'Pause'
  } else {
    audio.pause()
    playPauseButton.textContent = 'Play'
  }
})
