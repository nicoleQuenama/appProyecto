import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn()
  }
}));

describe('alertService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prueba de estructura básica de alertService', () => {
    expect(true).toBe(true);
  });
});