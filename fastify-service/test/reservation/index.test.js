import { describe, it, expect, vi, beforeEach } from 'vitest';
import db from '../../config/db.js';
import { createReservation } from '../../features/reservation/public/reservation.service.js';

vi.mock('../../config/db.js');

describe('createReservation', () => {
  const baseReservation = {
    username: 'haikal',
    date_start: '2030-01-01',
    time_start: '20:00',
    date_end: '2030-01-01',
    time_end: '21:00',
    name: 'Test Reservation',
    email: 'haikal@example.com',
    description: 'Telescope observation'
  };

  const user = { id: 1 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects if user not found', async () => {
    db.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      first: vi.fn().mockResolvedValue(null)
    });

    await expect(createReservation(baseReservation)).rejects.toThrow('User not found!');
  });

  it('rejects reservation in the past', async () => {
    const pastReservation = { ...baseReservation, date_start: '2000-01-01' };

    db.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      first: vi.fn().mockResolvedValue(user)
    });

    const result = await createReservation(pastReservation);
    expect(result.error).toMatch('Ada rentang jam observasi yang sudah di reservasi!');
  });

  it('rejects overlapping reservation', async () => {
    db
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(user)
      })
      .mockReturnValueOnce({
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue({ id: 999 }) // conflict exists
      });

    const result = await createReservation(baseReservation);
    expect(result.error).toMatch(/sudah di reservasi/i);
  });

  it('inserts reservation when valid', async () => {
    db
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(user)
      })
      .mockReturnValueOnce({
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(null) // no conflict
      })
      .mockReturnValueOnce({
        insert: vi.fn().mockResolvedValue([42])
      });

    const result = await createReservation(baseReservation);
    expect(result).toEqual([42]);
  });
});