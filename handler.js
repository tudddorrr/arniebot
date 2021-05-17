'use strict'

const Discord = require('discord.js')

// const messages = [
//   '🚨 Time to do some work',
//   '⏰ Ring ring, it\'s work o\'clock',
//   '📟 Beep beep, the 90\'s just called, they\'re saying you should open up Paint and do some work',
//   '👋 Hey, it\'s your daily reminder to do some work',
//   '🙏 Please do some work',
//   '🌙 Time for some indie video game development',
//   '🎮 Do some work on whatever game we\'re working on',
//   '📝 Time to tick something off the to-do list',
//   '🦾 Stretch those finger muscles, do some pixel art',
//   '🎨 Time to boot up Paint and get to work'
// ]

const messages = [
  'hello darrel, it is me, your good friend mrala, the latest hire at sleepy studios. it has come to my attention that you are once again slacking. please rate some games tonight. lots of love.'
]

module.exports.alarm = async () => {
  const client = new Discord.Client()
  client.login(process.env.DISCORD_TOKEN)

  await new Promise((resolve) => {
    client.once('ready', resolve)
  })

  await client.guilds.cache.first().members.fetch()

  const user = client.users.cache.get(process.env.USER_ID)
  await user.send(messages[Math.floor(Math.random() * messages.length)])

  client.destroy()

  return {
    statusCode: 200
  }
}
