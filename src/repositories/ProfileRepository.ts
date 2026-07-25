import { UserProfile } from "../types";

export class ProfileRepository {
  private static instance: ProfileRepository;

  private constructor() {}

  public static getInstance(): ProfileRepository {
    if (!ProfileRepository.instance) {
      ProfileRepository.instance = new ProfileRepository();
    }
    return ProfileRepository.instance;
  }

  public async getProfile(): Promise<UserProfile | null> {
    return null;
  }

  public async saveProfile(profile: UserProfile): Promise<void> {
    // Expose signature only
  }
}
