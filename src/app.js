const express = require('express')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { accounts, users, writeJSON } = require('./data')
const accountRoutes = require('./routes/accounts')
const servicesRoutes = require('./routes/services')
const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// // START READ ACCOUNT DATA //
// const accountData = fs.readFileSync(path.join(__dirname, 'json', 'accounts.json'), 'utf8')
// const accounts = JSON.parse(accountData)
// // console.log('accounts', accounts)
// // console.log('accountData', accountData)
// // END READ ACCOUNT DATA //

// // START READ USER DATA //
// const userData = fs.readFileSync(path.join(__dirname, 'json', 'users.json'), 'utf8')
// const users = JSON.parse(userData)
// // console.log('users', users)
// // console.log('userData', userData)
// // END READ USER DATA //

app.get('/', (req, res) => {
  res.render('index', { title: 'Account Summary', accounts })
})

app.get('/profile', (req, res) => {
  res.render('profile', { user: users[0] })
})

app.use('/account', accountRoutes)
app.use('/services', servicesRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
