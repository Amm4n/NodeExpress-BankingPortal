const express = require('express')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// START READ ACCOUNT DATA //
const accountData = fs.readFileSync(path.join(__dirname, 'json', 'accounts.json'), 'utf8')
const accounts = JSON.parse(accountData)
// console.log('accounts', accounts)
// console.log('accountData', accountData)
// END READ ACCOUNT DATA //

// START READ USER DATA //
const userData = fs.readFileSync(path.join(__dirname, 'json', 'users.json'), 'utf8')
const users = JSON.parse(userData)
// console.log('users', users)
// console.log('userData', userData)
// END READ USER DATA //

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

app.get('/profile', (req, res) => {
  res.render('profile', { user: users[0] })
})

app.get('/transfer', (req, res) => {
  res.render('transfer', {})
})

app.post('/transfer', (req, res) => {
  // Making ptransfer
  // let transfer = {
  //   from: req.body.from,
  //   to: req.body.to,
  //   amount: req.body.amount
  // }

  accounts[req.body.from].balance -= req.body.amount
  accounts[req.body.to].balance += parseInt(req.body.amount, 10)

  let accountsJSON = JSON.stringify(accounts)

  fs.writeFileSync(path.join(__dirname, 'json', 'accounts.json'), accountsJSON, 'utf8')

  res.render('transfer', { message: 'Transfer Completed' })
})

app.get('/payment', (req, res) => {
  res.render('payment', { account: accounts.credit })
})

app.post('/payment', (req, res) => {
  accounts.credit.balance -= req.body.amount
  accounts.credit.available += parseInt(req.body.amount)
  let accountsJSON = JSON.stringify(accounts)
  fs.writeFileSync(path.join(__dirname, 'json', 'accounts.json'), accountsJSON, 'utf8')

  res.render('payment', { message: 'Payment Successful', account: accounts.credit })
})

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
