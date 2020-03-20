const express = require('express')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))

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

  var getSavings = _.get(accounts, 'savings')
  var getChecking = _.get(accounts, 'checking')
  let from = req.body.from
  let to = req.body.to
  let amount = req.body.amount
  from === 'savings'
    ? (getSavings.balance = getSavings.balance - amount)
    : (getChecking.balance = getChecking.blance - amount)

  to === 'savings'
    ? (getSavings.balance = getSavings.balance + amount)
    : (getChecking.balance = getChecking.blance + amount)

  const accountsJSON = JSON.stringify(accounts)

  fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, 'utf8')

  res.render('transfer', { message: 'Transfer Completed' })

  // FROM Balance
  // get current balance (savings/checking) -> currentbalance - amount -> set currentbalance = new amount
  res.redirect('/')
})

app.get('/payment', (req, res) => {
  res.render('payment', { account: accounts.credit })
})

app.post('/payment', (req, res) => {
  let accCreditBalance = _.get(accounts, 'credit.balance')
  accCreditBalance = accCreditBalance - req.body.amount
  let accCreditAvailable = _.get(accounts, 'credit.available')
  accCreditAvailable = parseInt(req.body.amount) + parseInt(accCreditAvailable)
  const accountsJSON = JSON.stringify(accounts)
  fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, 'utf8')

  res.render('payment', { message: 'Payment Successful', account: accounts.credit })
})

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
