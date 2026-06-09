const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url = `mongodb://fullstack:${password}@ac-qs5sftb-shard-00-00.yhyqgh3.mongodb.net:27017,ac-qs5sftb-shard-00-01.yhyqgh3.mongodb.net:27017,ac-qs5sftb-shard-00-02.yhyqgh3.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-lkgr90-shard-0&authSource=admin&appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })


const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})


const Phonebook = mongoose.model('Phonebook', phonebookSchema)


if (process.argv.length === 5) {
  const entry = new Phonebook({
    name: process.argv[3],
    number: process.argv[4],
  })

  entry.save().then(() => {
    console.log(`added ${entry.name} number ${entry.number} to phonebook`)
    mongoose.connection.close()
  })
}else if (process.argv.length === 3) {
  console.log('phonebook:')
  Phonebook.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
  })
}