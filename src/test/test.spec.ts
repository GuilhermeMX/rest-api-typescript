import { expect, test, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready() // Garantindo que meu arquivo app já tenha concluído todas as promises antes de começar os testes
  })

  afterAll(async () => {
    await app.close()
  })

  test('User can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  test('User can list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })
})