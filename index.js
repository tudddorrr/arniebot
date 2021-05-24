'use strict'

require('dotenv').config()
const Discord = require('discord.js')
const casual = require('casual')
const schedule = require('node-schedule')

let work = []

const sendWork = (user, instant) => {
  const delay = instant ? 0 : casual.integer(0, process.env.MAX_DELAY_MINS * 60000)
  console.log(`[info] sending work in ${(delay / 60000).toFixed(2)} mins`)

  setTimeout(() => {
    if (work.length === 0) {
      console.log('[info] no work set')
      user.send('apparently there\'s no work that needs doing. give me some to give you using !setwork work1, work2, etc')
      return
    }

    const greetings = ['hey hey hey', 'yo', 'evenin\'', 'ey', 'time for some work', 'sup']
    const workIntro = ['here\'s what needs doing', 'this is the work that needs doing', 'stuff that still needs ticking off']

    user.send(`${casual.random_element(greetings)}. ${casual.random_element(workIntro)}: ${work.join(', ')}`)

    console.log('[info] work sent')
  }, delay)
}

const main = async () => {
  const client = new Discord.Client()
  client.login(process.env.DISCORD_TOKEN)

  client.once('ready', async () => {
    await client.guilds.cache.first().members.fetch()
    const user = client.users.cache.get(process.env.USER_ID)

    schedule.scheduleJob(process.env.SCHEDULE, () => {
      sendWork(user)
    })

    console.log(`[info] bot ready, using schedule: '${process.env.SCHEDULE}' and max delay mins: ${process.env.MAX_DELAY_MINS}`)

    user.send('hey, i need some work to give you. reply with !setwork work1, work2, etc')
  })

  client.on('message', (msg) => {
    if (msg.author.bot) return

    console.log(`[info] incoming message: ${msg.content}`)

    if (msg.content.startsWith('!')) {
      const splitMsg = msg.content.split(' ')
      const command = splitMsg[0]
      const args = msg.content.split(`${command} `)[1]

      switch (splitMsg[0]) {
        case '!setwork':
          const tempWork = args?.split(',').map((w) => w.trim())

          if (!tempWork || tempWork.length === 0) {
            msg.reply('there\'s no work there. give me work in a comma separated list')
          } else {
            work = tempWork
            console.log(`[info] work set to: ${work.join(', ')}`)

            msg.reply(`okay so the current work is now: ${work.join(', ')}`)
            msg.react('✅')
          }
          break
        case '!work':
          sendWork(msg.author, true)
          break
      }
    } else {
      let replies = []
      let emoji = []

      switch (msg.content.toLowerCase()) {
        case 'yeah':
        case 'yes':
        case 'ok':
        case 'okay':
        case 'fine':
          replies = ['thanks m8', 'thanks', 'cheers', 'cheers m8', 'noice', 'nice ty', 'ty', 'wooo', 'cool cheers', 'cool ty', 'cool']
          msg.reply(casual.random_element(replies))

          emoji = ['✅', '🥲', '🎉', '👍', '👌', '😍', '😀', '🤩', '😁']
          msg.react(casual.random_element(emoji))
          break
        case 'no':
          replies = ['yes', 'please', 'pls', 'come on']
          msg.reply(casual.random_element(replies))

          emoji = ['💔', '🥺', '😡', '😢', '😭']
          msg.react(casual.random_element(emoji))
          break
        case 'why':
        case 'y':
          replies = ['cause we gotta get shit done', 'cause you asked to be spammed to do work', 'you know why', 'cause there\'s stuff that needs doing', 'why not', 'we got shit to do', 'why!? you know why', 'yeah yeah get on with it']
          msg.reply(casual.random_element(replies))
          break
        case 'give me some work':
        case 'gimme work':
        case 'gimme some work':
        case 'what needs doing':
        case 'i need work':
        case 'any work?':
          sendWork(msg.author, true)

          emoji = ['😮', '❗', '🎉', '😍', '⭐', '🙌']
          msg.react(casual.random_element(emoji))
          break
        default:
          replies = ['i dunno what you mean', 'huh', 'what?', 'i dont get what you mean', 'no clue what you just said', 'i don\'t speak american', 'u wot']
          msg.reply(casual.random_element(replies))
      }
    }
  })
}

main()
