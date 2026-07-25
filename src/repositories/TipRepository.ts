export class TipRepository {
  private static instance: TipRepository;

  private constructor() {}

  public static getInstance(): TipRepository {
    if (!TipRepository.instance) {
      TipRepository.instance = new TipRepository();
    }
    return TipRepository.instance;
  }

  /**
   * Returns a list of daily sustainability tips.
   * Currently empty as part of mock removal phase.
   */
  public async getTips(): Promise<string[]> {
    return [];
  }
}
