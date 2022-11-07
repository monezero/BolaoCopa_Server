import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      nome: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarurl: 'https://github.com/monezero.png',

    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example pool',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })
    
    await prisma.game.create({
      data: {
        date: '2022-12-08T12:00:00.201Z',
        firstTeamCountryCode: 'DE',
        secondTeamCountryCode: 'BR',
      }
    })

    await prisma.game.create({
      data: {
        date: '2022-12-09T12:00:00.201Z',
        firstTeamCountryCode: 'BR',
        secondTeamCountryCode: 'AR',

        guesses: {
          create: {
            firstTeamPoints: 2,
            secondTeamPoints: 1,

            participant: {
              connect: {
                userId_poolId: {
                  userId: user.id,
                  poolId: pool.id,
                }
              }
            }
          }
        }
      }
    })
}

main()