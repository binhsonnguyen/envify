let listEnvironments = document.querySelector('.list-environments')
let btnAddEnv = document.getElementById('btn-add-env')
let btnSaveEnv = document.getElementById('btn-save-env')

let addEnvironment = (url, color) => {
  let environmentNode = document.createElement('section')
  environmentNode.classList.add('environment')

  let envColor = document.createElement('input')
  envColor.type = 'color'
  envColor.value = color || randomDefaultColor()
  environmentNode.appendChild(envColor)

  let envDomain = document.createElement('input')
  envDomain.type = 'text'
  envDomain.placeholder = '*.dev.example.com'
  envDomain.value = url || ''
  environmentNode.appendChild(envDomain)

  let envRemove = document.createElement('button')
  envRemove.className = 'btn-remove'
  envRemove.textContent = 'Remove'
  envRemove.addEventListener('click', () => removeEnvironment(environmentNode), false)
  environmentNode.appendChild(envRemove)

  listEnvironments.appendChild(environmentNode)
}

let randomDefaultColor = () => {
  const FLAT_COLORS = [
    '#0a84ff',
    '#00feff',
    '#ff1ad9',
    '#30e60b',
    '#ffe900',
    '#ff0039',
    '#9400ff',
    '#ff9400',
    '#363959',
    '#737373'
  ]
  return FLAT_COLORS[Math.floor(Math.random() * FLAT_COLORS.length)]
}

let removeEnvironment = section => section.remove()

let updateEnvironments = () => {
  let environments = {}
  listEnvironments.children.forEach(el => {
    let url = el.querySelector('input[type=text]').value
    if (!url) return
    environments[url] = el.querySelector('input[type=color]').value
  })

  browser.storage
    .sync
    .set({ 'environments': environments })
    .catch(err => {
      btnAddEnv.setCustomValidity('Could not save your environments')
      btnAddEnv.reportValidity()
    })
}

btnAddEnv.addEventListener('click', () => { addEnvironment() }, false)
btnSaveEnv.addEventListener('click', updateEnvironments, false)

document.addEventListener('DOMContentLoaded', () => {
  browser.storage
    .sync
    .get('environments')
    .then(results => {
      let { environments } = results
      Object
        .keys(environments)
        .forEach(value => addEnvironment(value, environments[value]))
    })
    .catch(err => {
      btnAddEnv.setCustomValidity('Could not load your environments')
      btnAddEnv.reportValidity()
    })
}, false)
