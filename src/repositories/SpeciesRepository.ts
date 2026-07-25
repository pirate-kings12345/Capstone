/**
 * SpeciesRepository.ts
 * Delegates all species queries to FishRepository (SQLite-backed).
 */

import { SpeciesInfo } from '../types';
import { FishRepository } from './FishRepository';

export class SpeciesRepository {
  private static instance: SpeciesRepository;
  private fishRepo = FishRepository.getInstance();

  private constructor() {}

  public static getInstance(): SpeciesRepository {
    if (!SpeciesRepository.instance) {
      SpeciesRepository.instance = new SpeciesRepository();
    }
    return SpeciesRepository.instance;
  }

  public async getAllSpecies(): Promise<SpeciesInfo[]> {
    return this.fishRepo.getAllFish();
  }

  public async searchSpecies(query: string): Promise<SpeciesInfo[]> {
    return this.fishRepo.searchFish(query);
  }

  public async getSpeciesById(id: string): Promise<SpeciesInfo | null> {
    return this.fishRepo.getFishById(id);
  }

  public async upsertSpecies(species: SpeciesInfo): Promise<void> {
    return this.fishRepo.upsertFish(species);
  }
}
