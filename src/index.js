/** @jsx Kaif.h @jsxFrag Kaif.Fragment */
import Kaif from 'kaif'

import { io } from 'socket.io-client'
const socket = io()

window.socket = socket

socket.on('jwt', (token) => {
  localStorage.setItem('jwt', token)
})
let creds = localStorage.getItem('jwt')
const telegramAuth = () => {
  if (creds = window.Telegram.WebApp.initData) {
    socket.emit('login', {creds, loginType:'webapp'})
    socket.on('bad login', (code) => {
      console.log({message: 'sadge'})
    })
  } else {
    const queryString = location.search
    creds = queryString.substring(1)
    socket.emit('login', {creds, loginType: 'widget'})
    socket.on('bad login', (code) => {
      console.log({message: 'sadge'})
    })
  }
}
if (creds) {
  socket.emit('login', {creds, loginType: 'jwt'})
  socket.on('bad login', () => {
    localStorage.removeItem('jwt')
    telegramAuth()
  })
} else {
  telegramAuth()
}


import App from './App.jsx'

socket.once('logged in', () => {
  const tgButton = document.getElementById('telegram-login-your_bot')
  tgButton.style.display = 'none'

  const root = document.body
  const refresh = Kaif.init(root, App)
  window.KaifRefresh = refresh
})

