import { AppDataSource } from "../db"; // Adjust the import based on your project structure
import { Profile } from "../db/entities/profile.entity"; // Adjust the import based on your Profile entity location

export class ProfileRepository {
  private profileRepo = AppDataSource.getRepository(Profile);

  async createProfile(userId: string, fullName: string): Promise<Profile> {
    const profile = this.profileRepo.create({
      user: {
        id: userId,
      },
      fullName,
    });
    return await this.profileRepo.save(profile);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return await this.profileRepo.findOne({ where: { user: { id: userId } } });
  }

  async updateProfile(
    userId: string,
    fullName?: string,
    bio?: string,
    avatarUrl?: string
  ): Promise<Profile | null> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Update fields if provided
    if (fullName !== undefined) profile.fullName = fullName;
    if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;

    await this.profileRepo.save(profile);
    return profile;
  }

  async deleteProfile(userId: string): Promise<void> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new Error("Profile not found");
    }
    await this.profileRepo.remove(profile);
  }
}
