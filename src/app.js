const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

// START READ ACCOUNT DATA //
const accountData = fs.readFileSync('src/json/accounts.json', 'utf8', (err, file) => {
  if (err) {
    console.log('err', err)
  } else {
    accDataObj = JSON.parse(accountData)
    console.log('accDataObj', accDataObj)
  }
})

const accounts = JSON.parse(accountData)
// console.log('accounts', accounts)
// console.log('accountData', accountData)
// END READ ACCOUNT DATA //

app.get('/', (req, res) => {
  res.render('index', { title: 'Account Summary', accounts })
})

app.get('/savings', (req, res) => {
  res.render('account', { account: accounts.savings })
})

app.get('/checking', (req, res) => {
  res.render('account', { account: accounts.checking })
})

app.get('/credit', (req, res) => {
  res.render('account', { account: accounts.credit })
})

// START READ USER DATA //
const userData = fs.readFileSync('src/json/users.json', 'utf8', err => {
  if (err) {
    console.log('err', err)
  } else {
    userDataObj = JSON.parse(userData)
    console.log('userDataObj', userDataObj)
  }
})

const users = JSON.parse(userData)
// console.log('users', users)
// console.log('userData', userData)
// END READ USER DATA //

app.get('/profile', (req, res) => {
  res.render('profile', { user: users[0] })
})

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
