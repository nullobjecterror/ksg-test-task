import { DatabaseError } from 'pg';
import pool from '../db';

export async function purchaseItem({
  userId,
  amount,
}: {
  userId: number;
  amount: number;
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const res = await client.query<{ balance: number }>('SELECT balance FROM users WHERE id = $1', [
      userId,
    ]);

    if (res.rows.length === 0) {
      throw new Error('User not found');
    }

    await client.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [amount, userId]
    ).catch(e => {
      if(e instanceof DatabaseError && e.constraint === 'users_balance_check') {
        throw new Error('Insufficient balance');
      }

      throw e;
    })

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
