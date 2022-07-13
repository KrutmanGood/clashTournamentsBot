const { Telegraf, Markup } = require('telegraf')
const fs = require('fs')

const token = '5287833118:AAHGYwi8IyeitRag-tne1HWLS7YdmCTgXic'
const bot = new Telegraf(token)

const groupId = -1001731797871
const listMessageId = 373
const myId = 851424962

const paymentButtons = [
    [
        Markup.button.callback('Qiwi', 'buttonQiwi'),
        Markup.button.callback('Карта', 'buttonCard'),
    ],
]

const proofOfPaymentQiwi = [
    [
        Markup.button.callback('💰 Проверить оплату', 'buttonQiwiText'),
    ]
]

const proofOfPaymentCard = [
    [
        Markup.button.callback('💳 Проверить оплату', 'buttonCardText'),
    ]
]

const linkToChannel = [
    [
        Markup.button.url('Перейти в телеграм канал', 'https://t.me/+laZq3atsMAo2NzZi'),
    ]
]

const repeat = [
    [
        Markup.button.callback('Повторить оплату', 'buttonRepeat'),
    ],
]

bot.start(async ctx => {
    const messageInfo = ctx.update.message
    
    await ctx.replyWithSticker('CAACAgIAAxkBAAOuYstStLQt81g61gk0uPr8Abd9mZ8AAmsFAAI_lcwKnojHcHpOexMpBA')
    await ctx.reply(`*Привет, ${messageInfo.from.first_name}!*\n\nЗдесь вы сможете оплатить участие в турнире от канала @ClashFreeTours.\n\nИтак, для начала выберите удобный для вас способ оплаты:`, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: paymentButtons, resize_keyboard: true, },
    })
})

bot.action(/.+/, async ctx => {
    try {
        const callbackInfo = ctx.update.callback_query

        console.log(callbackInfo.message)
    
        if (callbackInfo.data == 'buttonQiwi') {
            
            await ctx.replyWithSticker('CAACAgIAAxkBAAO0YstUcP86oNZTmVNSRGJs2Xn3cD0AAkgDAAK1cdoG6qiC7oVZ2HYpBA')
            await ctx.reply(`*Отлично! Дело за малым:*\n\n[MFMIKO](https://qiwi.com/n/MFMIKO) — перейдите в приложение *QIWI Кошелек*, просто нажав на данный номер.\n\nКак только переведете необходимую сумму на данный *QIWI Кошелек*, нажмите на кнопку «*Проверить оплату*», чтобы мы могли убедиться в достоверности оплаты.`, {
                reply_markup: { keyboard: proofOfPaymentQiwi, resize_keyboard: true, },
                parse_mode: 'Markdown',
            })

        } else if (callbackInfo.data == 'buttonCard') {
            await ctx.replyWithSticker('CAACAgIAAxkBAAO2YstUh6HkCk7edqdBPanOb_JMjnoAAnkAA-SgzgekUWrPo079hykE')
            await ctx.reply(`*Отлично! Дело за малым:*\n\n\`4693 9575 7491 8590\` — скопируйте номер карты, просто нажав на него.\n\nИмя держателя карты:\n\`MIKHAIL KRUPEEV\`\n\nКак только переведете необходимую сумму на данную карту, нажмите на кнопку «*Проверить оплату*», чтобы мы могли убедиться в достоверности оплаты.`, {
                reply_markup: { keyboard: proofOfPaymentCard, resize_keyboard: true, },
                parse_mode: 'Markdown',
            })

        } else {
            const cancelId = callbackInfo.data.split('/')
            const messageId = callbackInfo.message.message_id
            
            const adminId = callbackInfo.from.id
            const adminUsername = callbackInfo.from.username
    
            if (cancelId[0] == 'confirm') {
                await ctx.telegram.sendSticker(cancelId[1], 'CAACAgIAAxkBAAIBq2LLbOVEQixjHmgNjSRCzYt4RgjRAALLAAP3AsgPoCR023uD5FopBA')
                await ctx.telegram.sendMessage(cancelId[1], `*Оплата прошла успешно!*\n\nТеперь перейдите в приватный телеграм-канал, нажав на кнопку под сообщением, чтобы быть в курсе новостей о предстоящем турнире\n\nОрганизатор: *MIKO SQUAD*`, {
                    parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: linkToChannel, resize_keyboard: true, },
                })
                await ctx.telegram.editMessageText(groupId, messageId, messageId, `*Оплата прошла успешно!*\n\nПроверил: [@${adminUsername}](tg://user?id=${adminId})`, {
                    parse_mode: 'Markdown',
                })
    
                await fs.readFile('files/users.txt', { encoding: 'utf-8' }, async (err, data) => {
                    const newUser = `${cancelId[4]} `
                    const newData = data + newUser
            
                    await fs.writeFileSync('files/users.txt', newData)
    
                    const userArray = newData.split(' ')
                    userArray.pop()
    
                    await ctx.telegram.editMessageText(groupId, listMessageId, listMessageId, `Количество записавшихся в турнир: *${userArray.length}*💰`, {
                        parse_mode: 'Markdown',
                    })
                })
            }
            
            if (cancelId[0] == 'cancel') {
    
                await ctx.telegram.sendSticker(cancelId[1], 'CAACAgIAAxkBAAICNWLLfBvC4xkZ5o2IocPxY1jsjxILAAIGCwACa4igS8COtjwg5GXSKQQ')
                await ctx.telegram.sendMessage(cancelId[1], `Оплаты совершено не было...\n\nЕсли это не так, напишите @Miko_FK`, {
                    reply_markup: { keyboard: repeat, resize_keyboard: true, },
                })
                await ctx.telegram.editMessageText(groupId, messageId, messageId, `*Оплата, к сожалению, прошла не успешно... *\n\nПроверил: [@${adminUsername}](tg://user?id=${adminId})`, {
                    parse_mode: 'Markdown',
                })
    
            }
        }
    } catch (e) {
        console.error('action error')
    }
})              

bot.command('help', ctx => {
    ctx.reply('Я бот, че `lol`', {
        parse_mode: 'Markdown'
    })
})

bot.on('sticker', async ctx => { console.log('Стикер') })

bot.on('message', async ctx => {
    const messageInfo = ctx.update

    try {
        if (messageInfo.message.text == '💰 Проверить оплату') {

            const adminsButtons = [
                [
                    Markup.button.callback('✅ Оплата прошла', `confirm/${messageInfo.message.chat.id}/${messageInfo.message.chat.username}/${messageInfo.message.chat.id}/${messageInfo.message.from.id}`),
                ],
                [
                    Markup.button.callback('❌ Оплата не прошла', `cancel/${messageInfo.message.chat.id}`),
                ],
            ]
    
            await ctx.replyWithSticker('CAACAgIAAxkBAAPvYstc6fSk-uikYDL8u5IW_uCYpHwAAiAJAAIYQu4I4YogqKE6CtkpBA')
            await ctx.reply('Наш модератор проверяет вашу оплату, ожидайте...', {
                parse_mode: 'Markdown',
                reply_markup: { hide_keyboard: true }
            })
    
            const date = getDate()
            const finalTime = getTime()
    
            await ctx.telegram.sendMessage(groupId, `Пользователь [${messageInfo.message.chat.first_name}](tg://user?id=${messageInfo.message.chat.id}) ожидает, когда будет проверена его оплата.\n\nВремя отправки: ${startTime}-${finalTime}\nДата отправки: ${date}\nСпособ оплаты: Qiwi💰`,
            {
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: adminsButtons, resize_keyboard: true, }
            },
            )
        }
    
        if (messageInfo.message.text == '💳 Проверить оплату') {
            
            const adminsButtons = [
                [
                    Markup.button.callback('✅ Оплата прошла', `confirm/${messageInfo.message.chat.id}/${messageInfo.message.chat.username}/${messageInfo.message.chat.id}`),
                ],
                [
                    Markup.button.callback('❌ Оплата не прошла', `cancel/${messageInfo.message.chat.id}`),
                ],
            ]
    
            await ctx.replyWithSticker('CAACAgIAAxkBAAPvYstc6fSk-uikYDL8u5IW_uCYpHwAAiAJAAIYQu4I4YogqKE6CtkpBA')
            await ctx.reply('Наш модератор проверяет вашу оплату, ожидайте...', {
                parse_mode: 'Markdown',
                reply_markup: { hide_keyboard: true }
            })
    
            const date = getDate()
            const finalTime = getTime()
    
            await ctx.telegram.sendMessage(groupId, `Пользователь [${messageInfo.message.chat.first_name}](tg://user?id=${messageInfo.message.chat.id}) ожидает, когда будет проверена его оплата.\n\nВремя отправки: ${startTime}-${finalTime}\nДата отправки: ${date}\nСпособ оплаты: Карта💳`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: adminsButtons, resize_keyboard: true, }
                },
            )
        }
    
        if (messageInfo.message.from.id == myId && messageInfo.message.text == 'Lox') {
            await fs.readFile('files/users.txt', { encoding: 'utf-8' }, async (err, data) => {
                const userArray = data.split(' ')
                userArray.pop()
    
                for (let i = 0; i < userArray.length; i++) {
                    await ctx.telegram.sendMessage(userArray[i], messageInfo.message.text,
                        {
                            parse_mode: 'Markdown',
                        },
                )}
            })
        }

        if (messageInfo.message.text == 'Повторить оплату') {
            await ctx.reply(`Итак, для начала выберите удобный для вас способ оплаты:`, {
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: paymentButtons, resize_keyboard: true, },
            })
        }
    
    } catch (e) {
        console.error('message error', e)
    }
})

    
bot.launch()

function getDate() {
    const date = new Date()
    
    let day = date.getDate()

    if (day <= 9) {
        day = '0' + day
    }

    let month = date.getMonth() + 1

    if (month <= 9) {
        month = '0' + month
    }

    const year = date.getFullYear()
    
    return `${day}.${month}.${year}`
}

function getTime() {
    const date = new Date()
    
    let hour = date.getHours()

    if (hour <= 9) {
        hour = '0' + hour
    }

    let minute = date.getMinutes()

    if (minute <= 9) {
        minute = '0' + minute
    }

    return `${hour}:${minute}`
}