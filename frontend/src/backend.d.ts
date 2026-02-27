import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GenerationParameters {
    roughness: number;
    patternStyle: string;
    metalness: number;
    colorPalette: Array<string>;
    tilingScale: number;
}
export interface TexturePreset {
    owner: Principal;
    name: string;
    parameters: GenerationParameters;
    timestamp: bigint;
    materialType: MaterialType;
}
export interface UserProfile {
    name: string;
}
export enum MaterialType {
    metal = "metal",
    organic = "organic",
    wood = "wood",
    stone = "stone",
    plastic = "plastic",
    fabric = "fabric"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePreset(name: string): Promise<void>;
    getAllPresets(): Promise<Array<TexturePreset>>;
    getAllPresetsByName(): Promise<Array<TexturePreset>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPreset(name: string): Promise<TexturePreset | null>;
    getPresetsByMaterialType(materialType: MaterialType): Promise<Array<TexturePreset>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePreset(name: string, materialType: MaterialType, parameters: GenerationParameters): Promise<void>;
}
